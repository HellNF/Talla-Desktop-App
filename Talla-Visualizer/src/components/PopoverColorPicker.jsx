import React,{useState} from "react";
import { RgbaColorPicker } from "react-colorful";

import {Popover, PopoverTrigger, PopoverContent, Button} from "@nextui-org/react";

export default function PopoverColorPicker({color, onChange}) {
  const [currentColor,setCurrentColor]=useState({})
  return (
    <Popover placement="bottom" showArrow={true}>
      <PopoverTrigger>
        <Button className={`h-6 w-6 border-2 border-white rounded-md` } style={{backgroundColor: color}}></Button>
      </PopoverTrigger>
      <PopoverContent className="p-2 rounded-md bg-unitn-grey flex space-y-2"> 
        <RgbaColorPicker color={color} onChange={(c)=>{setCurrentColor(c)}}></RgbaColorPicker>
        <button type="button" className="bg-details-blue rounded-md px-2 py-1 hover:scale-105 text-white text-sm" onClick={()=>onChange(currentColor)}>Apply</button>
      </PopoverContent>
    </Popover>
  );
}