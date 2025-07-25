import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import NewSolarPanelDetails from './NewSolarPanelDetails';
import NewInverterDetails from './NewInventerDetails';
import NewBatteryDetails from './NewBatteryDetails';

const ProjectTypeDetailsForm = () => {
  const { project_id } = useParams();
  const { token } = useAuth();
  const [projectType, setProjectType] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    electricityBillName: '',
    harmonicMeter: '',
    ongridRemark: '',
    connectionType: '',
    offgridRemark: ''
  });

  const [showModal, setShowModal] = useState(false);
  const [panelCapacity, setPanelCapacity] = useState(0);
  const [noOfPanels, setNoOfPanels] = useState(0);
  const [showInverterModal, setShowInverterModal] = useState(false);
  const [showBatteryModal, setShowBatteryModal] = useState(false);

useEffect(() => {
  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/projects/uninstalled`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Find the project by ID
      const project = response.data?.data?.projects?.find(
        (p) => String(p.project_id) === String(project_id)
      );

      if (!project) {
        console.warn('Project not found in the list of uninstalled projects.');
        return;
      }

      // Set the correct project type
      setProjectType(project.type);
        setPanelCapacity(project.capacity || 0); // Set panel capacity
        setNoOfPanels(project.total_panels || 0);

      // Fetch detailed data for the specific project (if needed)
      // or keep dummy data
      setFormData((prev) => ({
        ...prev,
        electricityBillName: '',
        harmonicMeter: '',
        ongridRemark: '',
        connectionType: '',
        offgridRemark: '',
      }));
    } catch (error) {
      console.error('Error fetching project details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchProjectDetails();
}, [project_id, token]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // 🛡️ Basic validation
  if (projectType === 'ongrid') {
    if (!formData.electricityBillName.trim()) {
      alert('Electricity Bill Name is required.');
      return;
    }
    if (!formData.harmonicMeter.trim()) {
      alert('Harmonic Meter is required.');
      return;
    }
  } else if (projectType === 'offgrid') {
    if (!formData.connectionType.trim()) {
      alert('Connection Type is required.');
      return;
    }
  }

  try {
    const payload =
      projectType === 'ongrid'
        ? {
            project_id: project_id,
            electricity_bill_name: formData.electricityBillName,
            harmonic_meter: formData.harmonicMeter,
            remarks: formData.ongridRemark,
          }
        : {
            project_id: project_id,
            connection_type: formData.connectionType,
            remarks: formData.offgridRemark,
            off_grid_hybrid_project_id: '', // Optional
          };

    const endpoint =
      projectType === 'ongrid'
        ? 'http://localhost:8000/api/projects/ongrid'
        : 'http://localhost:8000/api/projects/offgrid';

    const response = await axios.post(endpoint, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert(response.data.message || 'Project details saved successfully!');
  } catch (error) {
    console.error('Error saving project details:', error);
    alert('Failed to save project details');
  }
};


  if (isLoading) return <div className="text-center py-8">Loading project details...</div>;

  console.log("Project Type:", projectType);
  console.log("project_id:", project_id);

return (
  <>
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-6 flex-1 min-w-[600px] ">
      <h2 className="text-xl font-semibold mb-6">
        {projectType === 'ongrid' ? 'Ongrid Details' : 'Offgrid Details'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {projectType === 'ongrid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Electricity Bill Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Electricity Bill Name
              </label>
              <input
                type="text"
                name="electricityBillName"
                value={formData.electricityBillName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter electricity bill name"
              />
            </div>

            {/* Harmonic Meter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Harmonic Meter
              </label>
              <input
                type="text"
                name="harmonicMeter"
                value={formData.harmonicMeter}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter harmonic meter details"
              />
            </div>

            {/* Ongrid Remark */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ongrid Remark
              </label>
              <textarea
                name="ongridRemark"
                value={formData.ongridRemark}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter any remarks"
              />
            </div>

            {/* Action Buttons */}
            <div className="md:col-span-2 flex space-x-4 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
              >
                Add Solar Panel Details
              </button>
                <button
                  type="button"
                  onClick={() => setShowInverterModal(true)}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                >
                  Add Inverter Details
                </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Offgrid Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Connection Type
              </label>
              <select
                name="connectionType"
                value={formData.connectionType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select connection type</option>
                <option value="AC">AC Connection</option>
                <option value="DC">DC Connection</option>
                <option value="Hybrid">Hybrid Connection</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Offgrid Remark
              </label>
              <textarea
                name="offgridRemark"
                value={formData.offgridRemark}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter any remarks"
              />
            </div>
            
            <div className="md:col-span-2 flex space-x-4 pt-2">
               <button
                type="button"
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
              >
                Add Solar Panel Details
              </button>
                <button
                  type="button"
                  onClick={() => setShowInverterModal(true)}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                >
                  Add Inverter Details
                </button>
              <button
                type="button"
                onClick={() => setShowBatteryModal(true)}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
              >
                Add Battery Details
              </button>
            </div>
          </div>
        )}
        
        <div className="pt-8 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 "
          >
            Save {projectType === 'ongrid' ? 'Ongrid' : 'Offgrid'} Details
          </button>
        </div>
      </form>
    </div>

    <NewSolarPanelDetails
      show={showModal}
      onClose={() => setShowModal(false)}
      projectId={project_id}
      panelCapacity={panelCapacity}
      noOfPanels={noOfPanels}
    />
      <NewInverterDetails
  show={showInverterModal}
  onClose={() => setShowInverterModal(false)}
  projectId={project_id}
   />
    <NewBatteryDetails
      show={showBatteryModal}
      onClose={() => setShowBatteryModal(false)}
      projectId={project_id}
    />
  </>


);
};

export default ProjectTypeDetailsForm;