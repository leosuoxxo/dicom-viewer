import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '../elements';
import { Typography } from '@material-ui/core';

export const TabPanel = ({ children, currentIndex, index }) => {
  return (
    <div role="tabpanel" hidden={currentIndex !== index}>
      {currentIndex === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  currentIndex: PropTypes.number,
  index: PropTypes.number,
};
