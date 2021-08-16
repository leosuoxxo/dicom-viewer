import React, { useContext } from 'react';

import { Flex } from './components/elements';
import ToolBar from './containers/ToolBar';
import DicomViewer from './containers/DicomViewer';
import { ToolManageService } from './services/toolManageService';
import ConfigContext, { useConfigContext } from './ConfigContext';
import { VIEWER_LAYOUT } from './constants';
import { isNil } from 'lodash';

function AppInner() {
  const { imageIds } = useContext(ToolManageService);
  const { currentLayout } = useContext(ConfigContext);

  return (
    <>
      <ToolBar />
      <Flex style={{ height: '100%' }}>
        {currentLayout >= VIEWER_LAYOUT[0] && (
          <DicomViewer imageIds={imageIds} />
        )}
        {currentLayout === VIEWER_LAYOUT[1] && (
          <DicomViewer imageIds={isNil(imageIds[1]) ? [] : [imageIds[1]]} />
        )}
      </Flex>
    </>
  );
}

function App() {
  const configContext = useConfigContext();

  return (
    <ConfigContext.Provider value={configContext}>
      <AppInner />
    </ConfigContext.Provider>
  );
}

export default App;
