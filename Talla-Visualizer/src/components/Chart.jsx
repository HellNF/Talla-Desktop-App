import React, { useRef, useEffect,useState } from "react";
import Plot from "react-plotly.js";
import { useResizeDetector } from "react-resize-detector";
import { useDashboard } from "../store/FileHandlerContext.jsx";
import { useMode } from "../store/ModeContext.jsx";
import {useGraph} from '../store/GraphContext.jsx';
import { useViewSettings } from "../store/viewSettingsContext.jsx";
import { data } from "autoprefixer";

function Chart({ onResize }) {
    const { currentFile,envObjFile } = useDashboard();
    const {isOnline} = useMode();
    const {currentFileData,setCurrentFileData,envObjFileData,setEnvObjFileData} = useGraph();
    const { width, height, ref } = useResizeDetector();
    const [revision, setRevision] = useState(0);
    const {shapes, setShapes} = useViewSettings();
    useEffect(() => {
        const fetchData = async () => {
          if (!isOnline && envObjFile !== null) {
            const data = await window.electronAPI.invoke('graph:getElementsData', envObjFile);
            setEnvObjFileData(data);
    
            const newShapes = data.map(item => {
              if (item.shape === "rectangle") {
                return {
                  type: 'rect',
                  x0: item.coordinates[0].x,
                  y0: item.coordinates[0].y,
                  x1: item.coordinates[2].x,
                  y1: item.coordinates[2].y,
                  line: {
                    color: 'rgba(128, 0, 128, 1)',
                    width: 3
                  },
                  fillcolor: 'rgba(128, 0, 128, 0.5)',
                  label: {
                    text: item.label,
                    font: { size:10, }
                  },
                  visible: true
                };
              } else if (item.shape === "circle") {
                return {
                  type: 'circle',
                  x0: item.centre.x - item.radius,
                  y0: item.centre.y - item.radius,
                  x1: item.centre.x + item.radius,
                  y1: item.centre.y + item.radius,
                  line: {
                    color: 'rgba(128, 43, 10, 1)',
                    width: 3
                  },
                  fillcolor: 'rgba(128, 43, 10, 0.5)',
                  label: {
                    text: item.label,
                    font: { size:10, } 
                  },
                  visible: true
                };
              } else {
                return null;
              }
            }).filter(shape => shape !== null);
    
            setShapes(newShapes);
            setRevision(prev => prev + 1);
          }
        };
        fetchData();
      }, [envObjFile, isOnline, setEnvObjFileData]);

    
  return (
    <div className="w-full h-full" ref={ref}>
      <Plot
        data={
            [
                // {
                // x: [1, 2, 3, 4],
                // y: [10, 15, 13, 17],
                // type: "scatter",
                // mode: "lines+points",
                // marker: { color: "red" },
                // },
                // {
                // x: [1, 2, 3, 4],
                // y: [16, 5, 11, 9],
                // type: "scatter",
                // mode: "lines+points",
                // marker: { color: "blue" },
                // },
            ]
        }
        layout={{
          autosize: true,
          title: "Positions of a Person",
          shapes: shapes,
        }}
        config={{ responsive: true,scrollZoom: true,displaylogo: false }}
        style={{ width: "100%", height: "100%" }}
        useResizeHandler={true}
        revision={revision}
      />
    </div>
  );
}

export default Chart;
