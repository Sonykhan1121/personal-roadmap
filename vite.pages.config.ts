import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';

// GitHub Pages serves static files. Keep the existing React components and
// local Vinext preview, with a browser-only entry for the published application.
export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/personal-roadmap/' : '/',
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('.', import.meta.url)) } },
  css: { postcss: { plugins: [tailwindcss()] } },
  build: { outDir: 'build', emptyOutDir: true },
});
