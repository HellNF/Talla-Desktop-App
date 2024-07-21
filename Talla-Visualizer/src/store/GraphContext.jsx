import React, { createContext, useState, useContext } from "react";

// Crea il contesto
const GraphContext = createContext();

// Crea un provider per il contesto
export const GraphProvider = ({ children }) => {
  const [currentFileData, setCurrentFileData] = useState([]);
  const [envObjFileData, setEnvObjFileData] = useState([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [play, setPlay] = useState(false);
  

  

  return (
    <GraphContext.Provider value={{ currentFileData,setCurrentFileData,envObjFileData,setEnvObjFileData,currentFrame, setCurrentFrame,play, setPlay}}>
      {children}
    </GraphContext.Provider>
  );
};

// Custom hook per usare il contesto
export const useGraph = () =>  useContext(GraphContext)
