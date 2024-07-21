// src/theme.ts
import { createTheme } from "@mui/material/styles";

// Define your custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Primary color
    },
    secondary: {
      main: "#dc004e", // Secondary color
    },
    background: {
      default: "#f5f5f5", // Default background color
    },
    text: {
      primary: "#000000", // Primary text color
    },
  },
  typography: {
    fontFamily: "Outfit", // Custom font
    h1: {
      fontSize: "2rem", // Custom font size for h1
    },
    body1: {
      fontSize: "1rem", // Custom font size for body1
    },
  },
});

export default theme;
