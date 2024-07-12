import React, { createContext, useState, useContext } from 'react';

// Crea il contesto
const ModeContext = createContext();

// Crea il provider
export const ModeProvider = ({ children }) => {
    const [isOnline, setIsOnline] = useState(false);

    const toggleMode = () => {
        setIsOnline(prevMode => !prevMode);
    };

    return (
        <ModeContext.Provider value={{ isOnline, toggleMode }}>
            {children}
        </ModeContext.Provider>
    );
};

// Custom hook per usare il contesto
export const useMode = () => useContext(ModeContext);