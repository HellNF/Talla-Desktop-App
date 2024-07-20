import React, { createContext, useState, useContext } from "react";

// Crea il contesto
const ViewSettingsContext = createContext();

// Crea un provider per il contesto
export const ViewSettingsProvider = ({ children }) => {
  const [shapes, setShapes] = useState([]);
  const [tagSetting, setTagSetting] = useState({});
  
  

  

  return (
    <ViewSettingsContext.Provider value={{shapes, setShapes,tagSetting, setTagSetting}}>
      {children}
    </ViewSettingsContext.Provider>
  );
};

// Custom hook per usare il contesto
export const useViewSettings = () =>  useContext(ViewSettingsContext)
