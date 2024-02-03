import { experimental_extendTheme as extendTheme } from "@mui/material/styles";

export const breakpoints = {
  values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
};

export const lightTheme = {
  // palette for light mode
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
    error: {
      main: "#f44336",
    },
    text: {
      hint: "#a2a2a2",
    },
    background: {
      default: "#f3f6f9",
    },
  },
};

export const darkTheme = {
  // palette for dark mode
  palette: {
    primary: {
      main: "#8798ef",
      contrastText: "#ffffff",
    },
    secondary: {
      // main: "#f50057",
      // main: "#ff549d",
      // main: "#fb589e",
      main: "#ff3990",
    },
    error: {
      main: "#f44336",
    },
    text: {
      hint: "#a2a2a2",
    },
    background: {
      default: "#303030",
      paper: "#424242",
    },
  },
};

export const theme = extendTheme({
  colorSchemes: {
    light: { ...lightTheme },
    dark: { ...darkTheme },
  },
});

export default theme;
