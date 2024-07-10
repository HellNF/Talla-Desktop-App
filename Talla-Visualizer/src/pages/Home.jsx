import Navbar from "../components/Navbar.jsx";
import React from "react";
import TreeCampaign from "../components/TreeCampaign.jsx";
import TallaNavbar from "../components/TallaNavbar.jsx";

function Home() {
  return (
    <div>
      
      <TallaNavbar></TallaNavbar>
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <h1 className="text-6xl text-gray-800">Home</h1>
            
        </div>
    </div>
  );
}

export default Home;