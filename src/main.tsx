// main.tsx
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';
import { AlertProvider } from './context/AlertContext.tsx';
import { ErrorProvider, registerErrorContext, useGlobalError } from './context/ErrorContext.tsx';

function ErrorContextBridge() {
  const errorContext = useGlobalError();

  // register context functions so globalErrorHandler can use them
  registerErrorContext(errorContext);

  return null;
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AlertProvider>
      <ErrorProvider>
        <ErrorContextBridge />
        <App />
      </ErrorProvider>
    </AlertProvider>
  </BrowserRouter>
);

// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js')
//       .then(reg => console.log('SW registered:', reg))
//       .catch(err => console.error('SW registration failed:', err));
//   });
// }
