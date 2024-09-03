import React, { useState, useContext } from "react";
import { useDashboard } from "../store/FileHandlerContext.jsx";
import Spinner from "./Spinner.jsx";

export default function TagsForm() {
  const { currentFile, selectFile, isSet, setIsSet, fpsMode, setFpsMode, index, setIndex, currentTags, setCurrentTags } = useDashboard();
  const [selectedTags, setSelectedTags] = useState(() => {
    const initialSelectedTags = {};
    index.tags.forEach((obj) => {
      initialSelectedTags[obj.tag_id] = true;
    });
    return initialSelectedTags;
  });

  const handleSelectAll = () => {
    const updatedTags = {};
    index.tags.forEach((obj) => {
      updatedTags[obj.tag_id] = true;
    });
    setSelectedTags(updatedTags);
  };

  const handleDeselectAll = () => {
    const updatedTags = {};
    index.tags.forEach((obj) => {
      updatedTags[obj.tag_id] = false;
    });
    setSelectedTags(updatedTags);
  };

  const handleCheckboxChange = (tagId, checked) => {
    setSelectedTags((prevSelectedTags) => ({
      ...prevSelectedTags,
      [tagId]: checked,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentTags(Object.keys(selectedTags).filter((key) => selectedTags[key]));
  };

  return (
    <>
      <form className="flex flex-col items-center w-11/12 md:w-3/5 bg-primary p-5 rounded-lg shadow-[0px_1px_32px_0px_rgba(0,0,0,0.08)] border border-black/10" onSubmit={handleSubmit}>
        <div className="flex w-full flex-col space-y-4 px-4 items-center">
          <h3 className="text-md text-opacity-50 font-medium leading-7">
            Select which tags to load
          </h3>
          <div className="flex w-full items-center  justify-center space-x-4 mt-4">
            <button type="button" className="rounded-md  p-1 text-sm font-semibold text-details-blue  focus:ring-details-light-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 " onClick={handleSelectAll}>
              Select All
            </button>
            <button type="button" className="rounded-md  p-1 text-sm font-semibold text-details-blue  focus:ring-details-light-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 " onClick={handleDeselectAll}>
              Deselect All
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {
              index !== null ? (
                index.tags.map((obj) => {
                  return (
                    <label key={obj.tag_id} className="inline-flex items-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4 justify-center ">
                      <input
                        type="checkbox"
                        className="form-checkbox text-details-blue focus:ring-details-light-blue rounded-md"
                        name="option"
                        value={obj.tag_id}
                        checked={selectedTags[obj.tag_id] || false}
                        onChange={(e) => handleCheckboxChange(obj.tag_id, e.target.checked)}
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
          <button type="button" className="text-sm font-semibold leading-6" onClick={()=>{
            setIsSet(false);
            setIndex(null);
            setCurrentTags([]);
          }}>
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-secondary px-3 py-2 text-sm font-semibold text-white shadow-[0px_1px_5px_0px_rgba(0,0,0,0.08)] shadow-gray-600  hover:bg-details-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-details-red"
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
}
