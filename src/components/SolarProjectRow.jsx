import React from 'react';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import { Navigate, useNavigate } from 'react-router-dom';

const SolarProjectRow = ({project}) => {
  const Navigate = useNavigate();
  const formatType = (type) => {
    if (!type) return "N/A";
    return type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ');
  };

  const handleOnClick = (id) => {
    Navigate(`/projectDetails/${id}`);
  }

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
    <div
      key={project.id}
      className="
        flex flex-col md:grid
        md:grid-cols-[1fr_4fr_2fr_2fr_auto]
        items-center gap-x-4 gap-y-2 
        w-[90%] md:w-full lg:w-[90%] xl:w-[80%]
        p-4 md:p-3 lg:p-4 
        bg-gray-200 border-2 border-gray-300 rounded-2xl shadow-md
        text-black text-lg font-medium cursor-pointer
        transition-colors duration-200 
      "
      onClick={() => handleOnClick(project.id)}
    >
      {/* Project ID */}
      <span className="mb-1 text-base font-bold text-gray-800 md:text-lg md:mb-0">
        #{getProjectNumber()}
      </span>

      {/* Project Name (with optional company name for external) */}
      <span 
        className="mb-1 text-base text-center text-gray-900 truncate md:text-lg md:mb-0 md:text-left"
        title={project.company_name ? `Company: ${project.company_name}` : ''}
      >
        {getDisplayName()}
      </span>

      {/* Neatest Town */}
      <span className="mb-1 text-base text-center text-gray-700 truncate md:text-lg md:mb-0 md:text-left">
        {getNearestTown()}
      </span>

      {/* Type */}
      <span className="mb-1 text-base text-center text-gray-800 md:text-lg md:mb-0 md:text-left">
        {formatType(project.type)}
      </span>

      {/* Priority Icon */}
      <div className="
        w-8 h-8 flex items-center justify-center
        bg-gray-300 rounded-lg text-gray-800
        hover:bg-gray-400 transition-colors duration-200
        mt-2 md:mt-0
      ">
        <PriorityHighOutlinedIcon className="w-5 h-5" />
      </div>
    </div>
  );
};

export default SolarProjectRow;