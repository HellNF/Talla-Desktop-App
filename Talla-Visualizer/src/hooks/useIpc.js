import React, { useEffect } from 'react';

const useIpc = (channel, callback) => {
  useEffect(() => {
    window.electron.receive(channel, callback);
    return () => {
      // Assicurati di rimuovere il listener correttamente utilizzando la stessa astrazione
      window.electron.removeListener(channel, callback);
    };
  }, [channel, callback]);
};

export const sendIpc = (channel, message) => {
  window.electron.send(channel, message);
};

export const invokeIpc = async (channel, args) => {
  return await window.electron.invoke(channel, args);
};

export default useIpc;