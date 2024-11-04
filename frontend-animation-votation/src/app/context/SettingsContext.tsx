"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface SettingsContextType {
  isSettingsOpen: boolean;
  isDarkMode: boolean;
  isQuickView: boolean;
  isShowGifs: boolean;
  updateQuickView: (enabled: boolean) => void;
  updateShowGifs: (enabled: boolean) => void;
  updateDarkMode: (enabled: boolean) => void;
  updateSettingsOpen: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isQuickView, setIsQuickView] = useState(false);
  const [isShowGifs, setShowGifs] = useState(true);

  useEffect(() => {
    const savedIsQuickView = localStorage.getItem("isQuickView");
    const savedIsDarkMode = localStorage.getItem("isDarkMode");
    const savedIsShowGifs = localStorage.getItem("isShowGifs");

    if (savedIsQuickView) {
      setIsQuickView(savedIsQuickView === "true" ? true : false); // Convertir a booleano
    }
    if (savedIsShowGifs) {
      setShowGifs(savedIsShowGifs === "true" ? true : false); // Convertir a booleano
    }

    if (savedIsDarkMode) {
      setIsDarkMode(savedIsDarkMode === "true" ? true : false); // Convertir a booleano
    }
    else {
      setIsDarkMode(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  const updateQuickView = (enabled: boolean) => {
    setIsQuickView(enabled);
    localStorage.setItem("isQuickView", enabled.toString());
  };

  const updateShowGifs = (enabled: boolean) => {
    setShowGifs(enabled);
    localStorage.setItem("isShowGifs", enabled.toString());
  };

  const updateDarkMode = (enabled: boolean) => {
    setIsDarkMode(enabled);
    localStorage.setItem("isDarkMode", enabled.toString());
  };

  const updateSettingsOpen = (enabled: boolean) => {
    setIsSettingsOpen(enabled);
  };

  return (
    <SettingsContext.Provider
      value={{
        isSettingsOpen,
        isDarkMode,
        isQuickView,
        isShowGifs,
        updateQuickView,
        updateShowGifs,
        updateDarkMode,
        updateSettingsOpen,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
