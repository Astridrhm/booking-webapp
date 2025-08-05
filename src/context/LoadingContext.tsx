'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';

type LoadingContextType = {
  isLoading: boolean;
  setLoading: (val: boolean) => void;
  showLoading: ReactNode;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

const GlobalLoader = () => (
  <div className="w-6 h-6 border-4 border-gray-300 border-t-brand-500 rounded-full animate-spin" />
);


export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);

  const showLoading = isLoading ? <GlobalLoader /> : null;

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setLoading: setIsLoading,
        showLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};
