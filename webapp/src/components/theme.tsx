import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: "#6b3d94",
    },
    secondary: {
      main: "#e4a7c9",
    },
    error: {
      main: red.A400,
    },
    mode: "dark",
  },
});

export default theme;
