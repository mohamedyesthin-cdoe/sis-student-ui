import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      // main: '#9c27b0',
      main:'#6457B8'
    },
    secondary: {
      main: '#105c8e',
      dark:'rgb(11, 64, 99)'
    },
    error: {
      main: '#BF2728',
    },
    success: {
      main: '#388e3c',
    },
    background: {
      default: '#f5f5f5',

    },
    text: {
      primary: '#333333',
      secondary: '#555555',
      disabled: '#999999',
    },
    custom: {
      accent: '#9CA3AF',
      highlight: 'rgba(0,0,0,0.04)'
    },
  },
  typography: {
    // fontFamily: `'Poppins', 'Inter', 'Lato', 'sans-serif'`,
      fontFamily: `'Inter', 'Poppins', 'Arial', sans-serif`,
  },
});

export default theme;
