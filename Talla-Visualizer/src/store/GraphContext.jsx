import React, { createContext, useState, useContext } from "react";

// Crea il contesto
const GraphContext = createContext();

// Crea un provider per il contesto
export const GraphProvider = ({ children }) => {
  const [currentFileData, setCurrentFileData] = useState([]);
  const [ancorFileData, setAncorFileData] = useState([]);
  const [currentFileIndexLoaded, setCurrentFileIndexLoaded] = useState([]);
  const [envObjFileData, setEnvObjFileData] = useState([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [positionDetails, setPositionDetails] = useState(null);
  const [play, setPlay] = useState(false);
  const [xRange, setXRange] = useState([-50,50]);
  const [yRange, setYRange] = useState([-10,30]);
  const [Zoom, setZoom] = useState(false);
  const [Pan, setPan] = useState(true);
  const [Lasso, setLasso] = useState(false);
  const [Select, setSelect] = useState(false);
  const [ZoomIn, setZoomIn] = useState(true);
  const [ZoomOut, setZoomOut] = useState(true);
  const [ResetScale, setResetScale] = useState(true);
  const [Autoscale, setAutoscale] = useState(true);
  

  

  return (
    <GraphContext.Provider value={{ currentFileData,setCurrentFileData,envObjFileData,setEnvObjFileData,currentFrame, setCurrentFrame,play, setPlay, currentFileIndexLoaded, setCurrentFileIndexLoaded,positionDetails, setPositionDetails,xRange, setXRange,yRange, setYRange,ancorFileData, setAncorFileData,Zoom, setZoom,Pan,setPan,Select,setSelect,Lasso,setLasso,ZoomIn,setZoomIn,ZoomOut,setZoomOut,Autoscale,setAutoscale,ResetScale,setResetScale }}>
      {children}
    </GraphContext.Provider>
  );
};

// Custom hook per usare il contesto
export const useGraph = () =>  useContext(GraphContext)
