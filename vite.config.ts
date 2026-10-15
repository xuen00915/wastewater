import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/wastewater/' : '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(projectRoot, 'index.html'),
        services: resolve(projectRoot, 'services/index.html'),
        research: resolve(projectRoot, 'research/index.html'),
        projects: resolve(projectRoot, 'projects/index.html'),
        collaborate: resolve(projectRoot, 'collaborate/index.html'),
        career: resolve(projectRoot, 'career/index.html'),
        about: resolve(projectRoot, 'about/index.html'),
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    globals: true,
  },
})
