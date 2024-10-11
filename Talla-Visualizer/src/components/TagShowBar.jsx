import React, { useState } from 'react';
import { useDashboard } from '../store/FileHandlerContext.jsx';
import { useViewSettings } from '../store/viewSettingsContext.jsx';
import { useGraph,ViewModes } from '../store/GraphContext.jsx';

const TagShowBar = ({ tag }) => {
  const { currentFrame, setCurrentFrame,setViewMode } = useGraph();
  const { index,fpsMode } = useDashboard();
  const { tagSetting } = useViewSettings();
  const totalDuration = index?.fileIndex[index?.fileIndex?.length - 1].end_frame;
  const [hoveredFrame, setHoveredFrame] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const getTagPosition = (tagTime) => {
    return (tagTime / totalDuration) * 100;
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

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newFrame = Math.floor((offsetX / rect.width) * totalDuration);
    setHoveredFrame(newFrame);
    setTooltipPosition({ x: offsetX, y: e.clientY-rect.top - 25 });
  };

  return (
    <div
      className="relative w-full h-2 bg-gray-300 rounded cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredFrame(null)}
    >
      {index?.fileIndex?.map((file) => {
        return file.tags.includes(tag) ? (
          <div
            key={file.start_frame}
            className="absolute top-0 h-full"
            style={{
              left: `${getTagPosition(file.start_frame)}%`,
              width: `${getTagPosition(file.end_frame) - getTagPosition(file.start_frame)}%`,
              backgroundColor: tagSetting[tag]?.color.main,
            }}
            onClick={() => {setCurrentFrame(file.start_frame); setViewMode(ViewModes.PLAYER)}}
          />
        ) : null;
      })}
      {hoveredFrame !== null && (
        <div
          className="absolute bg-gray-700 text-white text-xs rounded p-1 transform -translate-x-1/2"
          style={{ left: `${tooltipPosition.x}px`, top: `${tooltipPosition.y}px` }}
        >
          {frameToTime(hoveredFrame,fpsMode)}
        </div>
      )}
    </div>
  );
};

export default TagShowBar;
