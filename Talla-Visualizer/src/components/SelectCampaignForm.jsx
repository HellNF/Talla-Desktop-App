import React, { useState, useContext } from "react";
import { useMode, isOnline, toggleMode } from "../store/ModeContext.jsx";
import TreeCampaign from "./TreeCampaign.jsx";
import { useDashboard} from "../store/FileHandlerContext.jsx";
export default function SelectCampaignForm() {
  const { currentFile, selectFile, isSet, setIsSet, fpsMode, setFpsMode,index,setIndex } = useDashboard();
  return (
    <>
      <form className="flex flex-col items-center w-3/5 bg-primary p-5 rounded-lg shadow-md" onSubmit={(e)=>{
          e.preventDefault();
          if(currentFile!=="" && fpsMode!==null ){
              setIsSet(true);
              
              window.electronAPI.invoke("ProcessCSV",  {file : currentFile, fps : fpsMode}).then((data)=>{
                  
                  setIndex({
                    ...index, ...data
                  });
              });

          }
  
      }}>
        <div className="flex w-full flex-col space-y-4 ">
          <h2 className="text-lg  font-semibold leading-7 px-4">
            Chose a campaign
          </h2>

          <div className="w-full max-h-48 overflow-y-scroll hide-scrollbar">
            <TreeCampaign></TreeCampaign>
          </div>
        </div>
        <div className="flex w-full flex-col space-y-4 px-4">
          <h3 className="text-md text-opacity-50 font-medium leading-7 ">
            Select FPS mode
          </h3>

          <div className="flex flex-row gap-3 ">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-details-blue focus:ring-details-light-blue"
                name="option"
                value="5"
                checked={fpsMode === 5}
                onChange={() => setFpsMode(5)}
              />
              <span className="ml-2">5 FPS</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-details-blue focus:ring-details-light-blue"
                name="option"
                value="10"
                checked={fpsMode === 10}
                onChange={() => setFpsMode(10)}
              />
              <span className="ml-2">10 FPS</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-details-blue focus:ring-details-light-blue"
                name="option"
                value="15"
                checked={fpsMode === 15}
                onChange={() => setFpsMode(15)}
              />
              <span className="ml-2">15 FPS</span>
            </label>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="button" className="text-sm font-semibold leading-6">
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-secondary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-details-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-details-red"
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
}
