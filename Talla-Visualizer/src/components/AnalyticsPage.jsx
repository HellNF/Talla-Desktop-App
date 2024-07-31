import React, { useState, useEffect } from "react";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { useDashboard } from "../store/FileHandlerContext.jsx";
import { Checkbox } from "primereact/checkbox";
import SpeedDropDown from "./SpeedDropDown.jsx";
import Spinner from "./Spinner.jsx";
import TagShowBar from "./TagShowBar.jsx";
import RecordingButton from "./RecordingButton.jsx";
import {
  AdjustmentsVerticalIcon,
  PlayIcon,
  PauseIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
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
import PopoverColorPicker from "./PopoverColorPicker.jsx";
import { useGraph } from "../store/GraphContext.jsx";

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
    currentTags,
    setCurrentTags,
    fpsMode,
    isDetailsOn,
    setIsDetailsOn,
  } = useDashboard();
  const [isTagsChanged, setIsTagsChanged] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { shapes, setShapes, speedfactor, setSpeedFactor,tagSetting,setTagSetting } = useViewSettings();
  const {
    currentFrame,
    setCurrentFrame,
    play,
    setPlay,
    positionDetails,
    currentFileData,
    setCurrentFileData,
  } = useGraph();
 
  const [selectedTags, setSelectedTags] = useState(() => {
    const initialSelectedTags = {};
    index.tags.forEach((obj) => {
      currentTags.includes(`${obj.tag_id}`)
        ? (initialSelectedTags[obj.tag_id] = true)
        : (initialSelectedTags[obj.tag_id] = false);
    });
    return initialSelectedTags;
  });

  

  useEffect(() => {
    if (selectedTags !== null) {
      const newTags = Object.keys(selectedTags).filter(
        (tag) => selectedTags[tag]
      );
      const isChanged = newTags.length !== currentTags.length || newTags.some(tag => !currentTags.includes(tag));
      setIsTagsChanged(isChanged);
    }
  }, [selectedTags, currentTags]);

  const handleSelectAll = () => {
    const updatedTags = {};
    index.tags.forEach((obj) => {
      updatedTags[obj.tag_id] = true;
    });
    setSelectedTags(updatedTags);
  };

  const handleDeselectAll = () => {
    const updatedTags = {};
    index.tags.forEach((obj) => {
      updatedTags[obj.tag_id] = false;
    });
    setSelectedTags(updatedTags);
  };

  const handleCheckboxChange = (tagId, checked) => {
    setSelectedTags((prevSelectedTags) => ({
      ...prevSelectedTags,
      [tagId]: checked,
    }));
  };

  function frameToTime(frame, fpsMode) {
    const totalSeconds = frame / fpsMode;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds.toFixed(2)).padStart(5, "0")}`;
  }

  useEffect(() => {
    if (currentFile !== "" && index !== null && currentTags.length > 0) {
      window.electronAPI
        .invoke("LoadCSV", {
          file: currentFile,
          files: currentTags,
          fps: fpsMode,
        })
        .then((data) => {
          setIndex({ ...index, fileIndex: data });
        });
    }
  }, [currentTags, currentFile]);

  const handleFrameChange = (newFrame) => {
    setCurrentFrame(Math.floor(newFrame));
  };

  useEffect(() => {
    let interval = null;

    if (play) {
      // Avvia l'incremento di currentFrame
      interval = setInterval(() => {
        setCurrentFrame((currentFrame) => currentFrame + 1);
      }, 1000 / fpsMode / speedfactor);
    } else if (!play && interval) {
      // Ferma l'incremento di currentFrame
      clearInterval(interval);
    }

    return () => clearInterval(interval); // Pulizia alla dismontaggio
  }, [play]); // Dipendenze dell'effetto

  const handleTreeSelectChange = (key, data) => {
    for (let item of data) {
      if (item.key === key) {
        selectEnvObjFile(item.data);
      }
      if (item.children) {
        handleTreeSelectChange(key, item.children);
      }
    }
  };

  return (
    <div className="w-full h-full pt-20 flex flex-col items-center px-2">
      <div className="w-full m-2 flex flex-row justify-between mx-4 items-center">
        <div className="font-medium text-sm md:text-base xl:text-lg flex  space-x-4">
          <h1>
            {currentFile !== ""
              ? "..." + currentFile.split("TallaWorkspace")[1]
              : ""}
          </h1>
          <h1>{`${fpsMode}fps`}</h1>
        </div>
        <div className="flex flex-row items-center space-x-5">
          <button
            type="button"
            className="rounded-lg bg-secondary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-details-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-details-red"
            onClick={() => {
              selectFile("");
              setIsSet(false);
              setIndex(null);
              setCurrentTags([]);
              setCurrentFileData([]);
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
            isDismissable={false}
            placement="center"
          >
            <ModalContent className="bg-secondary rounded-lg h-2/3 w-1/2 text-dirty-white hide-scrollbar overflow-scroll">
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    <h1 className="font-semibold text-lg">Settings</h1>
                  </ModalHeader>
                  <ModalBody>
                    <div>
                      <label>Select the env element file:</label>
                      <TreeCampaignSelect
                        className="text-black"
                        handleTreeSelectChange={handleTreeSelectChange}
                        deep={true}
                        type="elements"
                      />
                    </div>
                    <hr orientation="horizontal" className="py-2" />
                    <h1>Shapes</h1>
                    <Table>
                      <TableHeader>
                        <TableColumn align="center">Label</TableColumn>
                        <TableColumn align="center">Fill color</TableColumn>
                        <TableColumn align="center">Line color</TableColumn>
                        <TableColumn align="center">Visible</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {shapes.length > 0 &&
                          shapes.map((shape, index) => {
                            return (
                              <TableRow key={index} className=" items-center">
                                <TableCell>
                                  <label>{shape.label.text}</label>
                                </TableCell>
                                <TableCell>
                                  <PopoverColorPicker
                                    color={shape.fillcolor}
                                    onChange={(c) => {
                                      console.log(c);
                                      let newShapes = [...shapes];
                                      newShapes[index].fillcolor = `rgba(${
                                        c.r
                                      },${c.g},${c.b},${
                                        isNaN(c.a) ? 0.6 : c.a
                                      })`;
                                      setShapes(newShapes);
                                    }}
                                  ></PopoverColorPicker>
                                </TableCell>
                                <TableCell>
                                  <PopoverColorPicker
                                    color={shape.line.color}
                                    onChange={(c) => {
                                      console.log(c);

                                      let newShapes = [...shapes];
                                      newShapes[index].line.color = `rgba(${
                                        c.r
                                      },${c.g},${c.b},${isNaN(c.a) ? 1 : c.a})`;
                                      setShapes(newShapes);
                                    }}
                                  ></PopoverColorPicker>
                                </TableCell>
                                <TableCell>
                                  <Checkbox
                                    checked={shape.visible}
                                    onChange={(e) => {
                                      let newShapes = [...shapes];
                                      newShapes[index].visible = e.checked;
                                      setShapes(newShapes);
                                    }}
                                  ></Checkbox>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                    <hr orientation="horizontal" className="py-2" />
                    <h1>Tags</h1>
                    <Table>
                      <TableHeader>
                        <TableColumn align="center">Tag</TableColumn>
                        <TableColumn align="center">Main color</TableColumn>
                        <TableColumn align="center">Footprint color</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {Object.keys(tagSetting).map((tag) => {
                          return (
                            <TableRow key={tag} className=" items-center">
                              <TableCell>
                                <label>{tag}</label>
                              </TableCell>
                              <TableCell>
                                <PopoverColorPicker
                                  color={tagSetting[tag].color.main}
                                  onChange={(c) => {
                                    let newTagSetting = { ...tagSetting };
                                    newTagSetting[tag].color.main = `rgba(${
                                      c.r
                                    },${c.g},${c.b},${isNaN(c.a) ? 1 : c.a})`;
                                    setTagSetting(newTagSetting);
                                  }}
                                ></PopoverColorPicker>
                              </TableCell>
                              <TableCell>
                                <PopoverColorPicker
                                  color={tagSetting[tag].color.footprint}
                                  onChange={(c) => {
                                    let newTagSetting = { ...tagSetting };
                                    newTagSetting[tag].color.footprint = `rgba(${
                                      c.r
                                    },${c.g},${c.b},${isNaN(c.a) ? 1 : c.a})`;
                                    setTagSetting(newTagSetting);
                                  }}
                                ></PopoverColorPicker>
                              </TableCell>
                            </TableRow>
                          );
                        }
                        )}
                      </TableBody>
                    </Table>
                  </ModalBody>
                  <ModalFooter>
                    <Button variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button
                      className="rounded-md bg-gray-700 "
                      onPress={onClose}
                    >
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
                {index.fileIndex === undefined ? (
                  <div className="flex items-center justify-center w-full h-full">
                    <Spinner></Spinner>
                  </div>
                ) : (
                  <>
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
                    <RecordingButton></RecordingButton>
                    <div
                      className={
                        isFullScreen
                          ? `absolute top-0 left-0 h-screen w-full z-[100] p-6 bg-white flex flex-col items-center justify-center`
                          : `flex flex-col items-center h-full w-full p-4`
                      }
                    >
                      <Chart />
                      <div className="flex flex-col w-full h-30 px-3 mx-3 space-y-2 hide-scrollbar">
                        <ProgressBar
                          initialValue={
                            index && index.fileIndex && index.fileIndex[0]
                              ? index.fileIndex[0].start_frame
                              : 0
                          }
                          maxValue={
                            index && index.fileIndex && index.fileIndex[0]
                              ? index?.fileIndex[index.fileIndex.length - 1]
                                  .end_frame
                              : 100
                          }
                          onChange={handleFrameChange}
                        />
                        <div className="flex flex-row w-full items-center justify-between text-unitn-grey/80">
                          <label>{frameToTime(currentFrame, fpsMode)}</label>
                          <div className="flex flex-row space-x-3">
                            <button
                              type="button"
                              className="rounded-full hover:scale-110 hover:text-unitn-grey "
                              onClick={() =>
                                handleFrameChange(
                                  Math.max(0, currentFrame - 30 * fpsMode)
                                )
                              }
                            >
                              <ChevronDoubleLeftIcon className="h-4 w-4"></ChevronDoubleLeftIcon>
                            </button>
                            <button
                              type="button"
                              className="rounded-full hover:scale-110 hover:text-unitn-grey "
                              onClick={() => {
                                setPlay(!play);
                              }}
                            >
                              {play ? (
                                <PauseIcon className="h-6 w-6"></PauseIcon>
                              ) : (
                                <PlayIcon className="h-6 w-6"></PlayIcon>
                              )}
                            </button>
                            <button
                              type="button"
                              className="rounded-full hover:scale-110 hover:text-unitn-grey "
                              onClick={() =>
                                handleFrameChange(currentFrame + 30 * fpsMode)
                              }
                            >
                              <ChevronDoubleRightIcon className="h-4 w-4"></ChevronDoubleRightIcon>
                            </button>
                          </div>
                          <div>
                            <SpeedDropDown></SpeedDropDown>
                            <label>
                              {index && index.fileIndex && index.fileIndex[0]
                                ? frameToTime(
                                    index.fileIndex[index.fileIndex.length - 1]
                                      .end_frame,
                                    fpsMode
                                  )
                                : "N/A"}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </SplitterPanel>
              <SplitterPanel
                size={20}
                className="overflow-y-scroll shadow hide-scrollbar flex flex-col items-center h-full"
              >
                <div className="px-4 py-2 w-full font-semibold">
                  <h1>Timelines</h1>
                </div>
                <div className="flex flex-row items-center justify-between px-4 py-2 w-full">
                  <div className="flex flex-row items-center text-details-blue space-x-5 font-semibold">
                    <button
                      type="button"
                      className="hover:text-details-light-blue"
                      onClick={handleSelectAll}
                    >
                      Select all
                    </button>
                    <button
                      type="button"
                      className="hover:text-details-light-blue"
                      onClick={handleDeselectAll}
                    >
                      Deselect all
                    </button>
                  </div>
                  <button
                    type="button"
                    className={`px-3 py-2 text-white bg-details-blue font-semibold rounded-md hover:scale-105 ${
                      isTagsChanged ? "" : "hidden"
                    }`}
                    onClick={() => {
                      setCurrentTags(
                        Object.keys(selectedTags).filter(
                          (tag) => selectedTags[tag]
                        )
                      );
                      setIsSet(true);
                      setIndex({ ...index, fileIndex: undefined });
                    }}
                  >
                    Apply changes
                  </button>
                </div>
                <div className="w-full flex flex-col items-center space-y-2">
                  {index.tags && index?.fileIndex ? (
                    index.tags.map((item) => {
                      return (
                        <div
                          key={item.tag_id}
                          className="flex flex-row items-center space-x-4 w-full px-3 "
                        >
                          <label
                            key={item.tag_id}
                            className="flex items-center  justify-center "
                          >
                            <input
                              type="checkbox"
                              className="form-checkbox text-details-blue focus:ring-details-light-blue rounded-md"
                              name="option"
                              value={item.tag_id}
                              checked={selectedTags[item.tag_id] || false}
                              onChange={(e) =>
                                handleCheckboxChange(
                                  item.tag_id,
                                  e.target.checked
                                )
                              }
                            />
                            <span className="ml-2">{item.tag_id}</span>
                          </label>
                          <TagShowBar tag={item.tag_id}></TagShowBar>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex items-center justify-center  w-full h-full">
                      <Spinner></Spinner>
                    </div>
                  )}
                </div>
              </SplitterPanel>
            </Splitter>
          </SplitterPanel>
          <SplitterPanel
            id="details"
            size={20}
            minSize={1}
            className={`overflow-y-scroll shadow h-full hide-scrollbar ${
              isDetailsOn ? "" : "hidden"
            }`}
          >
            <div className="p-2 flex flex-row justify-between">
              <h1>Details</h1>
              <button
                type="button"
                className="p-2 shadow-sm rounded-full"
                onClick={() => setIsDetailsOn(false)}
              >
                <XMarkIcon className="h-6 w-6"></XMarkIcon>
              </button>
            </div>

            <div className="flex flex-col space-y-3 items-center justify-center m-3 w-full max-w-xl">
              {isDetailsOn && positionDetails ? (
                Object.keys(positionDetails).map((key, index) => {
                  return (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row items-center justify-between w-full bg-gray-100/80 rounded-md p-3 shadow-md"
                    >
                      <label className="  w-full  p-2 rounded-md text-black font-semibold text-center">
                        {key}:
                      </label>
                      <label className="w-full  p-2 text-center  md:text-left">
                        {positionDetails[key]}
                      </label>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-500">
                  No details available
                </div>
              )}
            </div>
          </SplitterPanel>
        </Splitter>
      </div>
    </div>
  );
}
