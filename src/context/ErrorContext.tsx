// ================================
// 🔵 ErrorBridge.tsx (Single File)
// ================================

import { createContext, useContext, useState } from "react";

// --------------------------------------------------
// 1️⃣ Error State Types
// --------------------------------------------------
interface ErrorState {
  type: "NONE" | "NO_DATA" | "SERVER_ERROR" | "CONNECTION_LOST";
  message?: string;
}

// --------------------------------------------------
// 2️⃣ Create Error Context
// --------------------------------------------------
const ErrorContext = createContext<any>(null);

// --------------------------------------------------
// 3️⃣ Error Provider (Global State)
// --------------------------------------------------
export function ErrorProvider({ children }: any) {
  const [error, setError] = useState<ErrorState>({ type: "NONE" });

  const setNoData = () => setError({ type: "NO_DATA" });
  const setServerError = () => setError({ type: "SERVER_ERROR" });
  const setConnectionLost = () => setError({ type: "CONNECTION_LOST" });
  const clearError = () => setError({ type: "NONE" });

  return (
    <ErrorContext.Provider
      value={{
        error,
        setNoData,
        setServerError,
        setConnectionLost,
        clearError,
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
}

// Hook to use error anywhere
export const useGlobalError = () => useContext(ErrorContext);

// --------------------------------------------------
// 4️⃣ Global Error Handler (Uses Context Functions)
// --------------------------------------------------
export function globalErrorHandler(error: any) {
  const { setNoData, setServerError, setConnectionLost } =
    errorContextFunctions;

  if (error.code === "ERR_NETWORK") {
    setConnectionLost();
    return;
  }

  const status = error?.response?.status;

  if (status === 404) {
    setNoData();
  } else if (status === 500 || status >= 501) {
    setServerError();
  }
}

// --------------------------------------------------
// 5️⃣ Bridge to access context functions inside handler
// --------------------------------------------------
let errorContextFunctions: any = {};

// Called from App.tsx
export function registerErrorContext(funcs: any) {
  errorContextFunctions = funcs;
}
