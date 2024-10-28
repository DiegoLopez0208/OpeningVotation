"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SettingsContextType {
    mode: string; // Modo de reproducción
    gifsEnabled: boolean; // Estado de los GIFs
    setMode: (newMode: string) => void; // Cambiar el modo de reproducción
    setGifsEnabled: (enabled: boolean) => void; // Cambiar el estado de los GIFs
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [mode, setMode] = useState<string>("normal");
    const [gifsEnabled, setGifsEnabled] = useState<boolean>(true);

    useEffect(() => {
        const savedMode = localStorage.getItem("mode");
        const savedGifsEnabled = localStorage.getItem("gifsEnabled");

        if (savedMode) {
            setMode(savedMode);
        }
        if (savedGifsEnabled !== null) {
            setGifsEnabled(savedGifsEnabled === "true"); // Convertir a booleano
        }
    }, []);

    const updateMode = (newMode: string) => {
        setMode(newMode);
        localStorage.setItem("mode", newMode);
    };

    const updateGifsEnabled = (enabled: boolean) => {
        setGifsEnabled(enabled);
        localStorage.setItem("gifsEnabled", enabled.toString()); // Guardar como string
    };

    return (
        <SettingsContext.Provider value={{ mode, gifsEnabled, setMode: updateMode, setGifsEnabled: updateGifsEnabled }}>
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
