import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es']
    },
    rollupOptions: {
      external: /^lit/
    }
  },
  server: {
    port: 3000,
    strictPort: false, // 포트가 사용 중이면 자동으로 다른 포트 찾기
    open: true
  }
});