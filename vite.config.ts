import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// 简单的后端代理处理AI API请求
const createApiProxy = () => {
  return {
    name: 'api-proxy',
    configureServer(server) {
      server.middlewares.use('/api/ai', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        try {
          const chunks = [];
          for await (const chunk of req) {
            chunks.push(chunk);
          }
          const body = JSON.parse(Buffer.concat(chunks).toString());
          
          const apiKey = 'ark-d8026cab-45bf-4ee2-8d82-3ed39b432d0a-11b12';
          const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: 'doubao-seed-2-0-pro-260215',
              messages: [
                {
                  role: 'system',
                  content: `你是一个全能AI助手，可以回答用户的所有问题，支持中英文对话，风格友好自然。
用户可以和你聊天、问知识、查资料、练英语，你都能正常回应。`
                },
                ...body.messages
              ],
              temperature: 0.7,
              max_tokens: 1000
            })
          });

          const data = await response.json();
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        } catch (error) {
          console.error('AI API error:', error);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Internal server error' }));
        }
      });
    }
  };
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      createApiProxy(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: 'IELTS 智学',
          short_name: 'IELTS智学',
          description: '雅思智能学习平台 - 高效备考之路',
          theme_color: '#0a469b',
          background_color: '#0a469b',
          display: 'standalone',
          orientation: 'portrait',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        }
      })
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
