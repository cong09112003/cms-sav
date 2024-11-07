import React from "react";
import Dashboard from "../pages/dashboard";
import Team from "../pages/team";
import Contacts from "../pages/contacts";
import Invoices from "../pages/invoices";
import Form from "../pages/form";
import Bar from "../pages/bar";
import Geography from "../pages/geography";
import Calendar from "../pages/calendar";
import Pie from "../pages/pie";
import Line from "../pages/line";
import FAQ from "../pages/faq";
const adminRoutes = [
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/team",
    element: <Team />,
  },
  {
    path: "/contacts",
    element: <Contacts />,
  },
  {
    path: "/invoices",
    element: <Invoices />,
  },
  {
    path: "/form",
    element: <Form />,
  },
  {
    path: "/bar",
    element: <Bar />,
  },
  {
    path: "/pie",
    element: <Pie />,
  },
  {
    path: "/line",
    element: <Line />,
  },
  {
    path: "/faq",
    element: <FAQ />,
  },
  {
    path: "/calendar",
    element: <Calendar />,
  },
  {
    path: "/geography",
    element: <Geography />,
  },
];

export default adminRoutes;
