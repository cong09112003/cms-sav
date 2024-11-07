import React from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../../theme";
import LoginForm from "../../form/LoginForm/LoginForm";
const Login = () => {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{ height: "100%", width: "100%" }}>
          <LoginForm />
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default Login;
