import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // In production the build output is served by Laravel from
  // backend/public/app (see routes/web.php and the deployment
  // Dockerfile), so assets are referenced from that base path. The dev
  // server keeps serving from the root as usual.
  base: command === 'build' ? '/app/' : '/',
  build: {
    outDir: '../backend/public/app',
    emptyOutDir: true,
  },
}))
