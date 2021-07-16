import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledTool = styled.div`
  cursor: pointer;
`;

export const Tool = ({ onClick, children }) => {
  return <StyledTool onClick={onClick}>{children}</StyledTool>;
};

Tool.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};
