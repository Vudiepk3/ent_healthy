import express from 'express';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get('/video/*', (_req, res) => {
  res.sendFile(join(__dirname, 'video.html'));
});

app.get('/news/*', (_req, res) => {
  res.sendFile(join(__dirname, 'news.html'));
});

app.get('/', (_req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`ENT Health Hub running at http://localhost:${port}`);
});
