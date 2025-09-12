import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// main.tsx
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';
import { AlertProvider } from './context/AlertContext.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AlertProvider>
      <App />
    </AlertProvider>
  </BrowserRouter>


)

// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js')
//       .then(reg => console.log('SW registered:', reg))
//       .catch(err => console.error('SW registration failed:', err));
//   });
// }
