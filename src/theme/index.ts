import { createTheme } from '@mui/material';
import { grey } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: grey,
  },
  typography: {
    fontFamily: 'Fira Sans',
    fontWeightRegular: '300',
    h1: {
      fontFamily: 'Space Mono',
    },
    h2: {
      fontFamily: 'Space Mono',
    },
    h3: {
      fontFamily: 'Space Mono',
    },
    h4: {
      fontFamily: 'Space Mono',
    },
    h5: {
      fontFamily: 'Space Mono',
    },
    h6: {
      fontFamily: 'Space Mono',
    },
    button: {
      fontFamily: 'Space Mono',
      fontWeight: '700',
    },
  },
  shape: {
    borderRadius: 0,
  },
});

export default theme;
