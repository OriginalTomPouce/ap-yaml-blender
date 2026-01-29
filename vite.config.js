import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    test: {
        bail: 1,
        clearMocks: true,
        coverage: {
            enabled: false,
            exclude: [],
            include: ['src/**/*'],
            reporter: ['text'],
            reportsDirectory: 'coverage',
            thresholds: {
                '50': true
            }
        },
        css: false,
        environment: 'happy-dom',
        globals: true,
        include: ['**/*.test.js']
    },
  plugins: [
    vue(),
        tailwindcss(),
    ],
    server: {
        allowedHosts: true,
        cors: true,
        headers: {
            'Access-Control-Allow-Origin': 'archipelago.gg',
        }
    },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
    build: {
        rollupOptions: {
            // external: [/img\/.*/],
            output: {
                assetFileNames: (assetInfo) => {
                    let extType = assetInfo.name.split('.').at(1);
                    if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
                        extType = 'img';
                    }
                    return `ap-yaml-blender/assets/${extType}/[name]-[hash][extname]`;
                },
                chunkFileNames: 'ap-yaml-blender/assets/js/[name]-[hash].js',
                entryFileNames: 'ap-yaml-blender/assets/js/[name]-[hash].js',
            }
        },
    }
})