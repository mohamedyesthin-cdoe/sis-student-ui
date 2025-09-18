import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#a748a2ff', // <-- New primary color
    },
    secondary: {
      main: '#105c8e',
      dark: 'rgb(11, 64, 99)',
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
      highlight: 'rgba(0,0,0,0.04)',
    },
  },
  typography: {
    fontFamily: `'Inter', 'Poppins', 'Arial', sans-serif`,
  },
});

export default theme;
