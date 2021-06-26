import { useContext, useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import Box from './components/Box';
import BasicLayout from './layouts/BasicLayout';
import DicomViewer from './containers/DicomViewer';
import ToolBar from './containers/ToolBar';
import { ToolManageService } from './services/toolManageService';
import { useCornerstone } from './services/cornerstoneService';

function App() {
  const { imageIds } = useContext(ToolManageService);
  const { cornerstone, cornerstoneWADOImageLoader } = useCornerstone();

  const [isLoading, setIsLoading] = useState(true);
  const imageId = 'wadouri:https://storage.googleapis.com/dicom-viewer-dac76.appspot.com/Gas201.DCM';

  return (
    <BasicLayout top={<ToolBar />}>
      <Box display="flex" height="100%">
        <DicomViewer imageIds={imageIds} />

        {
          !isLoading ? (
            <DicomViewer imageIds={[imageId]} />
          ) : (
            <Box width="100%" flex="1" display="inline-flex" jutifyContent="center" alignItems="center">
              <Button color="primary" onClick={() => setIsLoading(false)}>click me !!!</Button>
            </Box>
          )
        }
      </Box>
    </BasicLayout>
  );
}

export default App;
