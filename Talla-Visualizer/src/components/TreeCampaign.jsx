import { Tree } from 'primereact/tree';
import React, { useState, useEffect } from 'react';
import { useMode } from '../store/ModeContext.jsx';
import { BaseURL } from '../costants.js';
import {useDashboard} from '../store/FileHandlerContext.jsx';

export default function TreeCampaign() {
    const {currentFile,selectFile} = useDashboard();
    const [data, setData] = useState([]);
    
    const [selectedKey, setSelectedKey] = useState('');
    const { isOnline } = useMode();

    useEffect(() => {
        isOnline?  getCampaignGroups() : getFolderStructure();
        
    }, [isOnline]);
    
    function getFolderStructure(){
        
        window.electronAPI.invoke(  'tree:getFilesAndFolders').then((data) => {
            setData(dataFormatter(data));
        });
        
    }
    function handleTreeChange(key,data){
        for(let item of data){
           if(item.key == key){
             selectFile(item.data);
           }
           if(item.children){
             handleTreeChange(key,item.children);
           }
         }
       } 
    function dataFormatter(data) {
        const formattedData = [];
        data.forEach((group, i) => {
            const groupKey = `0-${i}`;
            const formattedGroup = {
                key: groupKey,
                label: group.name,
                data: `${group._id}`,
                icon: 'pi pi-fw pi-inbox',
                children: [],
            };
            group.campaignList.forEach((campaign, k) => {
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
        console.log(formattedData);
        return formattedData;
    }

    async function getCampaignGroups() {
        try {
            const response = await fetch(`${BaseURL}/groups/`);
            if (response.ok) {
                const data = await response.json();
                console.log(data);
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
            <Tree value={data} selectionMode="single" selectionKeys={selectedKey} onSelectionChange={(e) => {setSelectedKey(e.value); handleTreeChange(e.value,data)}} className="w-full md:w-30rem toggler:bg-secondary"/>
        </div>
    );
}
