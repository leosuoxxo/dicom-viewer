import { createContext, useEffect, useContext, useRef } from 'react';
import dicomParser from 'dicom-parser';
import cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import cornerstoneFileImageLoader from 'cornerstone-file-image-loader';
import cornerstoneMath from 'cornerstone-math';
import cornerstoneTools from 'cornerstone-tools';
import Hammer from 'hammerjs';

export const Context = createContext({});

export const CornerstoneServiceProvider = ({ children }) => {
  const cornerstoneToolsRef = useRef(cornerstoneTools);
  const cornerstoneFileImageLoaderRef = useRef(cornerstoneFileImageLoader);
  const cornerstoneWADOImageLoaderRef = useRef(cornerstoneWADOImageLoader);

  useEffect(() => {
    console.log('init Cornerstone')
    // Cornerstone Tools
    cornerstoneToolsRef.current.external.cornerstone = cornerstone;
    cornerstoneToolsRef.current.external.Hammer = Hammer;
    cornerstoneToolsRef.current.external.cornerstoneMath = cornerstoneMath;
    cornerstoneToolsRef.current.init({ showSVGCursors: true });
  
    // Image Loader
    cornerstoneFileImageLoaderRef.current.external.cornerstone = cornerstone;
  
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
  },[])

  const refs = {
    cornerstone,
    cornerstoneTools: cornerstoneToolsRef.current,
    cornerstoneFileImageLoader: cornerstoneFileImageLoaderRef.current,
    cornerstoneWADOImageLoader: cornerstoneWADOImageLoaderRef.current
  }

  return (
    <Context.Provider value={refs}>
      {children}
    </Context.Provider>
  )
}

export const useCornerstone = () => useContext(Context)