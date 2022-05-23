import React, { useContext, useMemo, useState } from 'react';
import styled from 'styled-components';
import { IconButton, Drawer, Tooltip } from '@material-ui/core';
import { BarChart } from '@material-ui/icons';
import { map } from 'lodash';

import { ToolManageService } from '../../services/toolManageService';

const StyledSidebar = styled(Drawer)`
  && .MuiDrawer-paper {
    width: 20vw;
  }
`;

export const HistogramTool = () => {
  const { imageInfos, activateHistogramTool } = useContext(ToolManageService);
  const [open, setOpen] = useState(null);

  const imageIds = useMemo(() => {
    return map(imageInfos, 'id');
  }, [imageInfos]);

  const onClickIcon = () => {
    /*
    if (imageInfos.length < 2) {
      alert('此工具需要上傳兩張圖檔');
      return;
    }
    */
    activateHistogramTool(imageIds);
  };

  return (
    <>
      <Tooltip title="灰階圖表">
        <IconButton onClick={onClickIcon}>
          <BarChart />
        </IconButton>
      </Tooltip>
      <StyledSidebar
        anchor={'right'}
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={{ marginTop: '48px' }}>
          <div></div>
        </div>
      </StyledSidebar>
    </>
  );
};
