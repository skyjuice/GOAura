import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => {
  const localEmulatorProxy = process.env.GOAURA_FUNCTIONS_PROXY
  return {
    plugins: [react()],
    base: './',
    server: localEmulatorProxy
      ? {
          proxy: {
            // Local Firebase Functions emulator (see `npm run emulators`)
            '/api': {
              target: localEmulatorProxy,
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, ''),
            },
          },
        }
      : undefined,
  }
})
