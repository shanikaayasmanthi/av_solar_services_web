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
import ScheduledServices from "../pages/scheduledServices";
import SearchServices from '../pages/SearchServices';
import CompletedServices from '../pages/CompletedServices';
import ServiceDetail from '../pages/ServiceDetails';
import DCDetails from '../components/DCDetails'; 
import ServiceDetails2 from '../pages/ServiceDetails2'; 
import Users from "../pages/Users";
import AddUser from "../pages/AddUsers";
import PendingInstallationProjects from "../pages/PendingInstallationProjects";
import PendingInstallationProjectsDetails from "../pages/PendingInstallationProjectsDetails";
import ExternalProjectOpen from "../pages/ExternalProjectOpen";
import DueService from "../pages/DueService";
import HoldProjects from "../pages/HoldProjects";
import AccountsPage from "../pages/AccountsPage";
import AccountsLayout from "../layouts/AccountsLayout.jsx";
import Profile from "../pages/Profile.jsx";
import ForgotPasswordPage from "../pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "../pages/ResetPasswordPage.jsx";
import AddInvoice from "../pages/AddInvoice.jsx";
import { Invoices } from "../pages/Invoices.jsx";




const router = createBrowserRouter([
    {
        path: "/",
        element: <GuestLayout/>,
        children:[
            {
                path: "/",
                element: <Login/>,
            },
                  {path: "forgot-password", element: <ForgotPasswordPage />},
            {path: "reset-password", element: <ResetPasswordPage />},
        ],
    },

    // Protected Routes for admin and super admin
  {
    path: "/",
    element: (
      <ProtectedRoute allowedRoles={["admin", "super admin"]}>
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
      { path: "/servicedetails/:service_id/:project_id", element: <ServiceDetail /> },
      { path: "/dcDetails", element: <DCDetails /> },
      { path: "/serviceworkdetails/:service_id/:project_id", element: <ServiceDetails2 /> },
      {path: "CustomerDetails", element: <NewProjectCustomerDetails/>},
      {path: "openProject", element: <NewProjectOpen/>},
      {path: "users", element: <Users />},
      {path: "add-user", element: <AddUser />},
      {path: "pendingInstallationProjects", element: <PendingInstallationProjects />},
      {path: "pendingInstallationProjectsDetails/:project_id", element: <PendingInstallationProjectsDetails />},
      {path: "openExternalProject", element: <ExternalProjectOpen />},
      {path: "dueservice", element: <DueService />},
      {path: "holdprojects", element: <HoldProjects />},
      {path: "profile", element: <Profile />},

    {path:"*",element:<div>404 not found</div>}
    ],
  },

  // Protected Routes for accounts
  {
    path: "/",
    element: (
      <ProtectedRoute allowedRoles={["accounts","super admin"]}>
        <AuthLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/accounts", element: <AccountsPage /> },
      { path: "/addinvoice", element: <AddInvoice /> },
      {path:"/invoices", element:<Invoices/>}
    ],
  },


  {
    path:"/*",
    element:<div>404 not found</div>
  }
    
]);

export default router;