import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base relativa: funciona em https://usuario.github.io/qualquer-nome-de-repo/
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { target: 'es2022', sourcemap: false }
});
