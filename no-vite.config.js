import { defineConfig } from 'vite'
//import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    //plugins: [react()],
    
    // trying out vite proxy
    server: {
        proxy: {
            // string shorthand
            '/': 'http://localhost:3001',
        },
    },
    
/*
// https://vitejs.dev/config/
export default defineConfig({
*/
    root: "frontend",
    build: { 
        //minify: false, // Disable minification in development
        emptyOutDir: true,
        outDir: '../public' 
    },
})
