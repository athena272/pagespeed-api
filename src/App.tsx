// src/App.tsx
import { useState } from 'react';
import CategoryPieChart from './components/CategoryPieChart';
import MetricFilter from './components/MetricFilter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  AppBar,
  Toolbar,
  CssBaseline,
  Stack,
} from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface PageSpeedAudit {
  id: string;
  title: string;
  description: string;
  score: number | null;
  scoreDisplayMode?: string;
  displayValue?: string;
  metricSavings?: {
    LCP?: number;
    FCP?: number;
  };
  overallSavingsBytes?: number;
  overallSavingsMs?: number;
}

interface PageSpeedResponse {
  lighthouseResult?: {
    audits?: Record<string, PageSpeedAudit>;
    categories?: Record<string, { score: number }>;
  };
}

interface Result {
  url: string;
  score: number;
  status: Status;
  details?: PageSpeedResponse; // Dados completos da API
  problems?: Problem[];
}

interface Problem {
  id: string;
  title: string;
  description: string;
  score: number;
  category: string;
  impact?: string;
  savings?: {
    bytes?: number;
    ms?: number;
  };
}

export default function App() {
  const [urls, setUrls] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('performance');
  const [results, setResults] = useState<Result[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDetailedReport, setShowDetailedReport] = useState(false);

  const extractProblems = (apiResponse: PageSpeedResponse, category: string): Problem[] => {
    const problems: Problem[] = [];
    
    if (apiResponse?.lighthouseResult?.audits) {
      Object.entries(apiResponse.lighthouseResult.audits).forEach(([id, audit]: [string, PageSpeedAudit]) => {
        if (audit.score !== null && audit.score < 1) {
          problems.push({
            id,
            title: audit.title,
            description: audit.description,
            score: audit.score,
            category,
            impact: audit.scoreDisplayMode === 'metricSavings' ? audit.displayValue : undefined,
            savings: audit.metricSavings ? {
              bytes: audit.overallSavingsBytes,
              ms: audit.overallSavingsMs
            } : undefined
          });
        }
      });
    }
    
    return problems;
  };

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

    let completed = 0;
    list.forEach(async (url, idx) => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${key}`
        );
        const json = await res.json();
        const score = json?.lighthouseResult?.categories?.[selectedMetric]?.score ?? 0;
        const problems = extractProblems(json, selectedMetric);
        setResults(prev => prev.map((item, i) =>
          i === idx
            ? {
                ...item,
                score: Math.round(score * 100),
                status: 'success' as Status,
                details: json,
                problems
              }
            : item
        ));
      } catch {
        setResults(prev => prev.map((item, i) =>
          i === idx ? { ...item, status: 'error' as Status } : item
        ));
      } finally {
        completed++;
        if (completed === list.length) {
          setIsAnalyzing(false);
        }
      }
    });
  };

  const downloadReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      metric: selectedMetric,
      results: results.map(r => ({
        url: r.url,
        score: r.score,
        problems: r.problems || []
      }))
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pagespeed-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>
          <InsightsIcon sx={{ mr: 1 }} fontSize="large" />
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            PageSpeed Insights
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box mb={4}>
          <TextField
            label="Digite uma ou mais URLs, uma por linha"
            multiline
            minRows={4}
            fullWidth
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            variant="outlined"
            sx={{ mb: 3 }}
          />
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems="center"
            justifyContent="flex-start"
            sx={{ mb: 4 }}
          >
            <MetricFilter selected={selectedMetric} onChange={setSelectedMetric} />
            <Button
              onClick={analyzeUrls}
              disabled={isAnalyzing}
              variant="contained"
              color="primary"
              size="large"
              sx={{ minWidth: 180 }}
              startIcon={isAnalyzing ? null : <InsightsIcon />}
            >
              {isAnalyzing ? '🔄 Analisando...' : 'Analisar todas'}
            </Button>
            {results.length > 0 && results.some(r => r.status === 'success') && (
              <Button
                onClick={() => setShowDetailedReport(!showDetailedReport)}
                variant="outlined"
                color="secondary"
                size="large"
              >
                {showDetailedReport ? 'Ocultar' : 'Ver'} Relatório Detalhado
              </Button>
            )}
            {results.length > 0 && results.some(r => r.status === 'success') && (
              <Button
                onClick={downloadReport}
                variant="outlined"
                color="success"
                size="large"
              >
                📥 Baixar Relatório
              </Button>
            )}
          </Stack>
        </Box>
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {showDetailedReport && (
                <Box mb={4}>
                  <Typography variant="h6" gutterBottom>
                    📊 Relatório Detalhado - {selectedMetric}
                  </Typography>
                  {results.filter(r => r.status === 'success').map((result) => (
                    <Paper key={result.url} elevation={2} sx={{ p: 3, mb: 2 }}>
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        🔗 {result.url} - Score: {result.score}/100
                      </Typography>
                      {result.problems && result.problems.length > 0 ? (
                        <Box>
                          <Typography variant="subtitle2" color="error" gutterBottom>
                            ❌ {result.problems.length} problema(s) encontrado(s):
                          </Typography>
                          {result.problems.map((problem) => (
                            <Box key={problem.id} sx={{ ml: 2, mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                              <Typography variant="body2" fontWeight="bold" color="error">
                                {problem.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {problem.description}
                              </Typography>
                              {problem.impact && (
                                <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
                                  💡 Impacto: {problem.impact}
                                </Typography>
                              )}
                              {problem.savings && (
                                <Typography variant="body2" color="info.main" sx={{ mt: 1 }}>
                                  📈 Economia potencial: {problem.savings.bytes ? `${Math.round(problem.savings.bytes / 1024)}KB` : ''} {problem.savings.ms ? `${problem.savings.ms}ms` : ''}
                                </Typography>
                              )}
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="success.main">
                          ✅ Nenhum problema encontrado nesta categoria!
                        </Typography>
                      )}
                    </Paper>
                  ))}
                </Box>
              )}
              <Box
                display="grid"
                gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
                gap={3}
              >
                {results.map(({ url, score, status }) => (
                  <Box key={url}>
                    <motion.div layout>
                      <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2" color="primary" sx={{ wordBreak: 'break-all', mb: 2, fontWeight: 600 }}>
                          🔗 {url}
                        </Typography>
                        {status === 'loading' && (
                          <Typography color="warning.main" align="center" sx={{ fontWeight: 500 }}>
                            ⏳ Analisando...
                          </Typography>
                        )}
                        {status === 'error' && (
                          <Typography color="error.main" align="center" sx={{ fontWeight: 500 }}>
                            ❌ Erro ao processar
                          </Typography>
                        )}
                        {status === 'success' && (
                          <CategoryPieChart label={selectedMetric} score={score} />
                        )}
                      </Paper>
                    </motion.div>
                  </Box>
                ))}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </>
  );
}
