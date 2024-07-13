import React, { useState,useRef,useEffect } from "react";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { useDashboard } from "../store/FileHandlerContext.jsx";
import { AdjustmentsVerticalIcon,PlayIcon,PauseIcon,ArrowsPointingOutIcon,ChevronDoubleLeftIcon,ChevronDoubleRightIcon } from "@heroicons/react/24/solid";
import ProgressBar from "./ProgressBar.jsx";

export default function AnalyticsPage() {
  const { currentFile, selectFile,isSet, setIsSet } = useDashboard();
  const [tagDetails, setTagDetails] = useState([]);
  const [isDetailsOn, setIsDetailsOn] = useState(false);

//   useEffect(() => {
//     if (isSet && currentFile !== "") {
//     //   window.electronAPI.invoke("LoadCSV", currentFile).then((data) => {
//     //     console.log(data);
//     //   });
      
//     }
//   }, []); 
  return (
    <>
      <div className="w-full h-full pt-20 flex flex-col items-center px-2">
        <div className="w-full m-2 flex flex-row justify-between mr-4">
          <div className="font-medium text-lg ">
            <h1>{currentFile}</h1>
          </div>
          <div className="flex flex-row items-center space-x-5"> 
            <button
              type="button"
              className="rounded-lg bg-secondary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-details-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-details-red"
              onClick={() => {selectFile(""); setIsSet(false);}}
            >
              Change campaign
            </button>
            <button
              type="button"
              className="rounded-lg bg-secondary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-details-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-details-red"
              onClick={() => {
                setIsDetailsOn(!isDetailsOn);
            }}
            >
              Tag details
            </button>
            <button
              type="button"
              className="rounded-full bg-secondary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-details-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-details-red"
            >
              <AdjustmentsVerticalIcon className="w-6 h-6"></AdjustmentsVerticalIcon>
            </button>
          </div>
        </div>
        <div className="w-full h-full">
          <Splitter className="h-full w-full">
            <SplitterPanel size={80}>
              <Splitter className="h-full w-full" layout="vertical">
                <SplitterPanel size={80} className=" relative flex flex-col items-center">
                    <button type="button" className=" absolute top-5 left-5 rounded-full hover:scale-110 hover:text-unitn-grey "><ArrowsPointingOutIcon className="h-6 w-6"></ArrowsPointingOutIcon></button>
                    <div className=" absolute bottom-0 flex flex-col w-full h-30 p-5 space-y-2">
                        <ProgressBar></ProgressBar>
                        <div className="flex flex-row w-full items-center justify-between text-unitn-grey/80"  >
                            <label >current Time</label>
                            <div className="flex flex-row space-x-3">
                                <button type="button"  className="rounded-full hover:scale-110 hover:text-unitn-grey "><ChevronDoubleLeftIcon className="h-4 w-4"></ChevronDoubleLeftIcon></button>
                                <button type="button" className="rounded-full hover:scale-110 hover:text-unitn-grey  "><PlayIcon className="h-6 w-6"></PlayIcon></button>
                                <button type="button" className="rounded-full hover:scale-110 hover:text-unitn-grey "><ChevronDoubleRightIcon className="h-4 w-4"></ChevronDoubleRightIcon></button>
                            </div>
                            <label >Total time</label>
                        </div>
                    </div>
                </SplitterPanel>
                <SplitterPanel
                  size={20}
                  className="overflow-y-scroll hide-scrollbar"
                >
                  <div className="p-2">
                    <h1>Timelines</h1>
                  </div>
                </SplitterPanel>
              </Splitter>
            </SplitterPanel>
            <SplitterPanel
                id="details"
              size={20}
              minSize={1}
              
              className={` overflow-y-scroll hide-scrollbar ${isDetailsOn ? "" : "hidden"}`}
            >
              <div className="p-2">
                <h1>Details</h1>
              </div>
            </SplitterPanel>
          </Splitter>
        </div>
      </div>
    </>
  );
}
