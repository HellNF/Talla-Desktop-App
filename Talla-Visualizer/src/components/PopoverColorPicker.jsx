import React from "react";
import { RgbaColorPicker } from "react-colorful";

import {Popover, PopoverTrigger, PopoverContent, Button} from "@nextui-org/react";

export default function PopoverColorPicker({color, onChange}) {
  return (
    <Popover placement="bottom" showArrow={true}>
      <PopoverTrigger>
        <Button className={`h-6 w-6 border-2 border-white rounded-md` } style={{backgroundColor: color}}></Button>
      </PopoverTrigger>
      <PopoverContent>
        <RgbaColorPicker color={color} onChange={onChange}></RgbaColorPicker>
      </PopoverContent>
    </Popover>
  );
}