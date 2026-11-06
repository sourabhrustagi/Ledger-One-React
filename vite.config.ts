import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { mockApi } from './src/mock/mockApi.js'

// Serves /api/* from the mock backend so curl and the browser hit the same routes.
const mockApiPlugin = (): Plugin => ({
  name: 'ledgerone-mock-api',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (!req.url?.startsWith('/api/')) return next()

      const chunks: Buffer[] = []
      for await (const chunk of req) chunks.push(chunk as Buffer)
      const raw = Buffer.concat(chunks).toString('utf8')
      const body = raw ? JSON.parse(raw) : undefined

      const path = req.url.split('?')[0]
      const result = mockApi(req.method ?? 'GET', path, req.headers.authorization ?? null, body)
      res.statusCode = result.status
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(result.body))
    })
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mockApiPlugin()],
})
