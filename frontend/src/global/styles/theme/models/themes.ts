import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface PaletteColor {
    lighter?: string;
    darker?: string;
    background?: string;
    topNavContent?: string;
  }

  interface SimplePaletteColorOptions {
    lighter?: string;
    darker?: string;
    background?: string;
    topNavContent?: string;
  }

  interface BreakpointOverrides {
    x2: true;
    xxl: true;
  }
}

export const defaultTheme = createTheme({
  typography: {
    fontFamily: 'Assistant',
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
      x2: 1593,
      xxl: 1913,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
  },
  palette: {
    mode: 'dark',
    background: { paper: '#24272f' },
    primary: {
      lighter: '#228ff3',
      light: '#5ed3ed',
      main: '#20A8C8',
      dark: '#24272f',
      darker: '#212935',
    },
    secondary: {
      lighter: '#cca7d9',
      light: '#ce58ab',
      main: '#C82098',
      dark: '#A020C8',
      darker: '#781fc6',
    },
    error: {
      lighter: '#fe7171',
      light: '#ff5555',
      main: '#ff3030d8',
      dark: '#b81212',
      darker: '#8f2828',
    },
    warning: {
      lighter: '#fedc82',
      light: '#f4ff5dee',
      main: '#ff9e3c',
      dark: '#ff672d',
      darker: '#e65100',
    },
    info: {
      lighter: '#ddd',
      light: '#959599',
      main: '#35363d',
      dark: '#2e2f35',
      darker: '#121212',
      background: '#24272f',
      topNavContent: '#3b3c3e',
    },
    success: {
      lighter: '#64c495',
      light: '#3cb276',
      main: '#54C0B8',
      dark: '#2db5ab',
      darker: '#27998f',
    },
  },
});
