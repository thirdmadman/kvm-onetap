import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode } : { mode: string } ) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  return defineConfig({
    plugins: [react()],
    server: {
      port: parseInt(process.env.VITE_UI_PORT || '0', 10) || 3000
    },
    preview: {
      port: parseInt(process.env.VITE_UI_PORT || '0', 10) || 3000
    },
  });
}