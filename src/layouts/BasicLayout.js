import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box } from '../components/elements';

const StyledBasicLayout = styled(Box)`
  display: grid;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  grid-template-rows: 60px minmax(0, 4fr);
  grid-template-areas: 'top' 'main';
`;

const BasicLayout = ({ children, top }) => {
  return (
    <StyledBasicLayout>
      <Box display="flex" justifyContent="center" gridArea="top">
        {top}
      </Box>
      <Box gridArea="main">{children}</Box>
    </StyledBasicLayout>
  );
};

BasicLayout.propTypes = {
  children: PropTypes.node.isRequired,
  top: PropTypes.node.isRequired,
};

export default BasicLayout;
