import { InformationCircleIcon } from '@heroicons/react/16/solid'
import React, { useState } from 'react'
import SolarPanelDetailsModel from './SolarPanelDetailsModel';
import InverterDetailsModel from './InverterDetailsModel';
import WifiDetailsModel from './wifiDetailsModel';
import axios from 'axios';   
import { useParams } from 'react-router-dom'; 
import { useAuth } from '../contexts/AuthContext'; 

export default function OngridProjectDataCard({project,onGrid,offGrid,setProject,setOnGrid,setOffGrid}) {
  const { id: projectId } = useParams(); 
  const { token } = useAuth();
  const [showSolarPanelModal, setShowSolarPanelModal] = useState(false);
  const [showInverterModal, setShowInverterModal] = useState(false);
  const [showWifiModal, setShowWifiModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // helper function to format datetime
  const formatDateForMysql = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().slice(0, 19).replace("T", " ");
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/update-project`,
        {
          project_id: projectId,
          project: {
            ...project,
            project_installation_date: formatDateForMysql(project.project_installation_date),
            system_on: formatDateForMysql(project.system_on),
            service_rounds_in_agreement: project.service_rounds_in_agreement || 0,
            service_years_in_agreement: project.service_years_in_agreement || 0,
           remarks: project.remarks || "",
          },
          on_grid: {
            ...onGrid,
            remarks: onGrid.remarks || "",
          }
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        alert("Project updated successfully!");
        setProject(response.data.data.project);
        setOnGrid(response.data.data.on_grid || {});
        setOffGrid(response.data.data.off_grid_hybrid || {});
        setEditMode(false);
      }
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Failed to update project");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2.5">
        <h3 className="m-0 text-lg font-semibold">Project Details</h3>
        <button
         className={`px-3 py-1 rounded-md ${editMode ? 'bg-red-500 text-white hover:bg-red-700' : 'bg-teal-600 text-white hover:bg-teal-700 '}`}
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? "Cancel" : "Edit"}
        </button>
      </div>

      <div className="card-content">
        <label className="block text-sm mt-2.5 mb-1.5">Electricity bill name</label>
        <input
          disabled={!editMode}
          value={onGrid?.electricity_bill_name || ''}
          onChange={(e) => setOnGrid({ ...onGrid, electricity_bill_name: e.target.value })}
          className={`w-[90%] p-2 rounded-lg ${editMode ? 'bg-white border-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500'
                : 'bg-gray-200 border-gray-300'} border`}
        />

        <label className="block text-sm mt-2.5 mb-1.5">Site address</label>
        <input
          disabled={!editMode}
          value={project?.project_address || ''}
          onChange={(e) => setProject({ ...project, project_address: e.target.value })}
             className={`w-[90%] p-2 rounded-lg ${editMode ? 'bg-white border-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500'
                : 'bg-gray-200 border-gray-300'} border`}
        />

       <div className="flex flex-row flex-wrap">
          <div className="flex flex-col w-1/2">
            <label className="block text-sm mt-2.5 mb-1.5">Harmonic meter</label>
            <input
              disabled={!editMode}
              value={onGrid?.harmonic_meter || ''}
              onChange={(e) => setOnGrid({ ...onGrid, harmonic_meter: e.target.value })}
                 className={`w-[70%] p-2 rounded-lg ${editMode ? 'bg-white border-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500'
                : 'bg-gray-200 border-gray-300'} border mr-[4%]`}
            />
          </div>

          <div className="flex flex-col w-1/2 pr-2">
            <div className="flex flex-row justify-between">
              <div className="flex flex-col w-1/2">
                <label className="block text-sm mt-2.5 mb-1.5">Service Years</label>
                <input
                  type="number"
                  disabled={!editMode}
                  value={project?.service_years_in_agreement || 0}
                  onChange={(e) => setProject({ ...project, service_years_in_agreement: e.target.value })}
                className={`w-[50%] p-2 rounded-lg ${editMode ? 'bg-white border-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500'
                : 'bg-gray-200 border-gray-300'} border mr-[1%]`}
                />
              </div>
              <div className="flex flex-col w-1/2">
                <label className="block text-sm mt-2.5 mb-1.5">Service Rounds</label>
                <input
                  type="number"
                  disabled={!editMode}
                  value={project?.service_rounds_in_agreement || 0}
                  onChange={(e) => setProject({ ...project, service_rounds_in_agreement: e.target.value })}
                 className={`w-[50%] p-2 rounded-lg ${editMode ? 'bg-white border-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500'
                : 'bg-gray-200 border-gray-300'} border mr-[1%]`}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <div className="flex flex-col w-1/2">
            <label className="block text-sm mt-2.5 mb-1.5">Project installation on</label>
            <input
              type="date"
              disabled={!editMode}
              value={project?.project_installation_date ? project.project_installation_date.split(" ")[0] : ""}
              onChange={(e) => setProject({ ...project, project_installation_date: e.target.value })}
                              className={`w-[70%] p-2 rounded-lg ${editMode ? 'bg-white border-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500'
                : 'bg-gray-200 border-gray-300'} border mr-[4%]`}
            />
          </div>
          <div className="flex flex-col w-1/2">
          
            <label className="block text-sm mt-2.5 mb-1.5">System on</label>
            <input
              type="date"
              disabled={!editMode}
              value={project?.system_on ? project.system_on.split(" ")[0] : ""}
              onChange={(e) => setProject({ ...project, system_on: e.target.value })}
                              className={`w-[70%] p-2 rounded-lg ${editMode ? 'bg-white border-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500'
                : 'bg-gray-200 border-gray-300'} border mr-[4%]`}
            />
          </div>
        </div>

        {/* General Remarks (from projects table) */}
        <label className="block text-sm mt-2.5 mb-1.5">General Remarks</label>
        <textarea
          disabled={!editMode}
          value={project?.remarks || ''}
          onChange={(e) => setProject({ ...project, remarks: e.target.value })}
             className={`w-[90%] p-2 rounded-lg ${editMode ? 'bg-white border-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500'
                : 'bg-gray-200 border-gray-300'} border`}
          placeholder="General project remarks"
           rows="1" 
        />

        {/* System Remarks (from on_grids table) */}
        <label className="block text-sm mt-2.5 mb-1.5">System Remarks</label>
        <textarea
          disabled={!editMode}
          value={onGrid?.remarks || ''}
          onChange={(e) => setOnGrid({ ...onGrid, remarks: e.target.value })}
             className={`w-[90%] p-2 rounded-lg ${editMode ? 'bg-white border-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500'
                : 'bg-gray-200 border-gray-300'} border`}
          placeholder="System-specific remarks"
           rows="1" 
        />

        <div className="flex flex-row justify-between">
          <div className="flex flex-col w-1/2">
            <label className="block text-sm mt-2.5 mb-1.5">Longitude</label>
            <input
              disabled={!editMode}
              value={project?.longitude || ''}
              onChange={(e) => setProject({ ...project, longitude: e.target.value })}
                              className={`w-[70%] p-2 rounded-lg ${editMode ? 'bg-white border-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500'
                : 'bg-gray-200 border-gray-300'} border mr-[4%]`}
            />
          </div>
          <div className="flex flex-col w-1/2">
            <label className="block text-sm mt-2.5 mb-1.5">Latitude</label>
            <input
              disabled={!editMode}
              value={project?.lattitude || ''}
              onChange={(e) => setProject({ ...project, lattitude: e.target.value })}
                              className={`w-[70%] p-2 rounded-lg ${editMode ? 'bg-white border-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500'
                : 'bg-gray-200 border-gray-300'} border mr-[4%]`}
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2.5 flex-wrap">
          <button
            className="bg-[#00a68b] text-white border-none px-3.5 py-2 rounded-lg cursor-pointer hover:bg-[#008f76]"
            onClick={() => setShowSolarPanelModal(true)}
          >
            Solar Panel Details
          </button>
          <button
            className="bg-[#00a68b] text-white border-none px-3.5 py-2 rounded-lg cursor-pointer hover:bg-[#008f76]"
            onClick={() => setShowInverterModal(true)}
          >
            Invertor Details
          </button>
          <button
            className="bg-[#00a68b] text-white border-none px-3.5 py-2 rounded-lg cursor-pointer hover:bg-[#008f76]"
            onClick={() => setShowWifiModal(true)}
          >
            Wifi Details
          </button>
        </div>

        {editMode && (
          <div className="pt-4 flex justify-end">
          <button
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
            onClick={handleSave}
          >
            Save Changes
          </button>
          </div>
        )}
      </div>

      {showSolarPanelModal && (
        <SolarPanelDetailsModel 
          show={showSolarPanelModal} 
          onClose={()=>setShowSolarPanelModal(false)} 
          projectId={project.id} 
          panelCapacity={project.panel_capacity} 
          noOfPanels={project?.no_of_panels}
        />
      )}
      {showInverterModal && (
        <InverterDetailsModel 
          show={showInverterModal} 
          onClose={()=>setShowInverterModal(false)} 
          projectId={project.id}
        />
      )}
      {showWifiModal && (
        <WifiDetailsModel 
          username={onGrid.wifi_username} 
          password={onGrid.wifi_password} 
          show={showWifiModal} 
          onClose={()=>setShowWifiModal(false)}
        />
      )}
    </div>
  )  
}
