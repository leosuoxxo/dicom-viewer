import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  IconButton,
  Drawer,
  Tooltip as Tip,
  Paper,
  TextField,
  Dialog,
  InputAdornment,
  Button,
  Popover,
  Checkbox,
  FormControlLabel,
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
import { filter, isNil, keys, map, mapValues, toNumber } from 'lodash';

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

const PopoverItem = styled(Box)`
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.palette.action.hover};
  }
`;

const RotationDialog = ({ open, onClose, onConfirm }) => {
  const [shouldRotate, setShouldRotate] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(null);

  return (
    <StyledDialog open={open} onClose={onClose}>
      <TextField
        label="順時針旋轉"
        onChange={(event) => {
          setRotationAngle(toNumber(event.target.value));
        }}
        sx={{ m: 1, width: '25ch' }}
        InputProps={{
          endAdornment: <InputAdornment position="start">°</InputAdornment>,
        }}
        disabled={shouldRotate}
        type="number"
      />
      <FormControlLabel
        label={'鏡射'}
        control={
          <Checkbox
            onChange={(event) => setShouldRotate(event.target.checked)}
          />
        }
      />
      <StyledButton
        variant="contained"
        onClick={() => onConfirm(shouldRotate, rotationAngle)}
      >
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
  const {
    activateHistogramTool,
    getValidElements,
    histogramData,
    getSelectedElement,
    resetHistogramTool,
    toolDataUpload,
    exportToolData,
    threshold,
    setThreshold,
  } = useContext(ToolManageService);
  const [openGraph, setOpenGraph] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const chartData = useMemo(() => {
    return mapValues(histogramData, (data) =>
      map(data, (d) => ({
        ...d,
        threshold,
      }))
    );
  }, [histogramData, threshold]);
  const [openDialog, setOpenDialog] = useState(false);

  const onClickIcon = (event) => {
    setAnchorEl(event.target);
  };

  const onDrawLine = useCallback(() => {
    const element = getSelectedElement();

    activateHistogramTool({
      targetImageId: element.image.imageId,
    });
  }, [getSelectedElement, activateHistogramTool]);

  const onRotateLine = useCallback(() => {
    if (isNil(histogramData)) {
      alert('請先使用畫線工具');
    }
    setOpenDialog(true);
  }, [histogramData, setOpenDialog]);

  const onClearLine = useCallback(() => {
    resetHistogramTool();
  }, [resetHistogramTool]);

  const onConfirm = useCallback(
    (shouldRotate, rotationAngle) => {
      const [leftImage, rightImage] = getValidElements();
      if (shouldRotate) {
        activateHistogramTool({
          rotationAngle,
          targetImageId: rightImage.image.imageId,
          sourceImageId: leftImage.image.imageId,
        });
      } else {
        activateHistogramTool({
          targetImageId: rightImage.image.imageId,
          sourceImageId: leftImage.image.imageId,
        });
      }
      setOpenDialog(false);
    },
    [activateHistogramTool, getValidElements]
  );

  const higherValues = useMemo(() => {
    return mapValues(histogramData, (data) =>
      filter(data, (d) => d.value > threshold)
    );
  }, [histogramData, threshold]);

  const inputRef = useRef();

  const fileUploadHanlder = (event) => {
    const file = event.target.files[0];
    toolDataUpload(file);
    setAnchorEl(null);
  };

  return (
    <>
      <RotationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={onConfirm}
      />
      <Tip title="灰階圖表">
        <IconButton onClick={onClickIcon}>
          <BarChart />
        </IconButton>
      </Tip>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <PopoverItem
          p={3}
          onClick={() => {
            setAnchorEl(null);
            onDrawLine();
          }}
        >
          畫線
        </PopoverItem>
        <PopoverItem
          p={3}
          onClick={() => {
            setAnchorEl(null);
            onRotateLine();
          }}
        >
          轉換角度
        </PopoverItem>
        <PopoverItem
          p={3}
          onClick={() => {
            setAnchorEl(null);
            setOpenGraph(true);
          }}
        >
          展示圖表
        </PopoverItem>
        <PopoverItem
          p={3}
          onClick={() => {
            setAnchorEl(null);
            onClearLine();
          }}
        >
          清除資料
        </PopoverItem>
        <PopoverItem
          p={3}
          onClick={() => {
            inputRef.current.click();
          }}
        >
          上傳標註
          <input
            hidden
            ref={inputRef}
            type="file"
            onChange={fileUploadHanlder}
          />
        </PopoverItem>
        <PopoverItem
          p={3}
          onClick={() => {
            exportToolData(threshold);
          }}
        >
          匯出標註
        </PopoverItem>
      </Popover>
      <Drawer
        anchor={'top'}
        open={openGraph}
        onClose={() => setOpenGraph(false)}
      >
        <div
          style={{
            marginTop: '48px',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          {!isNil(chartData) && (
            <TextField
              style={{ margin: '5px 50px' }}
              onChange={(event) => {
                setThreshold(toNumber(event.target.value));
              }}
              value={threshold}
              label="閥值"
              type="number"
            />
          )}
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
        </div>
      </Drawer>
    </>
  );
};
