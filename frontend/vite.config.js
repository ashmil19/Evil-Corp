import dotenv  from 'dotenv';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  envDir: "./env",
  define: {
    'process.env': dotenv.config().parsed,
  },
})
