import Navbar from "../components/Navbar.jsx";
import React from "react";
import AnalyticsPage from "../components/AnalyticsPage.jsx";
import TallaNavbar from "../components/TallaNavbar.jsx";
import PopoverColorPicker from "../components/PopoverColorPicker.jsx";
function Home() {
  return (
    <div>
      
      <TallaNavbar></TallaNavbar>
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <h1 className="text-6xl text-gray-800">Home</h1>
            <PopoverColorPicker></PopoverColorPicker>
            
        </div>
    </div>
  );
}

export default Home;