import React, { useState } from 'react';
import StopIcon from '@mui/icons-material/Stop';
import { Navigate, useNavigate } from 'react-router-dom';
import HoldConfirmationModal from "./HoldConfirmationModal";
import RestoreIcon from "@mui/icons-material/Restore";
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { BASE_URL } from "../constants/BaseUrl.jsx";
import ScheduleServiceModel from './ScheduleServiceModel.jsx';
import { CalendarMonth } from '@mui/icons-material';

const SolarProjectRow = ({project,onStatusChange}) => {
  const { token } = useAuth();
  const Navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const formatType = (type) => {
    if (!type) return "N/A";
    return type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ');
  };

  const handleOnClick = (id) => {
    if(id===undefined || id===null) {
      // console.warn("Invalid project ID:", id);
      return;
    }else {
      Navigate(`/projectdetails/${id}`);
    } 
  }

    const handleConfirm = async (remarks) => {
    const actionType = project.is_hold ? "release" : "hold";
    try {
      await axios.post(
        `${BASE_URL}api/projects/${project.id}/${actionType}`,
        { remarks },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (onStatusChange) {
        onStatusChange();
        if (actionType === "hold") {
          Navigate("/holdprojects");
        }
      }
    } catch (error) {
      console.error("Error updating project status:", error);
    } finally {
      setShowModal(false);
    }
  };

  // Get project number based on available fields
  const getProjectNumber = () => {
    // For external projects (transformed response)
    if (project.project_no) {
      return project.project_no;
    }
    // For internal projects (original structure)
    if (project.type === 'ongrid' && project.on_grid) {
      return project.on_grid.on_grid_project_id || "-";
    }
    if ((project.type === 'offgrid' || project.type === 'hybrid') && project.off_grid_hybrid) {
      return project.off_grid_hybrid.off_grid_hybrid_project_id || "-";
    }
    return "-";
  };

  // Get nearest town based on available fields
  const getNearestTown = () => {
    // For external projects
    if (project.nearest_project) {
      return project.nearest_project;
    }
    // For internal projects
    return project.neatest_town || "-";
  };

  // Get display name - project_name for both, company_name only for external if available
  const getDisplayName = () => {
    // Always show project_name as the primary name
    const primaryName = project.project_name || "Unknown Project";
    
    // For external projects, append company name in parentheses if available
    if (project.company_name) {
      return `${primaryName} (${project.company_name})`;
    }
    
    return primaryName;
  };

  const DueAmount = () => {
    // Placeholder logic for Due Amount
    // Replace with actual logic to fetch or calculate due amount
    return project.payment?.due_payment || "N/A";
  };

  const getNextServiceDateInfo = () => {
  const service = project.next_service_date; // Using your JSON key
  
  if (!service || !service.date) {
    return { label: "N/A", status: "none" };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(service.date);
  
  // Calculate the date 6 months from today
  const sixMonthsFromNow = new Date();
  sixMonthsFromNow.setMonth(today.getMonth() + 6);

  let status = "future"; // Default: Teal (More than 6 months away)

  if (dueDate < today) {
    status = "past"; // Red (Overdue)
  } else if (dueDate <= sixMonthsFromNow) {
    status = "upcoming"; // Yellow (Within 6 months)
  }

  const label = `${service.date} (${service.round_label})`;

  return { label, status };
};

return (
  <>
    <tr
      onClick={handleOnClick.bind(null, project.id)}
      className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
    >
      {/* Project ID */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-bold text-blue-700">
          #{getProjectNumber()}
        </span>
      </td>

      {/* Project Name */}
      <td className="px-6 py-4">
        <div
          className="max-w-xs text-base font-semibold text-gray-900 truncate"
          title={getDisplayName()}
        >
          {getDisplayName()}
        </div>
      </td>

      {/* Location */}
      <td className="px-6 py-4">
        <span className="text-sm text-gray-600">{getNearestTown()}</span>
      </td>

      {/* Due Amount */}
      <td className="px-6 py-4">
        <span
          className={`inline-flex px-3 text-sm text-gray-600 ${
            DueAmount() === "N/A"
              ? "bg-transparent"
              : DueAmount() > 0
              ? "bg-red-100 text-red-800 rounded-full py-1"
              : "bg-transparent"
          }`}
        >
          {DueAmount()}
        </span>
      </td>

      {/* Type */}
      <td className="px-6 py-4">
        <span className="inline-flex px-3 py-1 text-xs font-medium leading-5 text-teal-800 bg-teal-100 rounded-full">
          {formatType(project.type)}
        </span>
      </td>

      {/* next service date */}
<td className="px-2 py-4 whitespace-nowrap">
  {(() => {
    const { label, status } = getNextServiceDateInfo();
    
    // Define styles for each status
    const styles = {
      past: "text-red-800 bg-red-100 ",
      upcoming: "text-amber-800 bg-amber-100 ",
      future: "text-blue-800 bg-blue-100 ",
      none: "text-gray-500 bg-gray-100"
    };

    return (
      <span className={`inline-flex px-3 py-1 text-xs font-medium leading-5 rounded-full ${styles[status]}`}>
        {label}
      </span>
    );
  })()}
</td>

      {/* Action Button */}
<td className="px-6 py-4 text-center">
  <div className="flex items-center justify-center space-x-2">
{/* Existing Hold/Restore Button */}
    <div className="relative inline-block group/tooltip">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(true);
        }}
        className={`p-2 rounded-lg transition-colors ${
          project.is_hold
            ? "text-orange-500 hover:bg-orange-50"
            : "text-blue-500 hover:bg-blue-50"
        }`}
      >
        {project.is_hold ? <RestoreIcon /> : <StopIcon />}
      </button>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:flex flex-col items-center z-[50]">
        <span className="bg-gray-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
          {project.is_hold ? "Restore" : "Hold"}
        </span>
        <div className="w-2 h-2 -mt-1 rotate-45 bg-gray-800"></div>
      </div>
    </div>
    
    {/* NEW: Schedule Service Button (Only shows if NOT on hold) */}
    {!project.is_hold && (
      <div className="relative inline-block group/tooltip">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowScheduleModal(true);
          }}
          className="p-2 text-teal-600 transition-colors rounded-lg hover:bg-teal-50"
        >
          {/* Using a standard SVG Calendar Icon */}
          <CalendarMonth fontSize='small'/>
        </button>

        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:flex flex-col items-center z-[50]">
          <span className="bg-gray-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
            Schedule Service
          </span>
          <div className="w-2 h-2 -mt-1 rotate-45 bg-gray-800"></div>
        </div>
      </div>
    )}

  </div>
</td>
    </tr>

    <HoldConfirmationModal
      show={showModal}
      onClose={() => setShowModal(false)}
      onConfirm={handleConfirm}
      actionType={project.is_hold ? "release" : "hold"}
    />

    {/* Render the Modal */}
      <ScheduleServiceModel 
        show={showScheduleModal} 
        onClose={() => setShowScheduleModal(false)} 
        projectId={project.id}
      />
  </>
);
};

export default SolarProjectRow;