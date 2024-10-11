import React, { useEffect,useState } from 'react';
import TallaNavbar from '../components/TallaNavbar.jsx';
import SelectCampaignForm from '../components/SelectCampaignForm.jsx';
import { useDashboard } from '../store/FileHandlerContext.jsx';
import AnalyticsPage from '../components/AnalyticsPage.jsx';
import Spinner from '../components/Spinner.jsx';
import TagsForm from '../components/TagsForm.jsx';
import { useGraph } from '../store/GraphContext.jsx';
const Dashboard = () => {
    const { currentFile, selectFile, isSet, setIsSet,index,currentTags } = useDashboard();
    const { currentFileData } = useGraph();
    const [campaigns, setCampaigns] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState({});
    const [campaignData, setCampaignData] = useState([]);
    
    

    return (
        <>  
            <TallaNavbar></TallaNavbar>
            <div className=" flex  items-center justify-center h-screen w-full bg-dirty-white z-0">
                {!isSet ? <SelectCampaignForm></SelectCampaignForm> : 
                index==null? <Spinner></Spinner> : 
                currentTags.length ==0 ? <TagsForm></TagsForm>:  <AnalyticsPage></AnalyticsPage>}
            </div>
        </>
        

    );
};

export default Dashboard;