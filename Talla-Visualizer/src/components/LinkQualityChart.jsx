import React, { useEffect, useState } from "react";
import { useGraph } from "../store/GraphContext.jsx";
import { useDashboard } from "../store/FileHandlerContext.jsx";
import Plot from "react-plotly.js";
import { useResizeDetector } from "react-resize-detector";

export default function LinkQualityChart() {
  const { setIsDetailsOn, ancorsFile } = useDashboard();
  const {
    ancorFileData,
    positionDetails,
    setPositionDetails,
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
    yAutorange,
  } = useGraph();

  const [plotData, setPlotData] = useState([]);
  const [anchorsData, setAnchorsData] = useState(null);
  const { width, height, ref } = useResizeDetector();
  const [modebarBtnToRemove, setModebarBtnToRemove] = useState([]);
  const ref_id = JSON.parse(positionDetails.anchor_ref);
  const recv_ids = JSON.parse(positionDetails.anchor_rec);
  const recv_fppwr= JSON.parse(positionDetails.receivers_fppwr);
  const ref_fppwr = JSON.parse(positionDetails.ref_fppwr);
  const recv_rxpwr= JSON.parse(positionDetails.receivers_rxpwr);
  const ref_rxpwr = JSON.parse(positionDetails.ref_rxpwr);


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
    if (ancorsFile !== null && positionDetails !== null) {
      console.log(ancorsFile);
      window.electronAPI
        .invoke("graph:getAncorsData", ancorsFile)
        .then((data) => {
          try {
            setAnchorsData(data);
            console.log(data);
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        });
    }
  }, [ancorsFile, positionDetails]);
  const getLineColor = (fppwr) => {
    if (fppwr <= -110) return "rgb(255, 0, 0)";  // Rosso
    if (fppwr >= -80) return "rgb(0, 255, 0)";  // Verde
  
    // Intervallo di fppwr tra -110 e -80
    const colors = [
      "rgb(255, 0, 0)",  // Rosso
      "rgb(255, 85, 0)", // Arancio scuro
      "rgb(255, 170, 0)", // Arancio
      "rgb(255, 255, 0)", // Giallo
      "rgb(170, 255, 0)", // Verde-giallo
      "rgb(85, 255, 0)",  // Verde chiaro
      "rgb(0, 255, 0)"    // Verde
    ];
  
    // Calcolare l'indice del colore
    const index = Math.floor((fppwr + 110) / 5);
    return colors[index];
  };
  const getLineStyle = (fppwr, rxpwr) => {
    const absDiff = Math.abs(Math.abs(fppwr) - Math.abs(rxpwr));
    return absDiff > 8 ? "dash" : "solid";  // Linea tratteggiata se differenza < 8
  };
  useEffect(() => {
    if (anchorsData !== null) {
        console.log(positionDetails.receivers_fppwr);
      
      const tempData = [];
      for (let i in recv_ids) {
        const x = anchorsData.anchors[recv_ids[i]].coords[0];
        const y = anchorsData.anchors[recv_ids[i]].coords[1];

        tempData.push({
            x: [positionDetails.x_kf, x],
            y: [positionDetails.y_kf, y],
            mode: "lines",
            name: `Link Quality ${recv_ids[i]}`,
            line: {
              color: getLineColor(recv_fppwr[i]),
              width: 2,
              dash: getLineStyle(recv_fppwr[i], recv_rxpwr[i]),
            },
          });
        tempData.push({
          x: [x],
          y: [y],
          mode: "markers",
          name: `${recv_ids[i]}`,
          marker: {
            color: "blue",
            size: 10,
          },
          hovertemplate: `
    <b>Anchor ID:</b> ${recv_ids[i]}  <br>
    <b>ffpwr:</b> ${recv_fppwr[i]}  <br>
    <b>rxpwr:</b> ${recv_rxpwr[i]}  <br>
    `,
  text: recv_ids[i],
        });

        

      }
      tempData.push({
        x: [positionDetails.x_kf, anchorsData.anchors[ref_id].coords[0]],
        y: [positionDetails.y_kf, anchorsData.anchors[ref_id].coords[1]],
        mode: "lines",
        name: `Link Quality ${ref_id}`,
        line: {
          color: getLineColor(ref_fppwr),
          width: 2,
          dash: getLineStyle(ref_fppwr, ref_rxpwr),

        },
    });
      tempData.push({
        x: [anchorsData.anchors[ref_id].coords[0]],
        y: [anchorsData.anchors[ref_id].coords[1]],
        mode: "markers",
        name: `Ref Anchor ${ref_id}`,
        marker: {
          color: "magenta",
          size: 13,
        },
        hovertemplate: `<br>
    <b>Anchor ID:</b> ${ref_id}  <br>
    <b>ffpwr:</b> ${ref_fppwr}  <br>
    <b>rxpwr:</b> ${ref_rxpwr}  <br>
    `,
  text: ref_id,
        });
      


      tempData.push({
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
      setPlotData(tempData);
    }
  }, [anchorsData]);
  return (
    <>
    <div className="w-full h-full" ref={ref}>

    
      <Plot
        data={plotData}
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
        layout={{
          autosize: true,
          title: "Link Quality",
          xaxis: {
            title: "X",
            range: [-50, 50],
            autorange: xAutorange,
          },
          yaxis: {
            title: "Y",
            range: [-10, 30],
            autorange: yAutorange,
          },
          showlegend: false,
        }}
        config={{
          responsive: true,
          scrollZoom: true,
          displaylogo: false,
          modeBarButtonsToRemove: modebarBtnToRemove,
          modeBarButtonsToAdd: [
            {
              name: "CustomAutosize",
              icon: {
                width: 928.6,
                height: 1000,
                path: "m786 296v-267q0-15-11-26t-25-10h-214v214h-143v-214h-214q-15 0-25 10t-11 26v267q0 1 0 2t0 2l321 264 321-264q1-1 1-4z m124 39l-34-41q-5-5-12-6h-2q-7 0-12 3l-386 322-386-322q-7-4-13-4-7 2-12 7l-35 41q-4 5-3 13t6 12l401 334q18 15 42 15t43-15l136-114v109q0 8 5 13t13 5h107q8 0 13-5t5-13v-227l122-102q5-5 6-12t-4-13z",
                transform: "matrix(1 0 0 -1 0 850)",
              },
              click: function () {
                setXRange([-25, 25]);
                setYRange([-5, 25]);
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
      />
      </div>
    </>
  );
}
