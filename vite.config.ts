import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // Load all environment variables with OPENROUTER_ prefix
    const localEnv = loadEnv(mode, process.cwd(), 'OPENROUTER_');
    
    console.log('Environment variables loaded:');
    console.log('API_KEY available:', !!localEnv.OPENROUTER_API_KEY);
    
    return {
      plugins: [react()],
      define: {
        // Explicitly stringify these environment variables for client-side use
        'process.env.API_KEY': JSON.stringify(localEnv.OPENROUTER_API_KEY),
        'process.env.OPENROUTER_API_KEY': JSON.stringify(localEnv.OPENROUTER_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
