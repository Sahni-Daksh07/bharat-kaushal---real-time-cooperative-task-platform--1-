import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('recharts') || id.includes('d3-')) {
                return 'vendor-charts';
              }
              if (id.includes('leaflet')) {
                return 'vendor-maps';
              }
              if (id.includes('firebase')) {
                return 'vendor-firebase';
              }
              if (id.includes('@google/genai')) {
                return 'vendor-genai';
              }
              return 'vendor-framework';
            }
            if (id.includes('src/utils/assessmentGenerator') || id.includes('src/utils/i18n')) {
              return 'data-i18n-assessment';
            }
            if (id.includes('src/data/servicesData') || id.includes('src/data/seedData')) {
              return 'data-services-catalog';
            }
            if (id.includes('src/components/customer/')) {
              return 'portal-customer';
            }
            if (id.includes('src/components/worker/')) {
              return 'portal-worker';
            }
            if (
              id.includes('src/components/federation/') ||
              id.includes('src/components/society/') ||
              id.includes('src/components/admin/')
            ) {
              return 'portal-admin';
            }
          },
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
