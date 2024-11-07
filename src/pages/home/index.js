import React from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../../theme";
import { MyProSidebarProvider } from "../global/sidebar/sidebarContext";
import Topbar from "../global/Topbar";
import { Form, Route, Routes } from "react-router-dom";
import Dashboard from "../dashboard";
import Team from "../team";
import Contacts from "../contacts";
import Invoices from "../invoices";
import { Bar } from "@nivo/bar";
import { Pie } from "@nivo/pie";
import { Line } from "@nivo/line";
import Calendar from "../calendar";
import Geography from "../geography";
import FAQ from "../faq";
const Home = () => {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MyProSidebarProvider>
          <div style={{ height: "100%", width: "100%" }}>
            <main>
              <Topbar />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/team" element={<Team />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/form" element={<Form />} />
                <Route path="/bar" element={<Bar />} />
                <Route path="/pie" element={<Pie />} />
                <Route path="/line" element={<Line />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/geography" element={<Geography />} />
              </Routes>
            </main>
          </div>
        </MyProSidebarProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default Home;
