import { createContext, useEffect, useContext, useRef, useMemo } from 'react';
import dicomParser from 'dicom-parser';
import cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import cornerstoneMath from 'cornerstone-math';
import cornerstoneTools from 'cornerstone-tools';
import Hammer from 'hammerjs';

export const Context = createContext({});

export const CornerstoneServiceProvider = ({ children }) => {
  const initializedRef = useRef(false);
  const cornerstoneToolsRef = useRef(cornerstoneTools);
  const cornerstoneWADOImageLoaderRef = useRef(cornerstoneWADOImageLoader);

  useEffect(() => {
    if(initializedRef.current) return;
    // Cornerstone Tools
    cornerstoneToolsRef.current.external.cornerstone = cornerstone;
    cornerstoneToolsRef.current.external.Hammer = Hammer;
    cornerstoneToolsRef.current.external.cornerstoneMath = cornerstoneMath;
    cornerstoneToolsRef.current.init({ showSVGCursors: true });
  
    cornerstoneWADOImageLoaderRef.current.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoaderRef.current.external.dicomParser = dicomParser;
    cornerstoneWADOImageLoaderRef.current.webWorkerManager.initialize({
      maxWebWorkers: navigator.hardwareConcurrency || 1,
      startWebWorkersOnDemand: true,
      taskConfiguration: {
        decodeTask: {
          initializeCodecsOnStartup: false,
          usePDFJS: false,
          strict: false,
        },
      },
    });

    initializedRef.current = true;
  },[])

  const refs = useMemo(() => ({
      cornerstone,
      cornerstoneTools: cornerstoneToolsRef.current,
      cornerstoneWADOImageLoader: cornerstoneWADOImageLoaderRef.current,
    }),[])

  return (
    <Context.Provider value={refs}>
      {children}
    </Context.Provider>
  )
}

export const useCornerstone = () => useContext(Context)