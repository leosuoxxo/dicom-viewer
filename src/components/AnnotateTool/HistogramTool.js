import React, { useCallback, useContext, useMemo, useState } from 'react';
import {
  IconButton,
  Drawer,
  Tooltip as Tip,
  Paper,
  TextField,
  Dialog,
  InputAdornment,
  Button,
} from '@material-ui/core';
import { BarChart } from '@material-ui/icons';
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  BarSeries,
  LineSeries,
  Tooltip,
  Title,
  ZoomAndPan,
} from '@devexpress/dx-react-chart-material-ui';
import { EventTracker } from '@devexpress/dx-react-chart';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { filter, isEmpty, isNil, keys, map, mapValues, toNumber } from 'lodash';

import { ToolManageService } from '../../services/toolManageService';
import { Box } from '../../components/elements/Box';

const StyledDialog = styled(Dialog)`
  && .MuiDialog-paperWidthSm {
    padding: 20px;
  }
`;

const StyledButton = styled(Button)`
  &.MuiButton-root {
    margin: 20px 0 0 0;
  }
`;

const RotationDialog = ({ open, onClose, setAngle, onConfirm }) => {
  return (
    <StyledDialog open={open} onClose={onClose}>
      <TextField
        label="順時針旋轉"
        onChange={(event) => {
          setAngle(toNumber(event.target.value));
        }}
        sx={{ m: 1, width: '25ch' }}
        InputProps={{
          endAdornment: <InputAdornment position="start">°</InputAdornment>,
        }}
        type="number"
      />
      <StyledButton variant="contained" onClick={onConfirm}>
        確認
      </StyledButton>
    </StyledDialog>
  );
};

RotationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  setAngle: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export const HistogramTool = () => {
  const { activateHistogramTool, getValidElements, histogramData } =
    useContext(ToolManageService);
  const [openGraph, setOpenGraph] = useState(null);

  const onClickIcon = () => {
    const [leftImage] = getValidElements();
    if (isEmpty(histogramData)) {
      activateHistogramTool({
        targetImageId: leftImage.image.imageId,
      });
    } else if (keys(histogramData).length === 1) {
      setOpenDialog(true);
    } else {
      setOpenGraph(true);
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

  const [openDialog, setOpenDialog] = useState(false);

  const [rotationAngle, setRotationAngle] = useState(null);

  const onConfirm = useCallback(() => {
    const [leftImage, rightImage] = getValidElements();
    activateHistogramTool({
      rotationAngle,
      targetImageId: rightImage.image.imageId,
      sourceImageId: leftImage.image.imageId,
    });
    setOpenDialog(false);
  }, [activateHistogramTool, rotationAngle, getValidElements]);

  return (
    <>
      <RotationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        setAngle={setRotationAngle}
        onConfirm={onConfirm}
      />
      <Tip title="灰階圖表">
        <IconButton onClick={onClickIcon}>
          <BarChart />
        </IconButton>
      </Tip>
      <Drawer
        anchor={'top'}
        open={openGraph}
        onClose={() => setOpenGraph(false)}
      >
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
              <Box key={imageId} style={{ width: '50%' }}>
                <Paper>
                  <Chart data={chartData[imageId]}>
                    <ValueAxis />
                    <ArgumentAxis />
                    <BarSeries valueField="value" argumentField="argument" />
                    <LineSeries
                      valueField="threshold"
                      argumentField="argument"
                    />
                    <Title text="灰階圖表" />
                    <ZoomAndPan />

                    <EventTracker />
                    <Tooltip />
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
                    <Box
                      style={{
                        width: '70vw',
                        flexDirection: 'row',
                        overflow: 'auto',
                        display: 'flex',
                      }}
                    >
                      {map(higherValues[imageId], ({ argument }) => (
                        <Box key={argument}>{`${argument}, `}</Box>
                      ))}
                    </Box>
                    <Box
                      style={{ marginLeft: 5, width: '15vw' }}
                    >{`高於閥值, 共${higherValues[imageId].length}個`}</Box>
                  </Box>
                </Paper>
              </Box>
            ))}
        </div>
      </Drawer>
    </>
  );
};
