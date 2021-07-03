import { createContext, useCallback, useContext, useState } from 'react'; 
import Tiff from 'tiff.js'
import { useCornerstone } from './cornerstoneService'
import { getExtensions, fileToBuffer } from 'utils'

export const useToolManageService = () => {
  const { cornerstoneWADOImageLoader, cornerstoneTools, cornerstoneFileImageLoader, cornerstone } = useCornerstone();
  const [imageIds,setImageIds] = useState([])

  const imageUpload = useCallback(async (file) => {
    const ext = getExtensions(file.name);

    switch(ext) {
      case 'tif':
        const buffer = await fileToBuffer(file);
        const tiff = new Tiff({ buffer });
        const canvas = tiff.toCanvas();
        canvas.toBlob(async function(blob) {
          const canvasBuffer = await blob.arrayBuffer();
          const imageId = cornerstoneFileImageLoader.fileManager.addBuffer(canvasBuffer);
          setImageIds([imageId])
        });
        break;

      case 'dcm':
      default:
        const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
        setImageIds([imageId])
    }
    
  },[])

  const lengthTool = useCallback(() => {
    cornerstoneTools.setToolActive('Length', { mouseButtonMask: 1 })
  },[])

  return { 
    imageIds,
    imageUpload,
    lengthTool
   }
}

export const ToolManageService = createContext({});
export const ToolManageServiceProvider = ({ children }) => {
  return (
    <ToolManageService.Provider value={useToolManageService()}>
      {children}
    </ToolManageService.Provider>
  )
}