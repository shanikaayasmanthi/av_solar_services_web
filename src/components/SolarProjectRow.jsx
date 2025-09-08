import React from 'react';
import StopIcon from '@mui/icons-material/Stop';
import { Navigate, useNavigate } from 'react-router-dom';
import HoldConfirmationModal from "./HoldConfirmationModal";
import RestoreIcon from "@mui/icons-material/Restore";
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const SolarProjectRow = ({project,onStatusChange}) => {
  const { token } = useAuth();
  const Navigate = useNavigate();
  const [showModal, setShowModal] = React.useState(false);
  const formatType = (type) => {
    if (!type) return "N/A";
    return type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ');
  };

  const handleOnClick = (id) => {
    Navigate(`/projectDetails/${id}`);
  }

    const handleConfirm = async (remarks) => {
    const actionType = project.is_hold ? "release" : "hold";
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/projects/${project.id}/${actionType}`,
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

return (
  <>
    <div
      key={project.id}
      className="
        flex flex-col md:grid
        md:grid-cols-[1fr_4fr_2fr_2fr_auto]
        items-center gap-x-6 gap-y-3
        w-[90%] md:w-full lg:w-[90%] xl:w-[80%]
        p-5 md:p-4 lg:p-5
        bg-gradient-to-r from-gray-50 via-white to-gray-50
        border border-gray-200 rounded-2xl
        shadow-md hover:shadow-xl
        text-black text-lg font-medium cursor-pointer
        transition-all duration-300 ease-in-out
        transform hover:-translate-y-1
      "
      onClick={() => handleOnClick(project.id)}
    >
      {/* Project ID */}
      <span className="mb-1 text-sm font-semibold text-blue-700 md:text-base md:mb-0">
        #{getProjectNumber()}
      </span>

      {/* Project Name */}
      <span 
        className="mb-1 text-base font-semibold text-center text-gray-900 truncate md:text-lg md:mb-0 md:text-left"
        title={project.company_name ? `Company: ${project.company_name}` : ''}
      >
        {getDisplayName()}
      </span>

      {/* Nearest Town */}
      <span className="mb-1 text-sm text-center text-gray-600 truncate md:text-base md:mb-0 md:text-left">
        {getNearestTown()}
      </span>

      {/* Type */}
      <span className="mb-1 text-sm font-medium text-center text-gray-800 md:text-base md:mb-0 md:text-left">
        {formatType(project.type)}
      </span>

      <div
        className="w-9 h-9 flex items-center justify-center bg-blue-100 rounded-xl text-blue-600 hover:bg-blue-200"
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(true);
        }}
      >
        {project.is_hold ? <RestoreIcon /> : <StopIcon />}
      </div>
    </div>
    <HoldConfirmationModal
      show={showModal}
      onClose={() => setShowModal(false)}
      onConfirm={handleConfirm}
      actionType={project.is_hold ? "release" : "hold"}
    />
  </>
);
};

export default SolarProjectRow;