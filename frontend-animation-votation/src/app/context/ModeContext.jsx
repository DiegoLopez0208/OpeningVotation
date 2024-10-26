"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const ModeContext = createContext();

export const ModeProvider = ({ children }) => {
    const [mode, setMode] = useState("normal");

    useEffect(() => {
        const savedMode = localStorage.getItem("mode");
        if (savedMode) {
            setMode(savedMode);
        }
    }, []);

    const setModeDirectly = (newMode) => {
        setMode(newMode);
        localStorage.setItem("mode", newMode);
    };

    return (
        <ModeContext.Provider value={{ mode, setModeDirectly }}>
            {children}
        </ModeContext.Provider>
    );
};

export const useMode = () => useContext(ModeContext);