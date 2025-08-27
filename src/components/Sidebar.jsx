// import React from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// import DatasetIcon from "@mui/icons-material/Dataset";
// import GroupsIcon from "@mui/icons-material/Groups";
// import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
// import FaxIcon from "@mui/icons-material/Fax";
// import { Upcoming } from "@mui/icons-material";

// const Sidebar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const sidebarItems = [
//   {
//     id: "dashboard",
//     icon: DatasetIcon,
//     onClickPath: "/dashboard",
//     activeRoutes: ["/dashboard"],
//   },
//   {
//     id: "projects",
//     icon: FaxIcon, // Using FaxIcon for projects as per your original code
//     onClickPath: "/solarprojects", // Corrected based on your handleClick1
//     activeRoutes: [
//       "/solarproject",
//       "/projectDetails",
//       "/CustomerDetails",
//       "/openProject",
//     ],
//   },
//   {
//     id: "services",
//     icon: MiscellaneousServicesIcon,
//     onClickPath: "/scheduledServices",
//     activeRoutes: [
//       "/scheduledServices",
//       "/Searchservices",
//       "/completedservices",
//       "/servicedetails",
//       "/serviceDetails2",
//     ],
//   },

//   {
//     id:"pending",
//     icon: Upcoming,
//     onClickPath: "/pendingInstallationProjects",
//     activeRoutes: ["/pendingInstallationProjects"],
//   },
//     {
//     id: "users",
//     icon: GroupsIcon,
//     onClickPath: "/users",
//     activeRoutes: ["/users", "/addusers"],
//   },
// ];

//   return (
//     <>
//       <div className="fixed top-[100px] left-2 w-[55px] h-[80%] bg-teal-600 p-4 rounded-xl shadow-lg z-[999] flex flex-col items-center transition-transform duration-300 ease-in-out
//                     md:w-[90px] md:p-2 md:top-[80px] md:left-2 my-4
//                     sm:w-10 sm:p-2 sm:transform-none sm:pointer-events-auto">
//         <ul className="flex flex-col items-center p-0 m-0">
//           {sidebarItems.map((item) => {
//             const isActive = item.activeRoutes.some((route) =>
//               location.pathname.startsWith(route)
//             );

//             const handleClick = () => {
//               navigate(item.onClickPath);
//             };

//             const IconComponent = item.icon; // Get the Material UI Icon component

//             return (
//               <li key={item.id} className="my-3 md:my-7">
//                 <div
//                   className={`p-1.5 rounded-lg transition-colors duration-300 ${
//                     isActive ? "bg-white bg-opacity-40" : ""
//                   }`}
//                 >
//                   <IconComponent
//                     // ONLY use w-* and h-* for sizing SVGs
//                     className={`text-white cursor-pointer transition-transform duration-200
//                                 w-[45px] h-[45px] // Default size (e.g., for smaller screens)
//                                 md:w-[60px] md:h-[60px] // Larger size for medium screens and up
//                                 hover:scale-110`}
//                     onClick={handleClick}
//                   />
//                 </div>
//               </li>
//             );
//           })}
//         </ul>
//       </div>
//     </>
//   );
// };

// export default Sidebar;
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DatasetIcon from "@mui/icons-material/Dataset";
import GroupsIcon from "@mui/icons-material/Groups";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import FaxIcon from "@mui/icons-material/Fax";
import { Upcoming } from "@mui/icons-material";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarItems = [
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
      label: "Pending"
    },
    {
      id: "users",
      icon: GroupsIcon,
      onClickPath: "/users",
      activeRoutes: ["/users", "/addusers"],
      label: "Users"
    },
  ];

  return (
    <>
      <div className="fixed top-[100px] left-2 w-[70px] h-[80%] bg-gradient-to-b from-teal-600 to-teal-700 p-4 rounded-2xl shadow-xl z-[999] flex flex-col items-center transition-all duration-300 ease-in-out
                    md:w-[90px] md:p-3 md:top-[80px] md:left-3 my-4
                    sm:w-[65px] sm:p-2 sm:transform-none sm:pointer-events-auto
                    lg:w-[95px] lg:p-4
                    xl:w-[100px] xl:p-4
                    hover:shadow-2xl hover:from-teal-700 hover:to-teal-800">
        <ul className="flex flex-col items-center p-0 m-0 w-full">
          {sidebarItems.map((item) => {
            const isActive = item.activeRoutes.some((route) =>
              location.pathname.startsWith(route)
            );

            const handleClick = () => {
              navigate(item.onClickPath);
            };

            const IconComponent = item.icon;

            return (
              <li key={item.id} className="my-4 md:my-5 w-full flex justify-center">
                <div className="relative group w-full flex justify-center">
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
                    {/* Tooltip for larger screens */}
                    {/* <span className="absolute left-full ml-3 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50 hidden md:block">
                      {item.label}
                    </span> */}
                    {/* Label for active item on mobile */}
                    {/* {isActive && (
                      <span className="text-white text-[10px] mt-1 font-medium md:hidden">
                        {item.label}
                      </span> */}
                    {/* )} */}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        
        {/* Decorative elements */}
        {/* <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-teal-400 bg-opacity-40 rounded-full"></div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-teal-400 bg-opacity-40 rounded-full"></div> */}
      </div>
    </>
  );
};

export default Sidebar;