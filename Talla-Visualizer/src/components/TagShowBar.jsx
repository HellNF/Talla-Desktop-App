import React from 'react';
import { useDashboard } from '../store/FileHandlerContext.jsx';
import { useViewSettings } from '../store/viewSettingsContext.jsx';
import { useGraph } from '../store/GraphContext.jsx';
const TagShowBar = ({ tag}) => {
    const { currentFrame, setCurrentFrame } = useGraph();
    const { index } = useDashboard();
    const {tagSetting, setTagSetting} = useViewSettings();
    const totalDuration= index?.fileIndex[index?.fileIndex?.length-1].end_frame ;
    const getTagPosition = (tagTime) => {
    return (tagTime / totalDuration) * 100;
  };

  return (
    <div
      className="relative w-full h-2 bg-gray-300 rounded cursor-pointer"
      
    >
      
      {index?.fileIndex?.map((file) => {
        return (
          file.tags.includes(tag) ?(<div
            key={file.start_frame}
            className="absolute top-0 h-full  "
            style={{
              left: `${getTagPosition(file.start_frame)}%`,
              width: `${getTagPosition(file.end_frame) - getTagPosition(file.start_frame)}%`,
                backgroundColor: tagSetting[tag]?.color.main,
            }}
            onClick={() => setCurrentFrame(file.start_frame)}
          />):null

        );
      })
      }
    </div>
      
  );
};

export default TagShowBar;
