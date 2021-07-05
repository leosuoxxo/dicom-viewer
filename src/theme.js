import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: blue[700],
    },
  },
});

export default theme;
