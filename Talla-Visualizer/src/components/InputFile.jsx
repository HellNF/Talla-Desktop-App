import React, { useState, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { DocumentIcon } from '@heroicons/react/24/solid';
import { FileContext } from '../store/uploadedFileContext.jsx';
import {XMarkIcon} from '@heroicons/react/24/solid';

export default function InputFile() {
  const [fileData, setFileData] = useContext(FileContext);
  const [rejectedFiles, setRejectedFiles] = useState([]);

  const handleRemoveFile = (index) => {
    const newFileData = [...fileData];
    newFileData.splice(index, 1);
    setFileData(newFileData);
  };
  const onDrop = (acceptedFiles, rejectedFiles) => {
    // Log per il debug
    

    // Filtra i file accettati con i tipi corretti
    const validFiles = acceptedFiles.filter(item =>
      item.type === "application/zip" ||  
      item.type === "application/x-zip-compressed" ||
      item.type === "application/x-zip" ||
      item.type === "text/csv" || 
      item.type === "application/json"
    );


    if (validFiles.length > 0) {
      setFileData(prevFileData => [...prevFileData, ...validFiles]);
    }

    // Gestisci i file rifiutati
    setRejectedFiles(rejectedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip'],
      'application/x-zip': ['.zip'],
      'text/csv': ['.csv'],
      'application/json': ['.json']
    }
  });

  return (
    <div className="flex items-center justify-center w-full">
      <div
        {...getRootProps()}
        className={`flex justify-center items-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 w-11/12 h-5/6 ${
          isDragActive ? 'bg-details-light-blue/20' : ''
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <DocumentIcon
            className="mx-auto h-12 w-12 text-gray-300"
            aria-hidden="true"
          />
          <div className="mt-4 flex text-sm leading-6 text-gray-600">
            <label className="relative cursor-pointer rounded-md bg-white font-semibold text-secondary focus-within:outline-none focus-within:ring-2 focus-within:ring-details-red focus-within:ring-offset-2 hover:text-details-red">
              <span>Upload a file</span>
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs leading-5 text-gray-600">CSV, ZIP, JSON</p>
          <div className=" flex flex-col text-xs  leading-5 text-gray-600">
            {fileData.length > 0 ? fileData.map((file,index) => (
              <div className='flex flex-row space-x-1 px-1 items-center justify-center'>
                <label htmlFor="">{file.name}</label>
                <button type="button" key={index} className='bg-details-red rounded-full' onClick={()=>handleRemoveFile(index)}><XMarkIcon  className='h-3 w-3 text-primary'/></button>
              </div>
              )) : ''}
          </div>
          {rejectedFiles.length > 0 && (
            <div className="mt-2 text-xs leading-5 text-red-600">
              {rejectedFiles.map((file, index) => (
                <div key={index}>{file.file.name} - {file.errors[0].message}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
