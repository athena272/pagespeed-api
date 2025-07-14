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
  Grid,
  Paper,
  AppBar,
  Toolbar,
  CssBaseline,
  Stack,
} from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';

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
      <Container maxWidth="md" sx={{ py: 6 }}>
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
          </Stack>
        </Box>
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Grid container spacing={3}>
                {results.map(({ url, score, status }) => (
                  <Grid item xs={12} md={6} key={url}>
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
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </>
  );
}
