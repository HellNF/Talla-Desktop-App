import React, { useEffect,useState } from 'react';
import TallaNavbar from '../components/TallaNavbar.jsx';
import SelectCampaignForm from '../components/SelectCampaignForm.jsx';
import { useDashboard } from '../store/FileHandlerContext.jsx';
const Dashboard = () => {
    const { currentFile, selectFile, isSet, setIsSet } = useDashboard();
    const [campaigns, setCampaigns] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState({});
    const [campaignData, setCampaignData] = useState([]);
    
    

    return (
        <>  
            <TallaNavbar></TallaNavbar>
            <div className="flex  items-center justify-center h-screen w-full bg-dirty-white z-0 ">
                {!isSet && <SelectCampaignForm></SelectCampaignForm>}
            </div>
        </>
        

    );
};

export default Dashboard;