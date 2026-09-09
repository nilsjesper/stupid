import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // Relative so the built dist/ works from a subdirectory or file server.
  base: './',
  test: {
    environment: 'jsdom'
  }
})
