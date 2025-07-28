import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const PendingInstallationForm = () => {
  const { project_id } = useParams();
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    longitude: '',
    latitude: '',
    isInstalled: false,
    installationDate: '',
    isSystemOn: false,
    systemOnDate: '',
    projectRemarks: ''
  });
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
    const fetchInstallationDetails = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/projects/${project_id}/pending-installation`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.data.status === 'success') {
          const projectData = response.data.data;
          setFormData({
            longitude: projectData.longitude || '',
            latitude: projectData.latitude || '',
            isInstalled: projectData.is_installed || false,
            installationDate: projectData.installation_date 
              ? projectData.installation_date.split(' ')[0] 
              : '',
            isSystemOn: projectData.system_on_date ? true : false,
            systemOnDate: projectData.system_on_date
              ? projectData.system_on_date.split(' ')[0]
              : '',
            projectRemarks: projectData.remarks || ''
          });
        } else {
          console.error('Error:', response.data.message);
          // Handle API error message (e.g., show to user)
        }
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          if (error.response.status === 404) {
            console.error('Project not found or already installed');
            // Handle 404 specifically (e.g., redirect or show message)
          } else {
            console.error('Server error:', error.response.data);
          }
        } else {
          console.error('Error fetching installation details:', error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstallationDetails();
  }, [project_id, token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.longitude || !formData.latitude) {
      alert('Longitude and Latitude are required');
      return;
    }
    
    if (formData.isInstalled && !formData.installationDate) {
      alert('Installation date is required when installation is marked as complete');
      return;
    }
    
    if (formData.isSystemOn && !formData.systemOnDate) {
      alert('System on date is required when system is marked as on');
      return;
    }

    try {
      const payload = {
        longitude: formData.longitude,
        latitude: formData.latitude,
        installation_date: formData.isInstalled ? formData.installationDate : null,
        system_on_date: formData.isSystemOn ? formData.systemOnDate : null,
        remarks: formData.projectRemarks,
        is_installed: formData.isInstalled
      };

      await axios.put(
        `http://127.0.0.1:8000/api/projects/${project_id}/installation`, 
        payload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      alert('Installation details updated successfully!');
    } catch (error) {
      console.error('Error updating installation details:', error);
      alert('Failed to update installation details');
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-6 flex-1 min-w-[600px] max-h-[500px] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-6">Installation Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Coordinates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longitude*
            </label>
            <input
              type="text"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter longitude"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Latitude*
            </label>
            <input
              type="text"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter latitude"
              required
            />
          </div>

          {/* Installation Status */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isInstalled"
              name="isInstalled"
              checked={formData.isInstalled}
              onChange={handleChange}
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
            />
            <label htmlFor="isInstalled" className="text-sm font-medium text-gray-700">
              Installation Completed
            </label>
          </div>
          {formData.isInstalled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Installation Date*
              </label>
              <input
                type="date"
                name="installationDate"
                value={formData.installationDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required={formData.isInstalled}
              />
            </div>
          )}

          {/* System Status */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isSystemOn"
              name="isSystemOn"
              checked={formData.isSystemOn}
              onChange={handleChange}
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
            />
            <label htmlFor="isSystemOn" className="text-sm font-medium text-gray-700">
              System Turned On
            </label>
          </div>
          {formData.isSystemOn && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                System On Date*
              </label>
              <input
                type="date"
                name="systemOnDate"
                value={formData.systemOnDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required={formData.isSystemOn}
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 mt-5">
            Special Note
          </label>
          <input
            type="text"
            name="projectRemarks"
            value={formData.projectRemarks}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter project remarks"
          />
        </div>

        <div className="flex justify-end pt-4 mt-5 mb-2">
          <button
            type="submit"
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Save Installation Details
          </button>
        </div>
      </form>
    </div>
  );
};

export default PendingInstallationForm;