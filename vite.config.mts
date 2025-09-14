import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { vitePrerenderPlugin } from "vite-prerender-plugin";
import fs from 'fs'
import path from 'path'
import { statfs } from 'node:fs/promises';


// https://vitejs.dev/config/
export default defineConfig({

  plugins: [
    vue(),
    vitePrerenderPlugin ({
      renderTarget: '#app',
      prerenderScript: path.resolve(__dirname, "prerender.ts")
    })
  ],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'certs/localhost-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'certs/localhost-cert.pem')),
    },
    port: 5173, // ou autre si besoin
    host: 'localhost',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
