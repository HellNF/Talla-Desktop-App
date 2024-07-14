import React, { useState, useRef } from "react";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { useDashboard } from "../store/FileHandlerContext.jsx";
import {
  AdjustmentsVerticalIcon,
  PlayIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon
} from "@heroicons/react/24/solid";
import ProgressBar from "./ProgressBar.jsx";
import TreeCampaignSelect from "./TreeCampaignSelect.jsx";
import Chart from "./Chart.jsx";

export default function AnalyticsPage() {
  const { currentFile, selectFile, isSet, setIsSet,envObjFile,selectEnvObjFile } = useDashboard();
  const [isDetailsOn, setIsDetailsOn] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  function handleTreeSelectChange(key,data){
    for(let item of data){
       if(item.key == key){
         selectEnvObjFile(item.data);
       }
       if(item.children){
         handleTreeSelectChange(key,item.children);
       }
     }
   } 
  return (
    <div className="w-full h-full pt-20 flex flex-col items-center px-2">
      <div className="w-full m-2 flex flex-row justify-between mr-4">
        <div className="font-medium text-lg ">
          <h1>{currentFile}</h1>
        </div>
        <div className="flex flex-row items-center space-x-5">
          <TreeCampaignSelect handleTreeSelectChange={handleTreeSelectChange} deep={true} type="elements"></TreeCampaignSelect>
          <button
            type="button"
            className="rounded-lg bg-secondary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-details-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-details-red"
            onClick={() => {
              selectFile("");
              setIsSet(false);
            }}
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
              <SplitterPanel
                size={80}
                className={`${
                  !isFullScreen && "relative"
                } flex flex-col items-center`}
              >
                <button
                  type="button"
                  className="absolute top-5 shadow left-5 rounded-full hover:scale-110 hover:bg-gray-50 p-2 hover:text-unitn-grey z-[110]"
                  onClick={() => {
                    setIsFullScreen(!isFullScreen);
                  }}
                >
                 {isFullScreen? <ArrowsPointingInIcon className="h-6 w-6"></ArrowsPointingInIcon>:  <ArrowsPointingOutIcon className="h-6 w-6"></ArrowsPointingOutIcon>}
                </button>
                <div
                  className={
                    isFullScreen
                      ? `absolute top-0 left-0 h-screen w-full z-[100] p-6 bg-white flex flex-col items-center justify-center`
                      : `flex flex-col items-center h-full w-full p-4`
                  }
                >
                  <Chart />
                  <div className=" flex flex-col w-full h-30 px-3 mx-3 space-y-2 hide-scrollbar">
                    <ProgressBar />
                    <div className="flex flex-row w-full items-center justify-between text-unitn-grey/80">
                      <label>current Time</label>
                      <div className="flex flex-row space-x-3">
                        <button
                          type="button"
                          className="rounded-full hover:scale-110 hover:text-unitn-grey "
                        >
                          <ChevronDoubleLeftIcon className="h-4 w-4"></ChevronDoubleLeftIcon>
                        </button>
                        <button
                          type="button"
                          className="rounded-full hover:scale-110 hover:text-unitn-grey "
                        >
                          <PlayIcon className="h-6 w-6"></PlayIcon>
                        </button>
                        <button
                          type="button"
                          className="rounded-full hover:scale-110 hover:text-unitn-grey "
                        >
                          <ChevronDoubleRightIcon className="h-4 w-4"></ChevronDoubleRightIcon>
                        </button>
                      </div>
                      <label>Total time</label>
                    </div>
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
            className={`overflow-y-scroll hide-scrollbar ${
              isDetailsOn ? "" : "hidden"
            }`}
          >
            <div className="p-2">
              <h1>Details</h1>
            </div>
          </SplitterPanel>
        </Splitter>
      </div>
    </div>
  );
}
