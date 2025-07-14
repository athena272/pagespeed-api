// src/App.tsx
import { useState } from 'react';
import CategoryPieChart from './components/CategoryPieChart';
import MetricFilter from './components/MetricFilter';
import { motion, AnimatePresence } from 'framer-motion';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface Result {
  url: string;
  score: number;
  status: Status;
}

export default function App() {
  const [urls, setUrls] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('performance');
  const [results, setResults] = useState<Result[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeUrls = async () => {
    const list = urls
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    setIsAnalyzing(true);

    const initialResults: Result[] = list.map((url) => ({
      url,
      score: 0,
      status: 'loading'
    }));

    setResults(initialResults);

    const key = import.meta.env.VITE_PSI_API_KEY;

    const updatedResults = await Promise.all(
      initialResults.map(async (item) => {
        try {
          const res = await fetch(
            `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
              item.url
            )}&key=${key}`
          );
          const json = await res.json();

          const score =
            json?.lighthouseResult?.categories?.[selectedMetric]?.score ?? 0;

          return {
            ...item,
            score: Math.round(score * 100),
            status: 'success' as Status
          };
        } catch {
          return { ...item, status: 'error' as Status };
        }
      })
    );

    setResults(updatedResults);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 flex items-center gap-2">
          <span role="img">📊</span> PageSpeed Insights
        </h1>

        <textarea
          className="w-full h-36 p-3 border border-blue-200 rounded mb-4 resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Digite uma ou mais URLs, uma por linha"
          cols={100}
          rows={16}
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
        />

        <MetricFilter selected={selectedMetric} onChange={setSelectedMetric} />

        <button
          onClick={analyzeUrls}
          disabled={isAnalyzing}
          className={`px-6 py-2 rounded font-semibold transition mb-8 shadow-md ${isAnalyzing
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
        >
          {isAnalyzing ? '🔄 Analisando...' : '🚀 Analisar todas'}
        </button>

        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              className="grid md:grid-cols-2 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {results.map(({ url, score, status }) => (
                <motion.div
                  key={url}
                  layout
                  className="bg-white p-4 rounded shadow border border-gray-100 flex flex-col justify-between hover:shadow-lg transition"
                >
                  <p className="text-sm text-blue-700 break-all mb-3 font-semibold">
                    🔗 {url}
                  </p>

                  {status === 'loading' && (
                    <div className="text-yellow-600 font-medium text-center animate-pulse">
                      ⏳ Analisando...
                    </div>
                  )}

                  {status === 'error' && (
                    <div className="text-red-600 font-medium text-center">
                      ❌ Erro ao processar
                    </div>
                  )}

                  {status === 'success' && (
                    <CategoryPieChart label={selectedMetric} score={score} />
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
