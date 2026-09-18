import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  resolve:{alias:{'@':path.resolve(__dirname,'src')}},
  plugins:[tailwindcss(),react()],
  server:{port:5173,host:true},
  preview:{port:4173,host:true},
  build:{target:'es2022',sourcemap:true},
})
