import { createContext, useCallback, useContext, useState } from 'react'; 
import { useCornerstone } from './cornerstoneService'

export default function useToken(func,initialValue) {
  return createContext(initialValue);
}

export const useToolManageService = () => {
  const { cornerstoneWADOImageLoader, cornerstoneTools } = useCornerstone();
  const [imageIds,setImageIds] = useState([])

  const imageUpload = useCallback((file) => {
    const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
    setImageIds([imageId])
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