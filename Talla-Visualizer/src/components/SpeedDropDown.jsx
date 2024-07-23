import React from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";
import { useViewSettings } from "../store/viewSettingsContext.jsx";
export default function SpeedDropDown() {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["1x"]));
    const { speedfactor, setSpeedFactor } = useViewSettings();
  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button 
          variant="bordered" 
          className="capitalize"
        >
          {selectedValue}
        </Button>
      </DropdownTrigger>
      <DropdownMenu 
      className="bg-gray-200     rounded-md px-2 "
        aria-label="Single selection example"
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <DropdownItem key="0.5x" onClick={()=>setSpeedFactor(0.5) } className="hover:bg-gray-600/70 hover:rounded-md hover:text-white">0.5x</DropdownItem>
        <DropdownItem key="1x" onClick={()=>setSpeedFactor(1)} className="hover:bg-gray-600/70 hover:rounded-md hover:text-white">1x</DropdownItem>
        <DropdownItem key="1.5x" onClick={()=>setSpeedFactor(1.5)} className="hover:bg-gray-600/70 hover:rounded-md hover:text-white">1.5x</DropdownItem>
        <DropdownItem key="2x" onClick={()=>setSpeedFactor(2)} className="hover:bg-gray-600/70 hover:rounded-md hover:text-white">2x</DropdownItem>
        <DropdownItem key="4x" onClick={()=>setSpeedFactor(4)} className="hover:bg-gray-600/70 hover:rounded-md hover:text-white">4x</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
