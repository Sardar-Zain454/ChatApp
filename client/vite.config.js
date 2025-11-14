import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';



// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@root': path.resolve(__dirname, './'),
      '@page': path.resolve(__dirname, './src'),
      '@pages': path.resolve(__dirname, './src/pages/Signup'),
    }
  },

  server: {
    host: true,
    port: 5173
  }

  // set only during development purpose: 
//   server: {
//       proxy: {
//         '/backend': {
//             target: 'http://localhost:5000',
//             changeOrigin: true, // true makes Origin: http://localhost:500, Host: localhost:5000 no cors, if false then only Origin: http://localhost:5000 causes CORS maybe
//             rewrite: (path) => path.replace(/^\/backend/, "") // removes /backend where we /backend from whole path represent in target
//    }
//  }
//}
});


