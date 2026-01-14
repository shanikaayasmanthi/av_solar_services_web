
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DatasetIcon from "@mui/icons-material/Dataset";
import GroupsIcon from "@mui/icons-material/Groups";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import FaxIcon from "@mui/icons-material/Fax";
import { Upcoming } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext.jsx";
import PaymentIcon from "@mui/icons-material/Payment";
import InvoiceIcon from '@mui/icons-material/ReceiptLong';

const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const layout = user.user_type;
  
  
  let sidebarItems = [];

  if (layout === "accounts") {
    // Accounts layout (accounts + super admin inside accounts)
    sidebarItems = [
      {
        id: "payments",
        icon: PaymentIcon,
        onClickPath: "/accounts",
        activeRoutes: ["/accounts"],
        label: "Payments"
      },
      {
        id:"invoices",
        icon: InvoiceIcon,
        onClickPath: "/invoices",
        activeRoutes: ["/invoices", "/invoiceDetails"],
        label: "Invoices"
      }
    ];
  } else if (layout === "super admin") {
    // Admin layout (admin + super admin inside admin)
    sidebarItems = [
      {
        id: "dashboard",
        icon: DatasetIcon,
        onClickPath: "/dashboard",
        activeRoutes: ["/dashboard"],
        label: "Dashboard"
      },
      {
        id: "projects",
        icon: FaxIcon,
        onClickPath: "/solarprojects",
        activeRoutes: [
          "/solarproject",
          "/projectDetails",
          "/CustomerDetails",
          "/openProject",
        ],
        label: "Projects"
      },
      {
        id: "services",
        icon: MiscellaneousServicesIcon,
        onClickPath: "/scheduledServices",
        activeRoutes: [
          "/scheduledServices",
          "/Searchservices",
          "/completedservices",
          "/servicedetails",
          "/serviceDetails2",
        ],
        label: "Services"
      },
      {
        id: "pending",
        icon: Upcoming,
        onClickPath: "/pendingInstallationProjects",
        activeRoutes: ["/pendingInstallationProjects"],
        label: "Pending Installations"
      },
      {
        id: "users",
        icon: GroupsIcon,
        onClickPath: "/users",
        activeRoutes: ["/users", "/addusers"],
        label: "Users"
      },
      {
        id: "payments",
        icon: PaymentIcon,
        onClickPath: "/accounts",
        activeRoutes: ["/accounts"],
        label: "Payments"
      },
      {
        id:"invoices",
        icon: InvoiceIcon,
        onClickPath: "/invoices",
        activeRoutes: ["/invoices","/addinvoice"],
        label: "Invoices"
      }
    ];
  }else{
    sidebarItems = [
      {
        id: "dashboard",
        icon: DatasetIcon,
        onClickPath: "/dashboard",
        activeRoutes: ["/dashboard"],
        label: "Dashboard"
      },
      {
        id: "projects",
        icon: FaxIcon,
        onClickPath: "/solarprojects",
        activeRoutes: [
          "/solarproject",
          "/projectDetails",
          "/CustomerDetails",
          "/openProject",
        ],
        label: "Projects"
      },
      {
        id: "services",
        icon: MiscellaneousServicesIcon,
        onClickPath: "/scheduledServices",
        activeRoutes: [
          "/scheduledServices",
          "/Searchservices",
          "/completedservices",
          "/servicedetails",
          "/serviceDetails2",
        ],
        label: "Services"
      },
      {
        id: "pending",
        icon: Upcoming,
        onClickPath: "/pendingInstallationProjects",
        activeRoutes: ["/pendingInstallationProjects"],
        label: "Pending Installations"
      },
      {
        id: "users",
        icon: GroupsIcon,
        onClickPath: "/users",
        activeRoutes: ["/users", "/addusers"],
        label: "Users"
      },
    ];
  }

  return (
    <>
      <div className="fixed top-[100px] left-2 w-[70px] h-fit bg-gradient-to-b from-teal-600 to-teal-700 p-4 rounded-2xl shadow-xl z-[999] flex flex-col items-center transition-all duration-300 ease-in-out
                    md:w-[90px] md:p-3 md:top-[80px] md:left-3 my-4
                    sm:w-[65px] sm:p-2 sm:transform-none sm:pointer-events-auto
                    lg:w-[95px] lg:p-4
                    xl:w-[100px] xl:p-4
                    hover:shadow-2xl hover:from-teal-700 hover:to-teal-800">
        <ul className="flex flex-col items-center w-full p-0 m-0">
          {sidebarItems.map((item) => {
            const isActive = item.activeRoutes.some((route) =>
              location.pathname.startsWith(route)
            );

            const handleClick = () => {
              navigate(item.onClickPath);
            };

            const IconComponent = item.icon;

            return (
              <li key={item.id} className="flex justify-center w-full my-4 md:my-5">
                <div className="relative flex justify-center w-full group">
                  <div
                    className={`p-2.5 rounded-xl transition-all duration-300 flex flex-col items-center ${
                      isActive 
                        ? "bg-white bg-opacity-20 shadow-inner" 
                        : "hover:bg-teal-500 hover:bg-opacity-30"
                    } group-hover:bg-teal-500 group-hover:bg-opacity-30`}
                  >
                    <IconComponent
                      className={`cursor-pointer transition-all duration-200
                                  w-8 h-8
                                  md:w-9 md:h-9
                                  lg:w-10 lg:h-10
                                  ${isActive ? "text-white scale-110" : "text-teal-100"}
                                  group-hover:text-white group-hover:scale-110`}
                      onClick={handleClick}
                    />
                    {/* TOOLTIP LABEL */}
                <span className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg 
                                 opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0
                                 transition-all duration-300 whitespace-nowrap z-[1000] pointer-events-none shadow-lg">
                  {item.label}
                  {/* Optional: Small triangle arrow for the tooltip */}
                  <div className="absolute left-0 w-2 h-2 rotate-45 -translate-x-1 -translate-y-1/2 bg-gray-900 top-1/2"></div>
                </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        
        {/* Decorative elements */}
        {/* <div className="absolute w-8 h-1 transform -translate-x-1/2 bg-teal-400 rounded-full top-4 left-1/2 bg-opacity-40"></div>
        <div className="absolute w-8 h-1 transform -translate-x-1/2 bg-teal-400 rounded-full bottom-4 left-1/2 bg-opacity-40"></div> */}
      </div>
    </>
  );
};

export default Sidebar;