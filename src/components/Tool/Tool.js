import styled from 'styled-components';
import { Icon } from '@material-ui/core';

const StyledTool = styled.div`
  cursor: pointer;
`

export const Tool = ({ onClick, children }) => {
  return (
    <StyledTool onClick={onClick}>
      {children}
    </StyledTool>
  )
}