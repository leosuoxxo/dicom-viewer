import { useEffect, useState, useRef } from 'react';
import { Box, Input } from '@material-ui/core';
import BasicLayout from './layouts/BasicLayout';
import DicomViewer from './containers/DicomViewer';
import ToolBar from './containers/ToolBar';
import { useCornerstone } from './services/cornerstoneService';

function App() {
  const { cornerstoneWADOImageLoader, cornerstone, cornerstoneTools } = useCornerstone();
  const [imageIds, setImageIds] = useState([]);

  const inputChangeHandler = e => {
    const file = e.target.files[0];
    const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
    setImageIds([imageId])
  }

  return (
    <BasicLayout top={
      <>
        <ToolBar />
        <Input type="file" onChange={inputChangeHandler} />
      </>
    }>
      <Box display="flex" height="100%">
        <DicomViewer imageIds={imageIds}/>
        <DicomViewer imageIds={imageIds}/>
      </Box>
    </BasicLayout>
  );
}

export default App;
