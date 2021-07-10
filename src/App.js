import React, { useContext, useState } from 'react';
import { Button } from '@material-ui/core';

import { Box, Flex } from './components/elements';
import ToolBar from './containers/ToolBar';
import DicomViewer from './containers/DicomViewer';
import { ToolManageService } from './services/toolManageService';

function App() {
  const { imageIds } = useContext(ToolManageService);
  const [isLoading, setIsLoading] = useState(true);
  const imageId =
    'wadouri:https://storage.googleapis.com/dicom-viewer-dac76.appspot.com/Gas201.DCM';

  return (
    <>
      <ToolBar />
      <Flex style={{ height: '100%' }}>
        <DicomViewer imageIds={imageIds} />
        {!isLoading ? (
          <DicomViewer imageIds={[imageId]} />
        ) : (
          <Box
            width="100%"
            flex="1"
            display="inline-flex"
            jutifyContent="center"
            alignItems="center"
          >
            <Button color="primary" onClick={() => setIsLoading(false)}>
              click me !!!
            </Button>
          </Box>
        )}
      </Flex>
    </>
  );
}

export default App;
