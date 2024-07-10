import React from 'react';
import { useMode } from '../store/ModeContext.jsx';
import { FolderOpenIcon, WifiIcon } from '@heroicons/react/24/solid';

const ModeSwitch = () => {
  const { isOnline, toggleMode } = useMode();

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={isOnline}
        onChange={toggleMode}
        className="sr-only"
      />
      <div className="relative bg-gray-200 dark:bg-gray-200 w-12 h-6 rounded-full transition duration-300 ease-in-out">
        <div
          className={`absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center transition transform ${
            isOnline ? 'translate-x-6 bg-details-blue' : 'bg-details-red'
          }`}
        >
          {isOnline ? <WifiIcon className="w-4 h-4 text-white" /> : <FolderOpenIcon className="w-4 h-4 text-white" />}
        </div>
      </div>
    </label>
  );
};

export default ModeSwitch;
