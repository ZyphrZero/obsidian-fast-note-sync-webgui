import { visualizer } from "rollup-plugin-visualizer";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import path from "path";


const __dirname = path.dirname(fileURLToPath(import.meta.url));


export default defineConfig({
  plugins: [
    react(),
    // 构建分析工具 - 生成 stats.html 查看各依赖体积
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
      filename: "dist/stats.html",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    minify: 'terser', // 使用 Terser 压缩
    terserOptions: {
      compress: {
        drop_console: true,  // 去除 console.log
      },
    },
    chunkSizeWarningLimit: 2000, // 提高警告阈值到 2MB，适应大型依赖库
    rollupOptions: {
      output: {
        // 代码分割策略
        // 更细粒度的代码分割策略
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // React 核心
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-hook-form')) {
              return 'vendor-react';
            }
            // 编辑器相关 (核心及其底层依赖)
            if (
              id.includes('@uiw') ||
              id.includes('codemirror') ||
              id.includes('rehype') ||
              id.includes('remark') ||
              id.includes('micromark') ||
              id.includes('unist') ||
              id.includes('hast') ||
              id.includes('mdast') ||
              id.includes('prismjs') ||
              id.includes('refractor') ||
              id.includes('entities')
            ) {
              return 'vendor-editor';
            }
            // 图标库 (这些库通常很大，需要独立)
            if (id.includes('lucide-react') || id.includes('@lucide')) {
              return 'vendor-icons-lucide';
            }
            if (id.includes('react-icons')) {
              return 'vendor-icons-react';
            }
            // UI 框架
            if (id.includes('@radix-ui') || id.includes('@headlessui') || id.includes('tailwindcss-animate')) {
              return 'vendor-ui';
            }
            // 工具库 (拆分 date-fns 和 zod，它们相对独立且不小)
            if (id.includes('date-fns')) {
              return 'vendor-utils-date';
            }
            if (id.includes('zod')) {
              return 'vendor-utils-zod';
            }
            // 国际化
            if (id.includes('i18next')) {
              return 'vendor-i18n';
            }
            // 默认 node_modules 分离
            return 'vendor-common';
          }
        },
        // 为每个 chunk 生成更短的文件名
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
})
