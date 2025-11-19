import { createContext, useContext, useState, useEffect } from "react";
import { loaderStore } from "../redux/LoaderStore";

interface LoaderContextType {
  loading: boolean;
}

const LoaderContext = createContext<LoaderContextType>({ loading: false });

export const LoaderProvider = ({ children }: any) => {
  const [loading, setLoading] = useState(false);

  // Register this setter with loaderStore once
  useEffect(() => {
    loaderStore.setHandler(setLoading);
  }, []);

  return (
    <LoaderContext.Provider value={{ loading }}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);
