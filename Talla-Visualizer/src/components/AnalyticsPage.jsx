import React, { useState, useRef } from "react";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { useDashboard } from "../store/FileHandlerContext.jsx";
import { RgbaColorPicker, RgbaStringColorPicker } from "react-colorful";
import PopoverColorPicker from "./PopoverColorPicker.jsx"; 

import { Checkbox } from 'primereact/checkbox';
        
import {
  AdjustmentsVerticalIcon,
  PlayIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
} from "@heroicons/react/24/solid";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,

} from "@nextui-org/react";
import ProgressBar from "./ProgressBar.jsx";
import TreeCampaignSelect from "./TreeCampaignSelect.jsx";
import Chart from "./Chart.jsx";
import { useViewSettings } from "../store/viewSettingsContext.jsx";

export default function AnalyticsPage() {
  const {
    currentFile,
    selectFile,
    isSet,
    setIsSet,
    envObjFile,
    selectEnvObjFile,
    index,
    setIndex,
    setCurrentTags
  } = useDashboard();
  const [isDetailsOn, setIsDetailsOn] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { shapes, setShapes } = useViewSettings();

  function handleTreeSelectChange(key, data) {
    for (let item of data) {
      if (item.key == key) {
        selectEnvObjFile(item.data);
      }
      if (item.children) {
        handleTreeSelectChange(key, item.children);
      }
    }
  }
  return (
    <div className="w-full h-full pt-20 flex flex-col items-center px-2">
      <div className="w-full m-2 flex flex-row justify-between mr-4">
        <div className="font-medium text-lg ">
          <h1>{currentFile}</h1>
        </div>
        <div className="flex flex-row items-center space-x-5">
          <TreeCampaignSelect
            handleTreeSelectChange={handleTreeSelectChange}
            deep={true}
            type="elements"
          ></TreeCampaignSelect>
          <button
            type="button"
            className="rounded-lg bg-secondary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-details-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-details-red"
            onClick={() => {
              selectFile("");
              setIsSet(false);
              setIndex(null); 
              setCurrentTags([]);
            }}
          >
            Change campaign
          </button>
          <button
            type="button"
            className="rounded-lg bg-secondary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-details-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-details-red"
            onClick={() => {
              setIsDetailsOn(!isDetailsOn);
            }}
          >
            Tag details
          </button>

          <Button
            onPress={onOpen}
            className="rounded-full bg-secondary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-details-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-details-red"
          >
            <AdjustmentsVerticalIcon className="w-6 h-6"></AdjustmentsVerticalIcon>
          </Button>
          <Modal
            backdrop="blur"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="center"
          >
            <ModalContent className="bg-gray-400 rounded-lg h-2/3 w-1/3 text-dirty-white hide-scrollbar overflow-scroll">
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    <h1 className="font-semibold text-lg">Settings</h1>
                  </ModalHeader>
                  <ModalBody>
                    <h1>Shapes</h1>
                    <Table>
                      <TableHeader>
                        <TableColumn align="center">Label</TableColumn>
                        <TableColumn align="center">Fill color</TableColumn>
                        <TableColumn align="center" >Line color</TableColumn>
                        <TableColumn align="center">Visible</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {shapes.length > 0 &&
                          shapes.map((shape, index) => {
                            return (
                              <TableRow
                                key={index}
                                className=" items-center"
                              >
                                <TableCell>
                                  <label>{shape.label.text}</label>
                                </TableCell>
                                <TableCell>
                                    <PopoverColorPicker 
                                    color={shape.fillcolor}
                                    onChange={(c) => {
                                      let newShapes = shapes;
                                      newShapes[index].fillcolor =`rgba(${c.r},${c.g},${c.b},${c.a})`;
                                      setShapes(newShapes);
                                    }}></PopoverColorPicker>
                                  
                                </TableCell>
                                <TableCell>
                                  <PopoverColorPicker 
                                    color={shape.line.color}
                                    onChange={(c) => {
                                      let newShapes = shapes;
                                      newShapes[index].line.color=`rgba(${c.r},${c.g},${c.b},${c.a})`;
                                      setShapes(newShapes);
                                    }}></PopoverColorPicker>
                                  
                                </TableCell>
                                <TableCell>
                                  <Checkbox checked={shape.visible} onChange={(e)=>{let newShapes = shapes;
                                      newShapes[index].visible = e.checked;
                                      setShapes(newShapes);}}></Checkbox></TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                    <hr orientation="horizontal" className="py-2"/>
                    <h1>Configs</h1>
                    

                  </ModalBody>
                  <ModalFooter>
                    <Button  variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button className="rounded-md bg-gray-700 " onPress={onClose}>
                      Action
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>
      <div className="w-full h-full">
        <Splitter className="h-full w-full">
          <SplitterPanel size={80}>
            <Splitter className="h-full w-full" layout="vertical">
              <SplitterPanel
                size={80}
                className={`${
                  !isFullScreen && "relative"
                } flex flex-col items-center shadow`}
              >
                <button
                  type="button"
                  className="absolute top-5 shadow left-5 rounded-full hover:scale-110 hover:bg-gray-50 p-2 hover:text-unitn-grey z-[110]"
                  onClick={() => {
                    setIsFullScreen(!isFullScreen);
                  }}
                >
                  {isFullScreen ? (
                    <ArrowsPointingInIcon className="h-6 w-6"></ArrowsPointingInIcon>
                  ) : (
                    <ArrowsPointingOutIcon className="h-6 w-6"></ArrowsPointingOutIcon>
                  )}
                </button>
                <div
                  className={
                    isFullScreen
                      ? `absolute top-0 left-0 h-screen w-full z-[100] p-6 bg-white flex flex-col items-center justify-center`
                      : `flex flex-col items-center h-full w-full p-4`
                  }
                >
                  <Chart />
                  <div className=" flex flex-col w-full h-30 px-3 mx-3 space-y-2 hide-scrollbar">
                    <ProgressBar />
                    <div className="flex flex-row w-full items-center justify-between text-unitn-grey/80">
                      <label>current Time</label>
                      <div className="flex flex-row space-x-3">
                        <button
                          type="button"
                          className="rounded-full hover:scale-110 hover:text-unitn-grey "
                        >
                          <ChevronDoubleLeftIcon className="h-4 w-4"></ChevronDoubleLeftIcon>
                        </button>
                        <button
                          type="button"
                          className="rounded-full hover:scale-110 hover:text-unitn-grey "
                        >
                          <PlayIcon className="h-6 w-6"></PlayIcon>
                        </button>
                        <button
                          type="button"
                          className="rounded-full hover:scale-110 hover:text-unitn-grey "
                        >
                          <ChevronDoubleRightIcon className="h-4 w-4"></ChevronDoubleRightIcon>
                        </button>
                      </div>
                      <label>Total time</label>
                    </div>
                  </div>
                </div>
              </SplitterPanel>
              <SplitterPanel
                size={20}
                className="overflow-y-scroll shadow hide-scrollbar"
              >
                <div className="p-2">
                  <h1>Timelines</h1>
                </div>
              </SplitterPanel>
            </Splitter>
          </SplitterPanel>
          <SplitterPanel
            id="details"
            size={20}
            minSize={1}
            className={`overflow-y-scroll shadow hide-scrollbar ${
              isDetailsOn ? "" : "hidden"
            }`}
          >
            <div className="p-2">
              <h1>Details</h1>
            </div>
          </SplitterPanel>
        </Splitter>
      </div>
    </div>
  );
}
