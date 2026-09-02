import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/futbol_santa_barbara/', // 👈 Pon aquí el nombre exacto de tu repositorio en GitHub
})