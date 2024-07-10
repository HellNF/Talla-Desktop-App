import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import InputFile from "./InputFile.jsx";
import FormData from "form-data";
import Switch from "./Switch.jsx";
import React from "react";
import { FileContext } from "../store/FileContext.jsx";
import { useState, useContext } from "react";
import TreeCamapaignSelect from "./TreeCampaignSelect.jsx";

export default function CampaignForm() {
  const [formParams, setFormParams] = useState({});
  const [isSelect, setIsSelect] = useState(true);
  const [fileData, setFileData] = useContext(FileContext);

  function handleTreeSelectChange(key,data){
   for(let item of data){
      if(item.key == key){
        setFormParams({
          ...formParams,
          campaignGroupId: item.data,
        });
      }
      if(item.children){
        handleTreeSelectChange(key,item.children);
      }
    }
  } 
  const handleSwitch = () => {
    setIsSelect(!isSelect);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("campaignName", formParams["campaignName"]);
    formData.append("description", formParams["description"]);
    fileData.forEach((file) => {
      formData.append("files", file);
    });
    fetch("http://localhost:3000/api/uploads/", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  };

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormParams({
      ...formParams,
      [name]: value,
    });
  };

  return (
    
    <form className="flex flex-col items-center justify-center  w-full " onSubmit={onSubmit}>
        <div className="flex flex-col w-full justify-evenly lg:flex-row">
          <div className="w-full px-5 text-sm font-medium">
            <h2 className="text-lg font-semibold leading-7 text-dark-grey">
              Info
            </h2>

            <div className="mt-10 text-dark-grey">
              <div className="flex my-1 flex-row space-x-2 ">
                <Switch handleSwitch={handleSwitch}>New campaign group?</Switch>
              </div>
              {isSelect ? (
                <div className="space-y-2">
                  <label
                    htmlFor="campaignGroupName"
                    className="block text-sm font-medium leading-6"
                  >
                    Campaign group name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="campaignGroupName"
                      id="campaignGroupName"
                      onChange={onChangeInput}
                      autoComplete="campaignGroupName"
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-details-light-blue sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col my-3 space-y-1">
                  <label className="block text-sm font-medium leading-6">Select Campaign group</label>
                  <TreeCamapaignSelect name='campaignGroupId' handleTreeSelectChange={handleTreeSelectChange} className=''></TreeCamapaignSelect>
                </div>
              )}
              <label
                htmlFor="campaignName"
                className="block text-sm font-medium leading-6"
              >
                Campaign name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="campaignName"
                  id="campaignName"
                  onChange={onChangeInput}
                  autoComplete="campaignName"
                  className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-details-light-blue sm:text-sm sm:leading-6"
                />
              </div>
              <div className="border-dark-grey/10">
                <div className="mt-5">
                  <div className="col-span-full">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Description
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="description"
                        name="description"
                        onChange={onChangeInput}
                        rows={2}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-details-light-blue sm:text-sm sm:leading-6"
                        defaultValue={""}
                      />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      Write a few sentences about the campaign.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <InputFile />
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
  );
}
