import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Precisa ser absoluto: com "./" o index.html pede "./assets/...", que em
  // uma rota aninhada (ex.: /wallpapers/novo) vira /wallpapers/assets/... e o
  // site compilado abre em branco.
  base: '/',
  plugins: [react()],
  server: {
    // Redireciona a API e as imagens geradas para o backend (pasta back).
    // Assim o frontend e a API ficam na mesma origem em desenvolvimento e o
    // cookie de sessao funciona sem configuracao extra de CORS.
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})
