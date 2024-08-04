import React, { useEffect, useState } from "react";
import { useGraph } from "../store/GraphContext.jsx";
import { useDashboard } from "../store/FileHandlerContext.jsx";
import Plot from "react-plotly.js";

export default function HyperbolasChart() {
  const { ancorFileData, positionDetails } = useGraph();
  const [hyperbolasData, setHyperbolasData] = useState(null);
  const [plotData, setPlotData] = useState([]);
  const { ancorsFile } = useDashboard();

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
      const colors={}
      for (let id of recv_ids) {
        colors[id]=getRandomColor();
        data.push({
          x: [ancorFileData.anchors[id].coords[0]],
          y: [ancorFileData.anchors[id].coords[1]],
          mode: "markers",
          type: "scatter",
          name: `Anchor ${id}`,
          legendgroup: id,
          marker: {
            size: 10,
            color: colors[id]
          },
        });
        
      }
      console.log(colors)
      Object.keys(hyperbolasData).map((hyper) => {
        console.log(colors[hyper.split('_')[1]],hyper.split('_')[1]);
        const temp = {
          x: hyperbolasData[hyper].x,
          y: hyperbolasData[hyper].y,
          mode: "lines",
          type: "scatter",
          name: hyper,
          legendgroup: hyper,
          line:{ color: colors[hyper.split('_')[1]]}
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
          color: 'rgba(255, 99, 71, 1)'
        },
      });

      

      setPlotData(data);
    }
  }, [hyperbolasData, ancorFileData, positionDetails]);

  return (
    <>
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
        config={{ responsive: true, scrollZoom: true, displaylogo: false }}
        style={{ width: "100%", height: "100%" }}
        useResizeHandler={true}
      />
    </>
  );
}
