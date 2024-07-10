import React, { useState } from "react";
import CampaignForm from "../components/CampaignForm.jsx";
import CampaignGroupForm from "../components/CampaignGroupForm.jsx";
import InputFile from "../components/InputFile.jsx";
import TallaNavbar from "../components/TallaNavbar.jsx";
import formShadow from '../assets/formShadow.svg';
import formPattern from '../assets/formPattern.svg';
import EnvObjForm from "../components/EnvObjForm.jsx";

function UploadPage() {
  const [activeObject, setActiveObject] = useState("Campaign group");
  return (
    <>
      <TallaNavbar></TallaNavbar>
      <div className="flex  items-center justify-center h-screen w-full bg-dirty-white z-0 overflow-hidden object-cover">
        {/* <img src={formShadow} alt="form" className="z-0 absolute scale-50 -top-[300] -left-[200] " />  */}
        {/* <img src={formPattern} alt="form" className="z-0 absolute -bottom-20 -right-14 w-5/12" /> */}
        <div className=" w-full flex items-center justify-center ">
          <div className="z-10 space-y-8  flex flex-col items-center justify-center p-6 bg-primary/70 shadow-md rounded-lg w-full sm:w-8/12 md:w-7/12 lg:w-7/12 backdrop-blur-sm">
            <div className="flex flex-row w-full justify-center text-base font-semibold text-dark-grey space-x-5 lg:text-lg">
              <button
                className={`p-2 rounded-md  ${
                  activeObject == "Campaign group"
                    ? "bg-secondary text-primary hover:bg-details-red"
                    : "text-secondary hover:text-details-red"
                }`}
                onClick={() => setActiveObject("Campaign group")}
              >
                Campaign group
              </button>
              <button
                className={`p-2 rounded-md  ${
                  activeObject == "Campaign"
                    ? "bg-secondary text-primary hover:bg-details-red"
                    : "text-secondary hover:text-details-red"
                }`}
                onClick={() => setActiveObject("Campaign")}
              >
                Campaign
              </button>
              <button
                className={`p-2 rounded-md  ${
                  activeObject == "Env. Objects & Aspect"
                    ? "bg-secondary text-primary hover:bg-details-red"
                    : "text-secondary hover:text-details-red"
                }`}
                onClick={() => setActiveObject("Env. Objects & Aspect")}
              >
                Env. Objects & Aspect
              </button>
            </div>
            {activeObject == "Campaign group" && (
              <CampaignGroupForm></CampaignGroupForm>
            )}
            {activeObject == "Campaign" && <CampaignForm></CampaignForm>}
            {activeObject == "Env. Objects & Aspect" && <EnvObjForm></EnvObjForm>}
          </div>
        </div>
      </div>
    </>
  );
}

export default UploadPage;
