import React, { useEffect, useRef, useState } from 'react';
import { useGraph } from '../store/GraphContext.jsx';
import { useDashboard } from '../store/FileHandlerContext.jsx';

const ProgressBar = ({ initialValue = 0, maxValue = 100, onChange }) => {
  const [value, setValue] = useState(initialValue);
  const [hoverValue, setHoverValue] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const { index, fpsMode} = useDashboard();
  const { currentFileIndexLoaded, currentFrame } = useGraph();
  const barRef = useRef(null);
  const [loadedValue, setLoadedValue] = useState(0);

  useEffect(() => {
    setValue(currentFrame);
  }, [currentFrame]);

  useEffect(() => {
    setLoadedValue(index && index.fileIndex && index.fileIndex[currentFileIndexLoaded]
      ? index.fileIndex[currentFileIndexLoaded].end_frame
      : 0);
  }, [currentFileIndexLoaded]);

  const handleMouseDown = (e) => {
    const bar = barRef.current;
    const updateValue = (e) => {
      const rect = bar.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const newValue = (offsetX / rect.width) * maxValue;
      setValue(Math.max(0, Math.min(maxValue, newValue)));
      onChange(Math.max(0, Math.min(maxValue, newValue)));
    };

    const handleMouseMove = (e) => {
      updateValue(e);
    };

    const handleMouseUp = (e) => {
      updateValue(e);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    const bar = barRef.current;
    const rect = bar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newValue = (offsetX / rect.width) * maxValue;
    setHoverValue(Math.max(0, Math.min(maxValue, newValue)));
    setTooltipPosition({ x: offsetX, y: e.clientY- rect.top - 25 });
  };

  const frameToTime = (frame, fpsMode = 30) => {
    const totalSeconds = frame / fpsMode;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds.toFixed(2)).padStart(5, '0')}`;
  };

  return (
    <div
      className="relative w-full h-2 bg-gray-300 rounded cursor-pointer"
      ref={barRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverValue(null)}
    >
      {/* Barra di caricamento */}
      <div
        className="absolute top-0 left-0 h-full bg-gray-200 rounded"
        style={{ width: `${(loadedValue / maxValue) * 100}%` }}
      />

      {/* Barra di avanzamento */}
      <div
        className="absolute top-0 left-0 h-full bg-details-blue rounded"
        style={{ width: `${(value / maxValue) * 100}%` }}
      />

      {/* Ombra di avanzamento */}
      <div
        className="absolute top-0 left-0 h-full bg-gray-500 opacity-50"
        style={{ width: hoverValue !== null ? `${(hoverValue / maxValue) * 100}%` : '0%' }}
      />

      {/* Maniglia della barra di avanzamento */}
      <div
        className="absolute top-1/2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full transform -translate-y-1/2 -translate-x-1/2"
        style={{ left: `${(value / maxValue) * 100}%` }}
      />

      {hoverValue !== null && (
        <div
          className="absolute bg-gray-700 text-white text-xs rounded p-1 transform -translate-x-1/2"
          style={{ left: `${tooltipPosition.x}px`, top: `${tooltipPosition.y}px` }}
        >
          {frameToTime(hoverValue,fpsMode)}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
