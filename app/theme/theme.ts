import { createTheme } from '@mui/material/styles';

export const createCustomTheme = (direction: 'ltr' | 'rtl' = 'ltr') => createTheme({
  direction,
  typography: {
    fontFamily: direction === 'rtl' ? 'Lateef, sans-serif' : 'Noto Sans, sans-serif',
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#4057a7',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

export default createCustomTheme();