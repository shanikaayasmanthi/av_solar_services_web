import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

import DatasetIcon from "@mui/icons-material/Dataset";
import GroupsIcon from "@mui/icons-material/Groups";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import FaxIcon from "@mui/icons-material/Fax";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarItems = [
  {
    id: "dashboard",
    icon: DatasetIcon,
    onClickPath: "/dashboard",
    activeRoutes: ["/dashboard"],
  },
  {
    id: "projects",
    icon: FaxIcon, // Using FaxIcon for projects as per your original code
    onClickPath: "/solarprojects", // Corrected based on your handleClick1
    activeRoutes: [
      "/solarproject",
      "/projectDetails",
      "/CustomerDetails",
      "/openProject",
    ],
  },
  {
    id: "services",
    icon: MiscellaneousServicesIcon,
    onClickPath: "/scheduledservices",
    activeRoutes: [
      "/scheduledservices",
      "/Searchservices",
      "/completedservices",
      "/servicedetails",
      "/serviceDetails2",
    ],
  },
  {
    id: "users",
    icon: GroupsIcon,
    onClickPath: "/users",
    activeRoutes: ["/users", "/addusers"],
  },
];

  return (
    <>
      <div className="fixed top-[100px] left-2 w-[60px] h-[80%] bg-teal-600 p-4 rounded-xl shadow-lg z-[999] flex flex-col items-center transition-transform duration-300 ease-in-out
                    md:w-[90px] md:p-2 md:top-[100px] md:left-2 my-4
                    sm:w-10 sm:p-2 sm:transform-none sm:pointer-events-auto">
        <ul className="flex flex-col items-center p-0 m-0">
          {sidebarItems.map((item) => {
            const isActive = item.activeRoutes.some((route) =>
              location.pathname.startsWith(route)
            );

            const handleClick = () => {
              navigate(item.onClickPath);
            };

            const IconComponent = item.icon; // Get the Material UI Icon component

            return (
              <li key={item.id} className="my-3 md:my-7">
                <div
                  className={`p-1.5 rounded-lg transition-colors duration-300 ${
                    isActive ? "bg-white bg-opacity-40" : ""
                  }`}
                >
                  <IconComponent
                    // ONLY use w-* and h-* for sizing SVGs
                    className={`text-white cursor-pointer transition-transform duration-200
                                w-[45px] h-[45px] // Default size (e.g., for smaller screens)
                                md:w-[60px] md:h-[60px] // Larger size for medium screens and up
                                hover:scale-110`}
                    onClick={handleClick}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;