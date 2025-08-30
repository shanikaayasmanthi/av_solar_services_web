import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const EditProjectModal = ({ show, onClose, project, typeSpecificData, projectType, onUpdate }) => {
  const [formData, setFormData] = useState({});
  const [typeSpecificForm, setTypeSpecificForm] = useState({});
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  // Function to format date for input type="date"
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    
    // If it's already in yyyy-MM-dd format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // If it contains time part, extract just the date
    if (dateString.includes(' ')) {
      return dateString.split(' ')[0];
    }
    
    // If it's a valid date string, try to format it
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch (e) {
      console.error('Error formatting date:', e);
    }
    
    return '';
  };

  useEffect(() => {
    if (show && project) {
      setFormData({
        project_address: project.project_address || '',
        neatest_town: project.neatest_town || '',
        no_of_panels: project.no_of_panels || '',
        panel_capacity: project.panel_capacity || '',
        project_installation_date: formatDateForInput(project.project_installation_date),
        system_on: formatDateForInput(project.system_on),
        longitude: project.longitude || '',
        lattitude: project.lattitude || '',
        remarks: project.remarks || '',
        service_years_in_agreement: project.service_years_in_agreement || '',
        service_rounds_in_agreement: project.service_rounds_in_agreement || '',
      });

      setTypeSpecificForm(typeSpecificData || {});
    }
  }, [show, project, typeSpecificData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/update-project',
        {
          project_id: project.id,
          project_data: formData,
          type_specific_data: typeSpecificForm
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      if (response.data.status === 'success') {
        onUpdate(response.data.data);
        onClose();
      }
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTypeSpecificChange = (field, value) => {
    setTypeSpecificForm(prev => ({ ...prev, [field]: value }));
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Edit Project Details</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Common Fields */}
          <div>
            <label className="block text-sm font-medium mb-1">Project Address</label>
            <input
              type="text"
              value={formData.project_address || ''}
              onChange={(e) => handleInputChange('project_address', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nearest Town</label>
              <input
                type="text"
                value={formData.neatest_town || ''}
                onChange={(e) => handleInputChange('neatest_town', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">No. of Panels</label>
              <input
                type="number"
                value={formData.no_of_panels || ''}
                onChange={(e) => handleInputChange('no_of_panels', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Panel Capacity</label>
              <input
                type="number"
                step="0.01"
                value={formData.panel_capacity || ''}
                onChange={(e) => handleInputChange('panel_capacity', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Installation Date</label>
              <input
                type="date"
                value={formData.project_installation_date || ''}
                onChange={(e) => handleInputChange('project_installation_date', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">System On Date</label>
              <input
                type="date"
                value={formData.system_on || ''}
                onChange={(e) => handleInputChange('system_on', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Service Years</label>
              <input
                type="number"
                value={formData.service_years_in_agreement || ''}
                onChange={(e) => handleInputChange('service_years_in_agreement', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Service Rounds</label>
              <input
                type="number"
                value={formData.service_rounds_in_agreement || ''}
                onChange={(e) => handleInputChange('service_rounds_in_agreement', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={formData.longitude || ''}
                onChange={(e) => handleInputChange('longitude', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={formData.lattitude || ''}
                onChange={(e) => handleInputChange('lattitude', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Type Specific Fields */}
          {projectType === 'ongrid' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Electricity Bill Name</label>
                <input
                  type="text"
                  value={typeSpecificForm.electricity_bill_name || ''}
                  onChange={(e) => handleTypeSpecificChange('electricity_bill_name', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Harmonic Meter</label>
                <input
                  type="text"
                  value={typeSpecificForm.harmonic_meter || ''}
                  onChange={(e) => handleTypeSpecificChange('harmonic_meter', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </>
          )}

          {projectType === 'offgrid' && (
            <div>
              <label className="block text-sm font-medium mb-1">Connection Type</label>
              <input
                type="text"
                value={typeSpecificForm.connection_type || ''}
                onChange={(e) => handleTypeSpecificChange('connection_type', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          )}

          {/* WiFi Fields (Common for both types) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">WiFi Username</label>
              <input
                type="text"
                value={typeSpecificForm.wifi_username || ''}
                onChange={(e) => handleTypeSpecificChange('wifi_username', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">WiFi Password</label>
              <input
                type="password"
                value={typeSpecificForm.wifi_password || ''}
                onChange={(e) => handleTypeSpecificChange('wifi_password', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Remarks</label>
            <textarea
              value={formData.remarks || ''}
              onChange={(e) => handleInputChange('remarks', e.target.value)}
              className="w-full p-2 border rounded"
              rows="3"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal;