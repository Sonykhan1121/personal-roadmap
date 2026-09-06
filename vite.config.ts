import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import { defineConfig } from 'vite';
// GitHub Pages serves static files; the app talks to Supabase over HTTPS.
export default defineConfig({css:{postcss:{plugins:[tailwindcss()]}},server:{host:'127.0.0.1',watch:{useFsEvents:false,usePolling:true}},plugins:[vinext()]});
