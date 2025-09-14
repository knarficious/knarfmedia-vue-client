import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { vitePrerenderPlugin } from 'vite-prerender-plugin'
import fs from 'fs'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),

    // Prérendu
    vitePrerenderPlugin({
      renderTarget: '#app', // ID du mount point
      prerenderScript: path.resolve(__dirname, 'prerender.ts'), // ton script de prérendu     
    })
  ],

  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'certs/localhost-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'certs/localhost-cert.pem')),
    },
    port: 5173,
    host: 'localhost',
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  build: {
    target: 'esnext', // nécessaire pour vite-prerender-plugin
    rollupOptions: {
      output: {
        manualChunks: undefined, // éviter les chunk split qui bloquent le prérendu
      }
    }
  }
})
