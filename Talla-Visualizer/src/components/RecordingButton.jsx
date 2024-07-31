import React, { useState, useEffect } from "react";
import { VideoCameraIcon, StopIcon } from "@heroicons/react/20/solid";

export default function RecordingButton() {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  useEffect(() => {
    const handleStartRecording = async (event, sourceId) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: "desktop",
              chromeMediaSourceId: sourceId,
              minWidth: 1920, // Increased resolution
              maxWidth: 1920,
              minHeight: 1080,
              maxHeight: 1080,
            },
          },
        });

        const options = { mimeType: "video/webm; codecs=vp9" };
        const recorder = new MediaRecorder(stream, options);
        let localRecordedChunks = [];

        recorder.ondataavailable = (event) => {
          console.log('Data available: ', event.data.size);
          if (event.data.size > 0) {
            localRecordedChunks.push(event.data);
          }
        };

        recorder.onstop = () => {
          console.log('Recording stopped, saving file...');
          setRecordedChunks(localRecordedChunks); // Update state
          saveRecording(localRecordedChunks);
        };

        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
      } catch (error) {
        console.error('Error starting recording: ', error);
      }
    };

    const handleStopRecording = () => {
      if (mediaRecorder) {
        console.log('Stopping recording...');
        mediaRecorder.stop();
        setIsRecording(false);
      }
    };

    window.electronAPI.on("start-recording", handleStartRecording);
    window.electronAPI.on("stop-recording", handleStopRecording);

    return () => {
      window.electronAPI.off("start-recording", handleStartRecording);
      window.electronAPI.off("stop-recording", handleStopRecording);
    };
  }, [mediaRecorder]);

  const saveRecording = (chunks) => {
    if (chunks.length > 0) {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "recording.webm";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
    } else {
      console.error('No recorded chunks available to save.');
    }
  };

  return (
    <>
      <button
        type="button"
        className="absolute top-5 shadow left-20 rounded-full hover:scale-110 hover:bg-gray-50 p-2 hover:text-unitn-grey z-[110]"
        onClick={async() => {
          if (!isRecording) {
            const sources = await window.electronAPI.invoke('get-screen-sources');
            console.log('Sources: ', sources);
            let screenSource;
            if(sources.find(source => source.name === 'Talla Visualizer')){
              screenSource = sources.find(source => source.name === 'Talla Visualizer');
            } else if(sources.find(source => source.name === 'Talla Visualizer')){
              screenSource = sources.find(source => source.name === 'Schermo 1')
            }
            else {
              if (sources.length > 0 && sources.length === 1) {
                screenSource = sources[0];
              }
            }
            
            if (screenSource) {
              await window.electronAPI.invoke('start-recording', screenSource.id);
            }
          } else {
            if (mediaRecorder) {
              await window.electronAPI.invoke('stop-recording');
            }
          }
          setIsRecording(!isRecording);
        }}
      >
        {isRecording ? (
          <StopIcon className="h-6 w-6 text-red-600 blinking-icon"></StopIcon>
        ) : (
          <VideoCameraIcon className="h-6 w-6"></VideoCameraIcon>
        )}
      </button>
    </>
  );
}
