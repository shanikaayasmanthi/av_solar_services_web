import { createBrowserRouter } from "react-router-dom";
import GuestLayout from "../layouts/GuestLayout";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/Dashboard";
// import SolarProject from "../pages/solarProject";
import ProjectDetails from "../pages/ProjectDetails";
import React from 'react';
import SolarProjects from "../pages/SolarProjects";
import NewProjectCustomerDetails from "../pages/NewProjectCustomerDetails";
import NewProjectOpen from "../pages/NewProjectOpen";

const router = createBrowserRouter([
    {
        path: "/",
        element: <GuestLayout/>,
        children:[
            {
                path: "/",
                element: <Login/>,
            }
        ],
    },

    // Protected Routes for admin and super admin
  {
    path: "/",
    element: (
      <ProtectedRoute allowedRoles={["admin", "Super Admin"]}>
        <AuthLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <Dashboard/> },
      { path: "solarProjects", element:<SolarProjects/> },
      { path: "projectDetails/:id", element: <ProjectDetails/> },
      {path: "CustomerDetails", element: <NewProjectCustomerDetails/>},
      {path: "openProject", element: <NewProjectOpen/>},
    {path:"*",element:<div>404 not found</div>}
    ],
  },
  {
    path:"/*",
    element:<div>404 not found</div>
  }
    
]);

export default router;