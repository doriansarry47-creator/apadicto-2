import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3001;

// Configuration du proxy pour l'API
const apiProxy = createProxyMiddleware({
  target: 'http://localhost:5000',
  changeOrigin: true,
  pathFilter: '/api/**',
  logLevel: 'debug'
});

app.use(apiProxy);

// Servir les fichiers statiques du build
app.use(express.static(path.join(__dirname, 'dist/public')));

// Route catch-all pour les SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Frontend server running on http://0.0.0.0:${port}`);
});