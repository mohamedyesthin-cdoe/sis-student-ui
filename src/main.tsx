// main.tsx
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';
import { AlertProvider } from './context/AlertContext.tsx';
import { ErrorProvider, registerErrorContext, useGlobalError } from './context/ErrorContext.tsx';
import { useEffect } from 'react';
import { LoaderProvider } from './context/LoaderContext.tsx';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
function ErrorContextBridge() {
  const { setConnectionLost, clearError, ...rest } = useGlobalError();

  // Register context in globalErrorHandler
  registerErrorContext({ setConnectionLost, clearError, ...rest });

  // Add browsers online/offline event listeners
  useEffect(() => {
    const handleOffline = () => {
      console.log("🔴 Internet disconnected");
      setConnectionLost();
    };

    const handleOnline = () => {
      console.log("🟢 Internet restored");
      clearError();
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return null;
}


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AlertProvider>
      <LoaderProvider>
        <ErrorProvider>
          <ErrorContextBridge />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <App />
          </LocalizationProvider>
        </ErrorProvider>
      </LoaderProvider>
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
