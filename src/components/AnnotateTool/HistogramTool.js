import React, { useContext, useMemo, useState } from 'react';
import styled from 'styled-components';
import { IconButton, Drawer, Tooltip, Paper, Box } from '@material-ui/core';
import { BarChart } from '@material-ui/icons';
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  BarSeries,
} from '@devexpress/dx-react-chart-material-ui';
import { get, isEmpty, keys, map } from 'lodash';

import { ToolManageService } from '../../services/toolManageService';

const StyledHeader = styled(Box)`
  font-size: 20px;
  margin: 10px;
`;

export const HistogramTool = () => {
  const { imageInfos, activateHistogramTool } = useContext(ToolManageService);
  const [open, setOpen] = useState(null);
  const [histogramData, setHistogramData] = useState(null);
  const [toolData, setToolData] = useState(null);

  const imageIds = useMemo(() => {
    return map(imageInfos, 'id');
  }, [imageInfos]);

  const onClickIcon = () => {
    if (isEmpty(histogramData) || keys(histogramData).length === 1) {
      activateHistogramTool(setHistogramData, setToolData, toolData);
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <Tooltip title="灰階圖表">
        <IconButton onClick={onClickIcon}>
          <BarChart />
        </IconButton>
      </Tooltip>
      <Drawer anchor={'top'} open={open} onClose={() => setOpen(false)}>
        <div
          style={{
            marginTop: '48px',
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
          }}
        >
          {get(histogramData, imageIds[0]) && (
            <>
              <StyledHeader>左圖</StyledHeader>
              <Paper style={{ width: '50%' }}>
                <Chart data={get(histogramData, imageIds[0])}>
                  <ArgumentAxis />
                  <ValueAxis />
                  <BarSeries valueField="value" argumentField="argument" />
                </Chart>
              </Paper>
            </>
          )}
          {get(histogramData, imageIds[1]) && (
            <>
              <StyledHeader>右圖</StyledHeader>
              <Paper style={{ width: '50%' }}>
                <Chart data={get(histogramData, imageIds[1])}>
                  <ArgumentAxis />
                  <ValueAxis />
                  <BarSeries valueField="value" argumentField="argument" />
                </Chart>
              </Paper>
            </>
          )}
        </div>
      </Drawer>
    </>
  );
};
