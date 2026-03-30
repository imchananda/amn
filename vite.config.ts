import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // @ts-expect-error process is defined in the Node environment where Vite runs
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    base: './', // For GitHub Pages deployment
    server: {
      proxy: {
        '/api/sheet': {
          target: 'https://docs.google.com',
          changeOrigin: true,
          rewrite: (path) => {
            const url = new URL(path, 'http://localhost');
            const gid = url.searchParams.get('gid');
            const sheetId = env.SHEET_ID || '';
            if (!sheetId) console.warn('⚠️ SHEET_ID environment variable is missing!');
            return `/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
          }
        },
        '/api/gdrive': {
          target: 'https://lh3.googleusercontent.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/gdrive/, ''),
          headers: {
            'Referer': 'https://drive.google.com',
          }
        }
      }
    }
  }
})
