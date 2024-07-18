import React, { useState, useContext } from "react";
import { useMode, isOnline, toggleMode } from "../store/ModeContext.jsx";
import TreeCampaign from "./TreeCampaign.jsx";
import { useDashboard } from "../store/FileHandlerContext.jsx";
import Spinner from "./Spinner.jsx";

export default function TagsForm() {
  const { currentFile, selectFile, isSet, setIsSet, fpsMode, setFpsMode, index, setIndex, currentTags, setCurrentTags } = useDashboard();
  const map = {};
  index.tags.map((obj) => {
    map[obj.tag_id] = true;
  });

  return (
    <>
      <form className="flex flex-col items-center w-11/12 md:w-3/5 bg-primary p-5 rounded-lg shadow-md" onSubmit={(e) => {
        e.preventDefault();
        setCurrentTags(Object.keys(map).filter((key) => map[key]));
      }}>
        <div className="flex w-full flex-col space-y-4 px-4 items-center">
          <h3 className="text-md text-opacity-50 font-medium leading-7">
            Select which tags to load
          </h3>

          <div className="flex flex-wrap items-center">
            {
              index !== null ? (
                index.tags.map((obj) => {
                  return (
                    <label key={obj.tag_id} className="inline-flex items-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4 justify-center">
                      <input
                        type="checkbox"
                        className="form-checkbox text-details-blue focus:ring-details-light-blue"
                        name="option"
                        value={obj.tag_id}
                        defaultChecked={map[obj.tag_id]}
                        onChange={(e) => {
                          map[obj.tag_id] = e.target.checked;
                        }}
                      />
                      <span className="ml-2">{obj.tag_id}</span>
                    </label>
                  )
                })
              ) : 
                <Spinner />
            }
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
