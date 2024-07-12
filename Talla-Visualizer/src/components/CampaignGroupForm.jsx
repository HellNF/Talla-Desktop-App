import React, { useState, useContext } from "react";
import { FileContext } from "../store/uploadedFileContext.jsx";
import FormData from "form-data";
import InputFile from "./InputFile.jsx";


export default function CampaignGroupForm() {
    const [formParams, setFormParams] = useState({});
  
    const [fileData, setFileData] = useContext(FileContext);

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

    return(
    <>
        <form className="flex flex-col items-center w-full" >
            <div className="flex w-full flex-col justify-evenly lg:flex-row">
                <div className="w-full px-5">
                <h2 className="text-lg  font-semibold leading-7 ">
                    Info
                </h2>

                <div className="mt-10 text-dark-grey">
                    <div className="sm:col-span-3">
                    <label
                        htmlFor="campaign-name"
                        className="block text-sm font-medium leading-6 "
                    >
                        Campaign Group name
                    </label>
                    <div className="mt-2">
                        <input
                        type="text"
                        name="campaignName"
                        id="campaignName"
                        onChange={onChangeInput}
                        autoComplete="campaignName"
                        className="block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-details-light-blue sm:text-sm sm:leading-6"
                        />
                    </div>
                    <div className=" border-gray-900/10 ">
                        <div className="mt-10  ">
                        <div className="col-span-full">
                            <label
                            htmlFor="description"
                            className="block text-sm font-medium leading-6 "
                            >
                            Description
                            </label>
                            <div className="mt-2">
                            <textarea
                                id="description"
                                name="description"
                                onChange={onChangeInput}
                                rows={3}
                                className="block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-details-light-blue sm:text-sm sm:leading-6"
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
                </div>
                <InputFile></InputFile>
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
    </>)

}