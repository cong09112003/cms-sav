import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/login";
import Register from "../pages/register";
import publicRoutes from "./public-routes";
import adminRoutes from "./admin-routes";
const allRouter = createBrowserRouter([...publicRoutes, ...adminRoutes]);

export default allRouter;
