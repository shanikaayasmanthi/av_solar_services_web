import { InformationCircleIcon } from '@heroicons/react/16/solid'
import React, { useState } from 'react'
import SolarPanelDetailsModel from './SolarPanelDetailsModel';
import InverterDetailsModel from './InverterDetailsModel';
import BatteryDetailsModel from './BatteryDetailsModel';
import WifiDetailsModel from './wifiDetailsModel';
import axios from 'axios';   
import { useParams } from 'react-router-dom'; 
import { useAuth } from '../contexts/AuthContext'; 
import LocalPrintshopSharpIcon from '@mui/icons-material/LocalPrintshopSharp';
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import CloseIcon from '@mui/icons-material/Close';

export default function OffgridProjectDataCard({project, onGrid, offGrid, setProject, setOffGrid, setOnGrid}) {
  const { id: projectId } = useParams(); 
  const { token } = useAuth();
  const [showSolarPanelModal, setShowSolarPanelModal] = useState(false);
  const [showInverterModal, setShowInverterModal] = useState(false);
  const [showWifiModal, setShowWifiModal] = useState(false);
  const [showBatteryModal, setShowBatteryModal] = useState(false);
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
          off_grid_hybrid: {
            ...offGrid,
            remarks: offGrid.remarks || "",
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

  const handlePrint = () => {
  const printContent = document.getElementById("printable-project").outerHTML;
  const printWindow = window.open("", "_blank", "width=900,height=700");

  printWindow.document.write(`
    <html>
      <head>
        <title>Project Report - ${project?.id || ""}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1, h2, h3 { margin-bottom: 10px; }
          label { font-weight: bold; display: block; margin-top: 10px; }
          p, span { margin: 4px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background: #f4f4f4; }
          .section { margin-top: 20px; }
        </style>
      </head>
      <body>
        <h1>Project Report</h1>
        <h2>Project No: ${offGrid?.off_grid_hybrid_project_id || ""}</h2>

        ${printContent}

        <div class="section">
          <h2>Inverter Details</h2>
          <div id="inverter-details"></div>
        </div>

        <div class="section">
          <h2>Solar Panel Details</h2>
          <div id="solar-details"></div>
        </div>

        <div class="section">
          <h2>Wifi Details</h2>
          <div id="wifi-details"></div>
        </div>

        <div class="section">
          <h2>Battery Details</h2>
          <div id="battery-details"></div>
        </div>


        <footer style="margin-top:40px; font-size:12px; text-align:center;">
          Generated on ${new Date().toLocaleString()}
        </footer>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();

    fetchAndInsertDetails(printWindow, projectId, { 
    username: offGrid?.wifi_username, 
    password: offGrid?.wifi_passowrd 
  });

  // fetch and inject extra details dynamically
  // fetchAndInsertDetails(printWindow, projectId);
};

const fetchAndInsertDetails = async (printWindow, projectId, wifiDetails) => {
  
  try {
    // Inverter details
    const inverterRes = await axios.get("http://127.0.0.1:8000/api/get-inverters", {
      headers: { Authorization: `Bearer ${token}` },
      params: { project_id: projectId }
    });
    const inverters = inverterRes.data.data.inverters || [];

    const inverterTable = inverters.length > 0 ? `
      <table>
        <thead>
          <tr>
            <th>Brand</th>
            <th>Model No</th>
            <th>Check Code</th>
            <th>Serial No</th>
            <th>Capacity</th>
          </tr>
        </thead>
        <tbody>
          ${inverters.map(inv => `
            <tr>
              <td>${inv.brand}</td>
              <td>${inv.invertor_model_no}</td>
              <td>${inv.invertor_check_code}</td>
              <td>${inv.invertor_serial_no}</td>
              <td>${inv.invertor_capacity}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    ` : "<p>No inverter data available.</p>";

    printWindow.document.getElementById("inverter-details").innerHTML = inverterTable;



    // Solar Panel details
const solarRes = await axios.get("http://127.0.0.1:8000/api/get-solar-panel", {
  headers: { Authorization: `Bearer ${token}` },
  params: { project_id: projectId }
});
const panels = solarRes.data.data.solar_panels || [];

const solarTable = panels.length > 0 ? `
  <table>
    <thead>
      <tr>
        <th>Model</th>
        <th>Model Code</th>
        <th>Type</th>
        <th>Wattage</th>
        <th>No. of Panels</th>
      </tr>
    </thead>
    <tbody>
      ${panels.map(panel => `
        <tr>
          <td>${panel.solar_panel_model || "-"}</td>
          <td>${panel.panel_model_code || "-"}</td>
          <td>${panel.panel_type || "-"}</td>
          <td>${panel.wattage_of_pannel || "-"}</td>
          <td>${panel.no_of_panels || "-"}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>
` : "<p>No solar panel data available.</p>";

printWindow.document.getElementById("solar-details").innerHTML = solarTable;


       //  Wifi details (no API, just props passed in)
    const wifiTable = wifiDetails
      ? `
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Password</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${wifiDetails.username || "Not set"}</td>
              <td>${wifiDetails.password || "Not set"}</td>
            </tr>
          </tbody>
        </table>
      `
      : "<p>No WiFi details available.</p>";

    printWindow.document.getElementById("wifi-details").innerHTML = wifiTable;

  // 🔹 Battery details 
    const batteryRes = await axios.get("http://127.0.0.1:8000/api/get-batteries", {
      headers: { Authorization: `Bearer ${token}` },
      params: { off_grid_hybrid_project_id: offGrid?.off_grid_hybrid_project_id }
    });
    const batteries = batteryRes.data.data.batteries || [];
    const batteryTable = batteries.length > 0 ? `
      <table>
        <thead>
          <tr>
            <th>Brand</th>
            <th>Battery Model</th>
            <th>Serial No</th>
            <th>Capacity</th>
          </tr>
        </thead>
        <tbody>
          ${batteries.map(bat => `
            <tr>
              <td>${bat.battery_brand || "-"}</td>
              <td>${bat.battery_model || "-"}</td>
              <td>${bat.battery_serial_no || "-"}</td>
              <td>${bat.battery_capacity || "-"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    ` : "<p>No battery data available.</p>";
    printWindow.document.getElementById("battery-details").innerHTML = batteryTable;

  } catch (err) {
    console.error("Error fetching details for print:", err);
  } finally {
    printWindow.print();
  }
};

  
  return (
    <div>
      <div className="flex justify-between items-center mb-2.5">
        <h3 className="m-0 text-lg font-semibold">Project Details</h3>
         <div className ="flex justify-end space-x-4">
        <button
         className={`px-2 py-2 rounded-md ${editMode ? 'bg-red-500 text-white hover:bg-red-700' : 'bg-teal-600 text-white hover:bg-teal-700 '} hover:transform hover:scale-105 transition-transform duration-200`}
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ?  <CloseIcon fontSize="medium" /> : <EditDocumentIcon fontSize="medium" />}
        </button>
                {!editMode && (
  <button
    onClick={handlePrint}
    className="bg-teal-600 hover:bg-teal-700 text-white px-2 py-2 rounded-md shadow-md hover:transform hover:scale-105 transition-transform duration-200"
  >
     <LocalPrintshopSharpIcon fontSize="medium" />
  </button>
)}
</div>
      </div>
      <div className="card-content">
        <div id="printable-project">
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
            <label className="block text-sm mt-2.5 mb-1.5">Connection type</label>
            <input
              disabled={!editMode}
              value={offGrid?.connection_type || ''}
              onChange={(e) => setOffGrid({ ...offGrid, connection_type: e.target.value })}
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
            <label className="block text-sm mt-2.5 mb-1.5">Nearest town</label>
            <input
              disabled={!editMode}
              value={project?.neatest_town || '-'}
              onChange={(e) => setProject({ ...project, neatest_town: e.target.value })}
                                           className={`w-[70%] p-2 rounded-lg ${editMode ? 'bg-white border-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500'
                : 'bg-gray-200 border-gray-300'} border mr-[4%]`}
            />
          </div>
          <div className="flex flex-col w-1/2">
            <label className="block text-sm mt-2.5 mb-1.5">No. of panels</label>
            <input
              disabled={!editMode}
              value={project?.no_of_panels || '0'}
              onChange={(e) => setProject({ ...project, no_of_panels: e.target.value })}
                                            className={`w-[70%] p-2 rounded-lg ${editMode ? 'bg-white border-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500'
                : 'bg-gray-200 border-gray-300'} border mr-[4%]`}
            />
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

        {/* System Remarks (from off_grid_hybrids table) */}
        <label className="block text-sm mt-2.5 mb-1.5">System Remarks</label>
        <textarea
          disabled={!editMode}
          value={offGrid?.remarks || ''}
          onChange={(e) => setOffGrid({ ...offGrid, remarks: e.target.value })}
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
                {project["External/Internal"] === "External" && (
  <div className="mt-4">
    <label className="block text-sm mt-2.5 mb-1.5">Company Name</label>
    <input
      disabled={!editMode}
      value={project?.company_name || ""}
      onChange={(e) =>
        setProject({ ...project, company_name: e.target.value })
      }
      className={`w-[90%] p-2 rounded-lg ${
        editMode
          ? "bg-white border-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          : "bg-gray-200 border-gray-300"
      } border`}
    />
  </div>
)}
        </div>


        <div className="mt-4 flex gap-2.5 flex-wrap">
          <button
            className="bg-[#00a68b] text-white border-none px-3.5 py-2 rounded-lg cursor-pointer hover:bg-[#008f76]"
            onClick={() => setShowSolarPanelModal(true)}
          >
            Solar Panel Details
          </button>
          {/* <SolarPanelModal show={showModal} onClose={() => setShowModal(false)} /> */}
          <button
            className="bg-[#00a68b] text-white border-none px-3.5 py-2 rounded-lg cursor-pointer hover:bg-[#008f76]"
            onClick={() => setShowInverterModal(true)}
          >
            Invertor Details
          </button>
          <button
            className="bg-[#00a68b] text-white border-none px-3.5 py-2 rounded-lg cursor-pointer hover:bg-[#008f76]"
            onClick={() => setShowBatteryModal(true)}
          >
            Battery Details
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
        <SolarPanelDetailsModel show={showSolarPanelModal} onClose={()=>setShowSolarPanelModal(false)} projectId={project.id} panelCapacity={project.panel_capacity} noOfPanels={project?.no_of_panels}/>
      )}
      {showInverterModal && (
        <InverterDetailsModel show={showInverterModal} onClose={()=>setShowInverterModal(false)} projectId={project.id}/>
      )}
      {showBatteryModal && (
        <BatteryDetailsModel show={showBatteryModal} onClose={()=>setShowBatteryModal(false)} offgridProjectId={offGrid.off_grid_hybrid_project_id}/>
      )}
        {showWifiModal && (
            <WifiDetailsModel username={offGrid.wifi_username} password={offGrid.wifi_passowrd} show={showWifiModal} onClose={()=>setShowWifiModal(false)}/>
        )}
    </div>
  )
}
