
import React, { useState, useEffect } from "react";
import { TreeSelect } from 'primereact/treeselect';
import { BaseURL } from '../costants.js';
import {useMode} from '../store/ModeContext.jsx';


export default function TreeCamapaignSelect({ handleTreeSelectChange, deep=false, type="csv"}) {
    const [data, setData] = useState([]);
    const {isOnline} = useMode();
    
    const [selectedNodeKey, setSelectedNodeKey] = useState(null);

    useEffect(() => {
        if(type==="csv" ){
            isOnline && getCampaignGroups();
            !isOnline && getFolderStructure();
        }
        else if(type==="elements"){
            !isOnline && getFolderStructureElement();
        }
        else if(type==="ancors"){
            !isOnline && getFolderStructureAncors();
        }
    }, [isOnline]);

    function getFolderStructureElement(){
        
        window.electronAPI.invoke(  'tree:element:getFilesAndFolders').then((data) => {
            setData(dataFormatter(data));
        });
        
    }
    
    function getFolderStructure(){
        
        window.electronAPI.invoke(  'tree:CSV:getFilesAndFolders').then((data) => {
            setData(dataFormatter(data));
        });
        
    }
    function getFolderStructureAncors(){
        
        window.electronAPI.invoke(  'tree:ancors:getFilesAndFolders').then((data) => {
            setData(dataFormatter(data));
        });
        
    }

    function dataFormatter(data) {
        const formattedData = [];
        data.forEach((group, i) => {
            const groupKey = `0-${i}`;
            const formattedGroup = {
                key: groupKey,
                label: group.name,
                icon: 'pi pi-fw pi-inbox',
                data: group._id,
                children: [],
            };
            deep && group.campaignList.forEach((campaign, k) => {
                const campaignKey = `${groupKey}-${k}`;
                formattedGroup.children.push({
                    key: campaignKey,
                    label: campaign.name,
                    icon: 'pi pi-fw pi-file',
                    data: `${campaign.id}`
                });
            });
            formattedData.push(formattedGroup);
        });
        
        return formattedData;
    }

    async function getCampaignGroups() {
        try {
            const response = await fetch(`${BaseURL}/groups/`);
            if (response.ok) {
                const data = await response.json();
                setData(dataFormatter(data));
            } else {
                console.error('Failed to fetch data:', response.statusText);
            }
        } catch (error) {
            console.error('An error occurred while fetching data:', error);
        }
    }

    return (
        <div className="card flex justify-content-center">
            <TreeSelect value={selectedNodeKey} onChange={(e) =>{setSelectedNodeKey(e.value);handleTreeSelectChange(e.value,data)} } options={data} 
                className="md:w-20rem w-full" placeholder="Select Item"></TreeSelect>
        </div>
    );
}
       