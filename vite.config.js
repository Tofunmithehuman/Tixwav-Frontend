import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Inject the deployed commit SHA so we can confirm in the browser which build
  // is actually live (Vercel sets VERCEL_GIT_COMMIT_SHA at build time).
  define: {
    "import.meta.env.VITE_BUILD_SHA": JSON.stringify(
      (process.env.VERCEL_GIT_COMMIT_SHA || "dev").slice(0, 7),
    ),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})