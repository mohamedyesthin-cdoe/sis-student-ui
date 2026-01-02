import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: "#1B998B",
      light: "#36BFB1",
      dark: "#14786F",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#105C8E",
      light: "#3A7FB0",
      dark: "#08446B",
      contrastText: "#FFFFFF",
    },
    error: { main: '#BF2728' },
    success: { main: '#388e3c' },
    background: { default: '#f5f5f5' },
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
    // fontFamily: `'Roboto', 'Poppins', 'Arial', sans-serif`,
    fontFamily: `'Roboto', sans-serif`,
  },
  components: {
    MuiDateCalendar: {
      styleOverrides: {
        root: {
          width: '100%',     // full width of the parent
          height: 300,       // your fixed height
          '& .MuiCalendarPicker-root': { padding: 0, margin: 0 },
          '& .MuiDayCalendar-root': { margin: 0 },
          '& .MuiDayCalendar-header': { width: '100%', padding: '0 8px' }, // 👈 make header full width
          '& .MuiCalendarPicker-header': { minHeight: 30, marginBottom: 2 },
          '& .MuiDayCalendar-weekContainer': { gap: 11, marginBottom: 0 },
          '& .MuiPickersDay-root': { minHeight: 24, minWidth: 24, fontSize: '0.7rem', margin: 0 },
          '& .MuiDayCalendar-weekDayLabel': { minHeight: 20, fontSize: '0.7rem', lineHeight: 1, marginBottom: 0 },
          '& .MuiPickersSlideTransition-root': { paddingBottom: 0 },
          '& .MuiCalendarPicker-root > div:last-of-type': { marginBottom: 0 },
          '& .MuiPickersCalendarHeader-root': {
            paddingLeft: 18, // 👈 apply left padding
            paddingRight: 0, // optional: remove right padding if needed
            marginTop: 8
          },
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,   // 1470–1854
      // xxl: 1920,  // 2560 screens
    },
  },


});

export default theme;
