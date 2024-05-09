import { defineConfig } from "vite";

export default defineConfig({
  test: {
    environment: 'jsdom',
		globals: true,// include describe, it, expect
    setupFiles: ['./tests/setup.ts']
  },
});
