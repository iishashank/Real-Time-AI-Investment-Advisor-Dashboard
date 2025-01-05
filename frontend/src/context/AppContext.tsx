import { createContext, useContext, useState, ReactNode } from "react";

interface AppContextType {
  ticker: string;
  setTicker: (ticker: string) => void;
  riskProfile: any | null;
  setRiskProfile: (profile: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [ticker, setTicker] = useState<string>("AAPL");
  const [riskProfile, setRiskProfile] = useState<any | null>(null);

  const value = {
    ticker,
    setTicker,
    riskProfile,
    setRiskProfile,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};