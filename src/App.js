import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { MyProSidebarProvider } from "./pages/global/sidebar/sidebarContext";
import { useEffect, useState } from "react";
import axios from "axios";

import Topbar from "./pages/global/Topbar";

import Dashboard from "./pages/dashboard";
import Invoices from "./pages/invoices";
import Contacts from "./pages/contacts";
import Form from "./pages/form";
import Calendar from "./pages/calendar";
import Bar from "./pages/bar";
import Line from "./pages/line";
import Pie from "./pages/pie";
import FAQ from "./pages/faq";
import Geography from "./pages/geography";
import LoginForm from "./form/LoginForm/LoginForm";
import RegisterForm from "./form/RegisterForm/RegisterForm";
import Post from "./pages/post";

// Hàm kiểm tra xác thực
const checkAuth = async () => {
  const token = localStorage.getItem("sav-token");
  if (token) {
    try {
      const response = await axios.get(
        "https://be-android-project.onrender.com/api/auth/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Token validation failed:", error);
      localStorage.removeItem("sav-token");
      return false;
    }
  } else {
    return false;
  }
};

// PrivateRoute component để kiểm tra xác thực
const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const authenticate = async () => {
      const authStatus = await checkAuth();
      setIsAuthenticated(authStatus);
    };
    authenticate();
  }, []);

  if (isAuthenticated === null) {
    // Đang chờ xác thực
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  const [theme, colorMode] = useMode();

  return (
    <div>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            {/* Định tuyến cho Login và Register */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />

            {/* Định tuyến chính với kiểm tra xác thực */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <MyProSidebarProvider>
                    <div style={{ height: "100%", width: "100%" }}>
                      <Topbar />
                      <Outlet />
                    </div>
                  </MyProSidebarProvider>
                </PrivateRoute>
              }
            >
              {/* Các định tuyến con của MyProSidebarProvider */}
              <Route path="/" element={<Dashboard />} />
              <Route path="home" element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="form" element={<Form />} />
              <Route path="bar" element={<Bar />} />
              <Route path="pie" element={<Pie />} />
              <Route path="line" element={<Line />} />
              <Route path="post" element={<Post />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="geography" element={<Geography />} />
              <Route path="*" element={<Navigate to="/home" />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </div>
  );
};

export default App;
