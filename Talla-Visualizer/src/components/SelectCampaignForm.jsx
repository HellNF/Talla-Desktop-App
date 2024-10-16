import React, { useState, useEffect } from "react";
import { useDashboard } from "../store/FileHandlerContext.jsx";
import TreeCampaign from "./TreeCampaign.jsx";

export default function SelectCampaignForm() {
  const { currentFile, selectFile, isSet, setIsSet, fpsMode, setFpsMode, index, setIndex } = useDashboard();
  const [alreadyProcessed, setAlreadyProcessed] = useState([]);

  useEffect(() => {
    if (currentFile !== "") {
      window.electronAPI.invoke("AlreadyProcessed", currentFile).then((data) => {
        setAlreadyProcessed(data);
      });
    }
  }, [currentFile]);

  return (
    <form
      className="flex flex-col items-center w-3/5 bg-primary p-5 rounded-lg shadow-[0px_1px_34px_0px_rgba(0,0,0,0.1)] border-black/10 border"
      onSubmit={(e) => {
        e.preventDefault();
        if (currentFile !== "" && fpsMode !== null) {
          setIsSet(true);

          window.electronAPI.invoke("ProcessCSV", { file: currentFile, fps: fpsMode }).then((data) => {
            setIndex({
              ...index, ...data
            });
          });
        }
      }}
    >
      <div className="flex w-full flex-col space-y-4 ">
        <h2 className="text-lg font-semibold leading-7 px-4">Choose a campaign</h2>
        <div className="w-full max-h-48 overflow-y-scroll hide-scrollbar">
          <TreeCampaign />
        </div>
      </div>
      <div className="flex w-full flex-col space-y-4 px-4">
        <h3 className="text-md text-opacity-50 font-medium leading-7">Select FPS mode</h3>
        <div className="flex flex-row gap-3 ">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className={`form-radio text-details-blue focus:ring-details-light-blue `}
              name="option"
              value="5"
              checked={fpsMode === 5}
              onChange={() => setFpsMode(5)}
            />
            <span className={`ml-2 font-semibold ${alreadyProcessed.includes('5') ? 'text-details-blue' : ''}`}>5 FPS</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className={`form-radio text-details-blue focus:ring-details-light-blue `}
              name="option"
              value="10"
              checked={fpsMode === 10}
              onChange={() => setFpsMode(10)}
            />
            <span className={`ml-2 font-semibold ${alreadyProcessed.includes('10') ? 'text-details-blue' : ''}`}>10 FPS</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className={`form-radio text-details-blue focus:ring-details-light-blue `}
              name="option"
              value="15"
              checked={fpsMode === 15}
              onChange={() => setFpsMode(15)}
            />
            <span className={`ml-2 font-semibold ${alreadyProcessed.includes('15') ? 'text-details-blue' : ''}`}>15 FPS</span>
          </label>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold leading-6">
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md relative bg-secondary px-3 py-2 shadow-[0px_1px_5px_0px_rgba(0,0,0,0.08)] text-sm font-semibold text-white shadow-gray-600    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-details-red"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
