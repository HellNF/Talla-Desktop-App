import React, { createContext, useState, useContext } from "react";

// Crea il contesto
const FileHandlerContext = createContext();

// Crea un provider per il contesto
export const FileHandlerProvider = ({ children }) => {
  const [currentFile, setCurrentFile] = useState("");
  const [envObjFile, setEnvObjFile] = useState(null);
  const [isSet, setIsSet] = useState(false);
  const [fpsMode, setFpsMode] = useState(null);

  const selectEnvObjFile = (file) => {
    setEnvObjFile(file);
  };
  const selectFile = (file) => {
    setCurrentFile(file);
  };

  return (
    <FileHandlerContext.Provider value={{ currentFile, selectFile, envObjFile,selectEnvObjFile,isSet,setIsSet,fpsMode,setFpsMode }}>
      {children}
    </FileHandlerContext.Provider>
  );
};

// Custom hook per usare il contesto
export const useDashboard = () =>  useContext(FileHandlerContext)
