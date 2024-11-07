import React from "react";
import Login from "../pages/login";
import Register from "../pages/register";

const publicRoutes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
];
export default publicRoutes;
