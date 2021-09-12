import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { Flex } from '../../components/elements';
import ToolBar from '../../containers/ToolBar';
import DicomViewer from '../../containers/DicomViewer';
import { CornerstoneServiceProvider } from '../../services/cornerstoneService';
import {
  ToolManageServiceProvider,
  ToolManageService,
} from '../../services/toolManageService';

import ConfigContext, { useConfigContext } from '../../ConfigContext';
import { TOOLBAR_HEIGHT, VIEWER_LAYOUT } from '../../constants';
import { find, isNil } from 'lodash';

function HomeInner() {
  const { imageInfos } = useContext(ToolManageService);
  const { currentLayout } = useContext(ConfigContext);

  const getImageIdFromPosition = (position) => {
    const imageInfo = find(imageInfos, { position });
    return isNil(imageInfo) ? null : imageInfo.id;
  };

  if (!localStorage.getItem('code')) {
    return <Redirect to="/login" />;
  }

  return (
    <>
      <ToolBar />
      <Flex
        style={{
          height: `calc(100% - ${TOOLBAR_HEIGHT})`,
          marginTop: TOOLBAR_HEIGHT,
        }}
      >
        {currentLayout >= VIEWER_LAYOUT[0] && (
          <DicomViewer
            imageId={getImageIdFromPosition(VIEWER_LAYOUT[0])}
            position={VIEWER_LAYOUT[0]}
            order={0}
          />
        )}
        {currentLayout === VIEWER_LAYOUT[1] && (
          <DicomViewer
            imageId={getImageIdFromPosition(VIEWER_LAYOUT[1])}
            position={VIEWER_LAYOUT[1]}
            order={1}
          />
        )}
      </Flex>
    </>
  );
}

export function HomePage() {
  const configContext = useConfigContext();

  return (
    <CornerstoneServiceProvider>
      <ToolManageServiceProvider>
        <ConfigContext.Provider value={configContext}>
          <HomeInner />
        </ConfigContext.Provider>
      </ToolManageServiceProvider>
    </CornerstoneServiceProvider>
  );
}
