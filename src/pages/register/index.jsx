import React from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../../theme";
import RegisterForm from "../../form/RegisterForm/RegisterForm";
const Register = () => {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{ height: "100%", width: "100%" }}>
          <RegisterForm />
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default Register;
