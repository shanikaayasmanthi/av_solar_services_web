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
    portalUsername: '',
    portalPassword: '',
    isInstalled: false,
    installationDate: '',
    isSystemOn: false,
    systemOnDate: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`/api/projects/${project_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData(prev => ({
          ...prev,
          ...response.data,
          installationDate: response.data.installationDate || '',
          systemOnDate: response.data.systemOnDate || ''
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/projects/${project_id}/installation`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Installation details updated successfully!');
    } catch (error) {
      console.error('Error updating installation details:', error);
      alert('Failed to update installation details');
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className=" h-full bg-white rounded-lg border border-gray-300 p-5 flex-1 min-w-[650px] ">
      <h2 className="text-xl font-semibold mb-6">Installation Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Coordinates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longitude
            </label>
            <input
              type="text"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter longitude"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Latitude
            </label>
            <input
              type="text"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter latitude"
            />
          </div>

          {/* Portal Credentials */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Portal Username
            </label>
            <input
              type="text"
              name="portalUsername"
              value={formData.portalUsername}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter portal username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Portal Password
            </label>
            <input
              type="password"
              name="portalPassword"
              value={formData.portalPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter portal password"
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
                Installation Date
              </label>
              <input
                type="date"
                name="installationDate"
                value={formData.installationDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                System On Date
              </label>
              <input
                type="date"
                name="systemOnDate"
                value={formData.systemOnDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
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

        <div className="flex justify-end pt-4 mt-5">
          <button
            type="submit"
            className="px-2 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Save Installation Details
          </button>
        </div>
      </form>
    </div>
  );
};

export default PendingInstallationForm;