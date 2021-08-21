import React, { useContext } from 'react';

import { Flex } from './components/elements';
import ToolBar from './containers/ToolBar';
import DicomViewer from './containers/DicomViewer';
import { ToolManageService } from './services/toolManageService';
import ConfigContext, { useConfigContext } from './ConfigContext';
import { VIEWER_LAYOUT } from './constants';
import { find, isNil } from 'lodash';

function AppInner() {
  const { imageInfos } = useContext(ToolManageService);
  const { currentLayout } = useContext(ConfigContext);

  const getImageIdFromPosition = (position) => {
    const imageInfo = find(imageInfos, { position });
    return isNil(imageInfo) ? null : imageInfo.id;
  };

  return (
    <>
      <ToolBar />
      <Flex style={{ height: '100%' }}>
        {currentLayout >= VIEWER_LAYOUT[0] && (
          <DicomViewer
            imageId={getImageIdFromPosition(VIEWER_LAYOUT[0])}
            position={VIEWER_LAYOUT[0]}
          />
        )}
        {currentLayout === VIEWER_LAYOUT[1] && (
          <DicomViewer
            imageId={getImageIdFromPosition(VIEWER_LAYOUT[1])}
            position={VIEWER_LAYOUT[1]}
          />
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
