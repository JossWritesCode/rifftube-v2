
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
//  plugins: [react()],
/*
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// https://vite.dev/config/
export default defineConfig({
  */
  plugins: [react()],

  
  // trying out vite proxy
  server: {
    proxy: {
      // string shorthand
      '/videos': 'http://localhost:3001',
      '/user': 'http://localhost:3001',
      '/grade': 'http://localhost:3001',
      '/riffer-name': 'http://localhost:3001',
      '/riffer-pic': 'http://localhost:3001',
      '/send_email': 'http://localhost:3001',
      '/user-status': 'http://localhost:3001',
      '/logout': 'http://localhost:3001',
      '/login-with-google': 'http://localhost:3001',
      '/login': 'http://localhost:3001',
      '/signup-with-google': 'http://localhost:3001',
      '/signup': 'http://localhost:3001',
      '/riffs': 'http://localhost:3001',
      '/user_options': 'http://localhost:3001',
      //'/': 'http://localhost:3001',
    }
  },
  
  build: { 
    emptyOutDir: true,
    outDir: '../public' 
  }
    

})
