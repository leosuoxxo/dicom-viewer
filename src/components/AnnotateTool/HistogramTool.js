import React, { useContext, useMemo, useState } from 'react';
import {
  IconButton,
  Drawer,
  Tooltip,
  Paper,
  TextField,
} from '@material-ui/core';
import { BarChart } from '@material-ui/icons';
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  BarSeries,
  LineSeries,
} from '@devexpress/dx-react-chart-material-ui';
import { filter, isEmpty, isNil, keys, map, mapValues, toNumber } from 'lodash';

import { ToolManageService } from '../../services/toolManageService';
import { Box } from '../../components/elements/Box';

export const HistogramTool = () => {
  const { activateHistogramTool } = useContext(ToolManageService);
  const [open, setOpen] = useState(null);
  const [histogramData, setHistogramData] = useState(null);
  const [toolData, setToolData] = useState(null);

  const onClickIcon = () => {
    if (isEmpty(histogramData)) {
      activateHistogramTool(setHistogramData, setToolData, toolData);
    } else {
      setOpen(true);
    }
  };

  const [threshold, setThreshold] = useState(0);

  const chartData = useMemo(() => {
    return mapValues(histogramData, (data) =>
      map(data, (d) => ({
        ...d,
        threshold,
      }))
    );
  }, [histogramData, threshold]);

  const higherValues = useMemo(() => {
    return mapValues(histogramData, (data) =>
      filter(data, (d) => d.value > threshold)
    );
  }, [histogramData, threshold]);

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
          {!isNil(chartData) &&
            map(keys(chartData), (imageId) => (
              <>
                <Paper style={{ width: '50%' }}>
                  <Chart data={chartData[imageId]}>
                    <ArgumentAxis />
                    <ValueAxis />
                    <BarSeries valueField="value" argumentField="argument" />
                    <LineSeries
                      valueField="threshold"
                      argumentField="argument"
                    />
                  </Chart>
                  <TextField
                    style={{ margin: '5px 50px' }}
                    onChange={(event) => {
                      setThreshold(toNumber(event.target.value));
                    }}
                    label="閥值"
                    type="number"
                  />
                  <Box
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      margin: '5px 50px',
                    }}
                  >
                    <Box style={{ marginRight: 5 }}>Pixel</Box>
                    {map(higherValues[imageId], ({ argument }) => (
                      <Box>{`${argument}, `}</Box>
                    ))}
                    <Box style={{ marginLeft: 5 }}>高於閥值</Box>
                  </Box>
                </Paper>
              </>
            ))}
        </div>
      </Drawer>
    </>
  );
};
