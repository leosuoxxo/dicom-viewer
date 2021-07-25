import React, { useContext } from 'react';

import { Flex } from './components/elements';
import ToolBar from './containers/ToolBar';
import DicomViewer from './containers/DicomViewer';
import { ToolManageService } from './services/toolManageService';
function App() {
  const { imageIds } = useContext(ToolManageService);

  return (
    <>
      <ToolBar />
      <Flex style={{ height: '100%' }}>
        <DicomViewer imageIds={imageIds} />
      </Flex>
    </>
  );
}

export default App;
