import { defineConfig } from 'vite'
import { globSync } from 'glob'
import path from 'path'
import { fileURLToPath } from 'url'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  base: '/OpenTruco-client/',
  build: {
    rolldownOptions: {
      input: Object.fromEntries(
        globSync('*.html').map(file => [
          path.basename(file, '.html'),
          path.resolve(__dirname, file)
        ])
      )
    }
  }
})