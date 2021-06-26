import styled from 'styled-components';
import Box from '../components/Box';

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
      <Box 
        display="flex" 
        justifyContent="center" 
        gridArea="top"
      >
        {top}
      </Box>
      <Box gridArea="main">{children}</Box>
    </StyledBasicLayout>
  );
};

export default BasicLayout;