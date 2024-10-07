import React, { useRef, useEffect, useState, useMemo } from "react";

import Plot from "react-plotly.js";

import { useResizeDetector } from "react-resize-detector";
import { useDashboard } from "../store/FileHandlerContext.jsx";
import { useMode } from "../store/ModeContext.jsx";
import { useGraph } from "../store/GraphContext.jsx";
import { useViewSettings } from "../store/viewSettingsContext.jsx";

function getRandomColor(main = true) {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const a = Math.random().toFixed(2);

  return {
    main: `rgba(${r}, ${g}, ${b}, 1)`,
    footprint: `rgba(${r}, ${g}, ${b}, 0.5)`,
  };
}

function Chart() {
  const {
    currentFile,
    envObjFile,
    index,
    currentTags,
    isDetailsOn,
    setIsDetailsOn,
  } = useDashboard();
  const { isOnline } = useMode();
  const {
    currentFileData,
    setCurrentFileData,
    envObjFileData,
    setEnvObjFileData,
    setCurrentFrame,
    currentFrame,
    currentFileIndexLoaded,
    setCurrentFileIndexLoaded,
    positionDetails,
    setPositionDetails,
    yRange,
    setYRange,
    xRange,
    setXRange,
    play,
    Zoom,
    setZoom,
    Pan,
    setPan,
    Select,
    setSelect,
    Lasso,
    setLasso,
    ZoomIn,
    setZoomIn,
    ZoomOut,
    setZoomOut,
    Autoscale,
    setAutoscale,
    ResetScale,
    setResetScale,
    xAutorange,
    setXAutorange,
    yAutorange,
    setYAutorange,
  } = useGraph();
  const { width, height, ref } = useResizeDetector();
  const [revision, setRevision] = useState(0);
  const { shapes, setShapes, tagSetting, setTagSetting } = useViewSettings();
  const [plotData, setPlotData] = useState([]);
  const [modebarBtnToRemove, setModebarBtnToRemove] = useState([]);
  useEffect(() => {
    const tempRmlist = [];
    if (!Zoom) {
      tempRmlist.push("zoom2d");
    }
    if (!Pan) {
      tempRmlist.push("pan2d");
    }
    if (!Select) {
      tempRmlist.push("select2d");
    }
    if (!Lasso) {
      tempRmlist.push("lasso2d");
    }
    if (!ZoomIn) {
      tempRmlist.push("zoomIn2d");
    }
    if (!ZoomOut) {
      tempRmlist.push("zoomOut2d");
    }
    if (!ResetScale) {
      tempRmlist.push("resetScale2d");
    }
    if (!Autoscale) {
      tempRmlist.push("autoScale2d");
    }
    setModebarBtnToRemove(tempRmlist);
  }, [Zoom, Pan, Select, Lasso, ZoomIn, ZoomOut, Autoscale, ResetScale]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isOnline && envObjFile !== null) {
        const data = await window.electronAPI.invoke(
          "graph:getElementsData",
          envObjFile
        );
        setEnvObjFileData(data);

        const newShapes = data
          .map((item) => {
            const color = getRandomColor();
            if (item.shape === "rectangle") {
              return {
                type: "rect",
                x0: item.coordinates[0].x,
                y0: item.coordinates[0].y,
                x1: item.coordinates[2].x,
                y1: item.coordinates[2].y,
                line: {
                  color: color.main,
                  width: 3,
                },
                fillcolor: color.footprint,
                label: {
                  text: item.label,
                  font: { size: 10 },
                },
                visible: true,
              };
            } else if (item.shape === "circle") {
              return {
                type: "circle",
                x0: item.centre.x - item.radius,
                y0: item.centre.y - item.radius,
                x1: item.centre.x + item.radius,
                y1: item.centre.y + item.radius,
                line: {
                  color: color.main,
                  width: 3,
                },
                fillcolor: color.footprint,
                label: {
                  text: item.label,
                  font: { size: 10 },
                },
                visible: true,
              };
            } else {
              return null;
            }
          })
          .filter((shape) => shape !== null);

        setShapes(newShapes);
        setRevision((prev) => prev + 1);
      }
    };
    fetchData();
  }, [envObjFile, isOnline, setEnvObjFileData, setShapes]);

  useEffect(() => {
    const fetchFileData = async () => {
      if (
        !isOnline &&
        currentFile !== null &&
        index !== null &&
        index.fileIndex !== undefined &&
        index.fileIndex.length > 0
      ) {
        const data = await window.electronAPI.invoke(
          "LoadCSV:readFile",
          index.fileIndex[0].file
        );
        setCurrentFileIndexLoaded([0]);
        setCurrentFileData(data);
      }
    };
    fetchFileData();
  }, [index, isOnline, currentFile, setCurrentFileData]);

  useEffect(() => {
    if (currentFileData) {
      const newTagSetting = { ...tagSetting };
      currentTags.forEach((tag) => {
        if (!newTagSetting[tag]) {
          newTagSetting[tag] = { color: getRandomColor() };
        }
      });
      setTagSetting(newTagSetting);
    }
  }, [currentTags]);

  useEffect(() => {
    const pd = [];

    const checkLoading = async () => {
      let missing = true;
      if (!currentFileData[currentFrame]) {
        for (let i of currentFileIndexLoaded) {
          if (
            index?.fileIndex[i].start_frame <= currentFrame &&
            index?.fileIndex[i].end_frame >= currentFrame
          ) {
            missing = false;
          }
        }
        if (missing) {
          for (let i in index?.fileIndex) {
            if (
              index?.fileIndex[i].start_frame <= currentFrame &&
              index?.fileIndex[i].end_frame >= currentFrame
            ) {
              setCurrentFileIndexLoaded([i]);
              const data = await window.electronAPI.invoke(
                "LoadCSV:readFile",
                index.fileIndex[i].file
              );
              setCurrentFileData(data);
              break;
            }
          }
        }
      }
    };
    checkLoading();
    if (currentFileData[currentFrame]) {
      for (let tag of currentTags) {
        const tagSettingItem = tagSetting[tag];
        const main = {
          x: [],
          y: [],
          mode: "markers",
          type: "scatter",
          name: tag,
          legendgroup: tag,
          marker: {
            color: tagSettingItem?.color.main,
            size: 10,
          },
          frame: currentFrame,
        };
        const footprints = {
          x: [],
          y: [],
          mode: "markers",
          type: "scatter",
          name: `${tag} footprints`,
          legendgroup: `${tag} footprints`,
          marker: {
            color: tagSettingItem?.color.footprint,
            size: 6,
          },
          frame: currentFrame,
        };
        currentFileData[currentFrame]
          .filter((item) => item.tag_id === tag)
          .forEach((item) => {
            if (item.label === "main") {
              main.x.push(item.x_kf);
              main.y.push(item.y_kf);
            } else {
              footprints.x.push(item.x_kf);
              footprints.y.push(item.y_kf);
            }
          });

        if (main.x.length > 0) {
          pd.push(main);
        }
        if (footprints.x.length > 0) {
          pd.push(footprints);
        }
      }
      setPlotData(pd);
      setRevision((prev) => prev + 1);
    } else {
      setPlotData([]);
    }
  }, [currentFrame, currentFileData, currentTags, tagSetting]);

  return (
    <div className="w-full h-full" ref={ref}>
      <Plot
        onRelayout={(data) => {
          

          if (data["xaxis.range[0]"] && data["xaxis.range[1"]) {
            setXRange([data["xaxis.range[0]"], data["xaxis.range[1]"]]);
          }
          if (data["yaxis.range[0]"] && data["yaxis.range[1"]) {
            setYRange([data["yaxis.range[0]"], data["yaxis.range[1]"]]);
          }
        }}
        onClick={(data) => {
          //console.log(data);
          if (data.points.length > 0) {
            const point = data.points[0];
            const tag = point.data.name.split(" ")[0];
            const frame = point.data.frame;
            console.log(tag, frame, point);
            for (let i of currentFileData[frame]) {
              if (i.tag_id === tag && i.x_kf == point.x && i.y_kf == point.y) {
                setPositionDetails(i);

                break;
              }
            }
          }
          setIsDetailsOn(true);
        }}
        data={[...plotData]}
        layout={{
          autosize: true,
          title: "Positions of a Person",
          shapes: shapes,
          legend: { x: 1, xanchor: "right", y: 1, visible: !play },
          xaxis: { title: "X", range: xRange, autorange: xAutorange },
          yaxis: { title: "Y", range: yRange, autorange: yAutorange },
        }}
        config={{
          responsive: true,
          scrollZoom: true,
          displaylogo: false,
          modeBarButtonsToRemove: modebarBtnToRemove,
          modeBarButtonsToAdd: [
            {
              name: "CustomAutosize",
              icon: { width: 928.6,
                height: 1000,
                path: 'm786 296v-267q0-15-11-26t-25-10h-214v214h-143v-214h-214q-15 0-25 10t-11 26v267q0 1 0 2t0 2l321 264 321-264q1-1 1-4z m124 39l-34-41q-5-5-12-6h-2q-7 0-12 3l-386 322-386-322q-7-4-13-4-7 2-12 7l-35 41q-4 5-3 13t6 12l401 334q18 15 42 15t43-15l136-114v109q0 8 5 13t13 5h107q8 0 13-5t5-13v-227l122-102q5-5 6-12t-4-13z',
                transform: 'matrix(1 0 0 -1 0 850)'},
              click: function () {
                setXRange([-25,25]);
                setYRange([-5,25]);
              },
            },
          ],
          toImageButtonOptions: {
            format: "png", // one of png, svg, jpeg, webp
            filename: "ChartSnapshot",
            height: 1080,
            width: 1920,
            scale: 1, // Multiply title/legend/axis/canvas sizes by this factor
          },
        }}
        style={{ width: "100%", height: "100%" }}
        useResizeHandler={true}
        revision={revision}
      />
    </div>
  );
}

export default Chart;
