import React, { useEffect, useState } from "react";
import { useGraph } from "../store/GraphContext.jsx";
import { useDashboard } from "../store/FileHandlerContext.jsx";
import Plot from "react-plotly.js";
import { useResizeDetector } from "react-resize-detector";

export default function HyperbolasChart() {
  const { ancorFileData, positionDetails,Zoom, setZoom,Pan,setPan,Select,setSelect,Lasso,setLasso,ZoomIn,setZoomIn,ZoomOut,setZoomOut,Autoscale,setAutoscale,ResetScale,setResetScale } = useGraph();
  const [hyperbolasData, setHyperbolasData] = useState(null);
  const [plotData, setPlotData] = useState([]);
  const { ancorsFile } = useDashboard();
  const { width, height, ref } = useResizeDetector();

  const [modebarBtnToRemove, setModebarBtnToRemove] = useState([]);
  useEffect(() => {
    const tempRmlist = [];
    if(!Zoom){
      tempRmlist.push("zoom2d");
    }
    if(!Pan){
      tempRmlist.push("pan2d");
    }
    if(!Select){
      tempRmlist.push("select2d");
    }
    if(!Lasso){
      tempRmlist.push("lasso2d");
    }
    if(!ZoomIn){
      tempRmlist.push("zoomIn2d");
    }
    if(!ZoomOut){
      tempRmlist.push("zoomOut2d");
    }
    if(!ResetScale){
      tempRmlist.push("resetScale2d");
    }
    if(!Autoscale){
      tempRmlist.push("autoScale2d");
    }
    setModebarBtnToRemove(tempRmlist);
  },[Zoom,Pan,Select,Lasso,ZoomIn,ZoomOut,Autoscale,ResetScale]);

  function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = Math.random().toFixed(2);

    return `rgba(${r}, ${g}, ${b}, 1)`;
  }
  useEffect(() => {
    if (ancorsFile !== null && positionDetails !== null) {
      const tdoa_obj = {
        ref_id: JSON.parse(positionDetails.anchor_ref),
        recv_ids: JSON.parse(positionDetails.anchor_rec),
        tdoa_dist: JSON.parse(positionDetails.tdoa_dist),
        pos: [positionDetails.x_kf, positionDetails.y_kf],
      };
      console.log(ancorsFile);
      window.electronAPI
        .invoke("graph:hyperbolas", {
          filePath: ancorsFile,
          tdoa_obj: tdoa_obj,
        })
        .then((data) => {
          try {
            setHyperbolasData(data);
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        });
    }
  }, [ancorsFile, positionDetails]);

  useEffect(() => {
    if (hyperbolasData !== null && ancorFileData) {
      const data = [];
      const ref_id = JSON.parse(positionDetails.anchor_ref);
      const recv_ids = JSON.parse(positionDetails.anchor_rec);
      const colors = {};
      for (let id of recv_ids) {
        colors[id] = getRandomColor();
        data.push({
          x: [ancorFileData.anchors[id].coords[0]],
          y: [ancorFileData.anchors[id].coords[1]],
          mode: "markers",
          type: "scatter",
          name: `Anchor ${id}`,
          legendgroup: id,
          marker: {
            size: 10,
            color: colors[id],
            symbol: "square-dot",
          },
        });
      }
      console.log(colors);
      Object.keys(hyperbolasData).map((hyper) => {
        console.log(colors[hyper.split("_")[1]], hyper.split("_")[1]);
        const temp = {
          x: hyperbolasData[hyper].x,
          y: hyperbolasData[hyper].y,
          mode: "lines",
          type: "scatter",
          name: hyper,
          legendgroup: hyper,
          line: { color: colors[hyper.split("_")[1]] },
        };
        data.push(temp);
      });

      data.push({
        x: [ancorFileData.anchors[ref_id].coords[0]],
        y: [ancorFileData.anchors[ref_id].coords[1]],
        mode: "markers",
        type: "scatter",
        name: `Anchor ${ref_id}`,
        legendgroup: ref_id,
        marker: {
          size: 13,
          color: "rgba(255, 99, 71, 1)",
          symbol: "star-triangle-up",
        },
      });
      data.push({
        x: [positionDetails.x_kf],
        y: [positionDetails.y_kf],
        mode: "markers",
        type: "scatter",
        name: "Estimated Position",
        legendgroup: "Estimated Position",
        marker: {
          size: 13,
          color: "rgba(0, 0, 0, 1)",
          symbol: "diamond-x",
        }});
      setPlotData(data);
    }
  }, [hyperbolasData, ancorFileData, positionDetails]);

  return (
    <>
    <div className="w-full h-full" ref={ref}>
      <Plot
        data={plotData}
        layout={{
          autosize: true,
          title: "Hyperbolas",
          xaxis: {
            title: "X",
            range: [-50, 50],
          },
          yaxis: {
            title: "Y",
            range: [-10, 30],
          },
        }}
        config={{ responsive: true, scrollZoom: true, displaylogo: false,modeBarButtonsToRemove: modebarBtnToRemove,toImageButtonOptions:{
          format: 'png', // one of png, svg, jpeg, webp
          filename: 'ChartSnapshot',
          height: 1080,
          width: 1920,
          scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
         }}}
        style={{ width: "100%", height: "100%" }}
        useResizeHandler={true}
      />
      </div>
    </>
  );
}
