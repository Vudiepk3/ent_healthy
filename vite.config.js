import { cpSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

function copyLocalJsonData() {
  return {
    name: 'copy-local-json-data',
    closeBundle() {
      const source = resolve(__dirname, 'src/data');
      const target = resolve(__dirname, 'dist/src/data');

      if (existsSync(source)) {
        cpSync(source, target, { recursive: true });
      }
    }
  };
}

export default defineConfig({
  base: '/',

  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        video: resolve(__dirname, 'video.html'),
        news: resolve(__dirname, 'news.html')
      }
    }
  },

  plugins: [copyLocalJsonData()]
});