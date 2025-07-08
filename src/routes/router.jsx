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
import ScheduledServices from "../pages/scheduledServices";
import SearchServices from '../pages/SearchServices';
import CompletedServices from '../pages/CompletedServices';
import ServiceDetail from '../pages/ServiceDetails';
import DCDetails from '../components/DCDetails'; 
import ServiceDetails2 from '../pages/ServiceDetails2'; 


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
      { path: "scheduledServices", element: <ScheduledServices/> },
      { path: "searchservices", element: <SearchServices /> },
      { path: "/completedservices/:project_id",element: <CompletedServices />},
      { path: "/servicedetails/", element: <ServiceDetail /> },
      { path: "/dcDetails", element: <DCDetails /> },
      { path: "/servicedetails2/:service_id?", element: <ServiceDetails2 /> },
    {path:"*",element:<div>404 not found</div>}
    ],
  },
  {
    path:"/*",
    element:<div>404 not found</div>
  }
    
]);

export default router;