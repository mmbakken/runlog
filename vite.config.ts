import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import { createHtmlPlugin } from 'vite-plugin-html'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  resolve: {
    alias: {
      app: path.resolve(__dirname, './src'),
      components: path.resolve(__dirname, './src/components'),
      styles: path.resolve(__dirname, './src/styles'),
      utils: path.resolve(__dirname, './src/utils'),
    },
  },
  plugins: [
    react(),
    createHtmlPlugin({
      minify: true,
    }),
  ],
  server: {
    port: 3000,
  },
})
