import { createContext, useContext, useState, useCallback } from "react";

const GlobalLoaderContext = createContext();

export function GlobalLoaderProvider({ children }) {
  const [loading, setLoading] = useState(false);

  const showLoader = useCallback(() => setLoading(true), []);
  const hideLoader = useCallback(() => setLoading(false), []);

  return (
    <GlobalLoaderContext.Provider value={{ loading, showLoader, hideLoader }}>
      {children}
    </GlobalLoaderContext.Provider>
  );
}

export function useGlobalLoader() {
  return useContext(GlobalLoaderContext);
}
