import React, { createContext, useState } from 'react';

// Create a new context
const FileContext = createContext();

// Create a provider component
const FileProvider = ({ children }) => {
    // Define the state variables
    const [fileData, setFileData] = useState([]);

    
    

    // Render the provider component with the context value
    return (
        <FileContext.Provider value={[fileData,setFileData]}>
            {children}
        </FileContext.Provider>
    );
};

export { FileContext, FileProvider };