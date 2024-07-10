import React, { useEffect,useState } from 'react';
import TallaNavbar from '../components/TallaNavbar.jsx';
import Card from '../components/Card.jsx';
import Chart from '../components/Chart.jsx';
const Dashboard = () => {
    const [campaigns, setCampaigns] = React.useState([]);
    const [selectedCampaign, setSelectedCampaign] = React.useState({});
    const [campaignData, setCampaignData] = React.useState([]);
    useEffect(() => {  
        fetchAllCampaign();
    }, []);

    async function fetchAllCampaign() {
        try {
            const response = await fetch('http://localhost:3000/api/campaign');
            if (!response.ok) {
                throw new Error(' Error during fetch all campaigns');
            }
            const data = await response.json();
            setCampaigns(data);
            
        }
        catch (error) {
            console.error('Error:', error);
        }   
    }
    async function fetchCampaignData(){
        try {
            const response = await fetch(`http://localhost:3000/api/campaign/${selectedCampaign._id}`);
            if (!response.ok) {
                throw new Error(' Error during fetch campaign data');
            }
            const data = await response.json();
            setCampaignData(data);
            
        }
        catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <>  
            <TallaNavbar></TallaNavbar>
            <div className='flex flex-col items-center'>
                
                <h1>Dashboard</h1>
                <div>
                    <Card>
                        <div className='flex flex-col space-y-4 p-6'>
                            <h1>Select a campaign</h1>
                            <select name="campaign" id="campaign" className='rounded-md' onChange={()=>{
                                const selectedCampaign = campaigns.find(campaign => campaign._id === document.getElementById('campaign').value);
                                setSelectedCampaign(selectedCampaign);
                            }}>
                            
                                {campaigns.map((campaign) => {
                                    return <option id={campaign._id} value={campaign._id}>{`${campaign.name} ${new Date(campaign.createdAt).toLocaleDateString(
                                        "it-IT",
                                        {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        }
                                        )}`}</option>
                                })}
                            
                            
                            </select>
                            
                            <button type="button" className='bg-white rounded-md hover:bg-slate-400 hover:text-white hover:scale-105' onClick={fetchCampaignData}> Get</button>
                        </div>
                    </Card>
                    <Card>
                        {campaignData.length && <Chart campaignData={campaignData}/>}
                    </Card>
                </div>
            </div>
        </>
        

    );
};

export default Dashboard;