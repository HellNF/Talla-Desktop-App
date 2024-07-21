import React, { useRef, useEffect, useState, useMemo } from "react";
import Plot from "react-plotly.js";
import { useResizeDetector } from "react-resize-detector";
import { useDashboard } from "../store/FileHandlerContext.jsx";
import { useMode } from "../store/ModeContext.jsx";
import { useGraph } from '../store/GraphContext.jsx';
import { useViewSettings } from "../store/viewSettingsContext.jsx";

function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const a = Math.random().toFixed(2);

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function Chart() {
  const { currentFile, envObjFile, index, currentTags } = useDashboard();
  const { isOnline } = useMode();
  const { currentFileData, setCurrentFileData, envObjFileData, setEnvObjFileData,setCurrentFrame,currentFrame } = useGraph();
  const { width, height, ref } = useResizeDetector();
  const [revision, setRevision] = useState(0);
  const { shapes, setShapes, tagSetting, setTagSetting } = useViewSettings();
  const [plotData, setPlotData] = useState([]);
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
                font: { size: 10 }
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
                font: { size: 10 }
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
  }, [envObjFile, isOnline, setEnvObjFileData, setShapes]);

  useEffect(() => {
    const fetchFileData = async () => {
      if (!isOnline && currentFile !== null && index !== null && index.fileIndex !== undefined && index.fileIndex.length > 0) {
        const data = await window.electronAPI.invoke('LoadCSV:readFile', index.fileIndex[0].file);
        setCurrentFileData(data);
        
      }
    };
    fetchFileData();
  }, [index, isOnline, currentFile, setCurrentFileData]);

  useEffect(() => {
    if (currentFileData) {
      const newTagSetting = { ...tagSetting };
      currentTags.forEach(tag => {
        if (!newTagSetting[tag]) {
          newTagSetting[tag] = { color: getRandomColor() };
        }
      });
      setTagSetting(newTagSetting);
    }
  }, [currentTags]);

  useEffect(() => {
    const pd=[] 
    
    if (currentFileData[currentFrame]) {
      currentFileData[currentFrame].forEach((item) => {
        
        if (currentTags.includes(item.tag_id)) {
          const tagSettingItem = tagSetting[item.tag];
          pd.push({
            x: [item.x_kf],
            y: [item.y_kf],
            mode: "markers",
            type: "scatter",
            name: item.tag,
            legendgroup: item.tag,
            marker: {
              color: tagSettingItem?.color,
            },
          });
        }
      });
      setPlotData(pd)
      setRevision(prev => prev + 1);
    }
  },[currentFrame,currentFileData,currentTags,tagSetting])

  
 

  return (
    <div className="w-full h-full" ref={ref}>
      <Plot
        data={[
          ...plotData,
        ]}        
        layout={{
          autosize: true,
          title: "Positions of a Person",
          shapes: shapes,
          legend: { x: 1, xanchor: "right", y: 1 },
          xaxis: { title: "X", range: [-25, 25] },
          yaxis: { title: "Y", range: [0, 15] },
        }}
        config={{ responsive: true, scrollZoom: true, displaylogo: false }}
        style={{ width: "100%", height: "100%" }}
        useResizeHandler={true}
        revision={revision}
      />
    </div>
  );
}

export default Chart;
