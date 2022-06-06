import { createTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

const theme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: blue[700],
    },
  },
});

export default theme;
