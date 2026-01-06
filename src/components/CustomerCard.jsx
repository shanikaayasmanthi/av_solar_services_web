import { PencilIcon } from '@heroicons/react/16/solid';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import CloseIcon from '@mui/icons-material/Close';
import { BASE_URL } from "../constants/BaseUrl.jsx";

export default function CustomerCard({ projectId, customerData }) {
  const { token } = useAuth();

  const [customer, setCustomer] = useState(customerData || {
    name: '',
    email: '',
    address: '',
    phone_numbers: []
  });
  const [tempPhoneNumbers, setTempPhoneNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Fetch customer details
  const fetchCustomerData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}api/get-customer`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { project_id: projectId }
      });

      if (
        response.data.status === 'Request was successful.' ||
        response.data.success === true
      ) {
        const customerResponseData = response.data.data;
        setCustomer({
          name: customerResponseData.customer.name,
          email: customerResponseData.customer.email,
          address: customerResponseData.customer.address,
          phone_numbers: customerResponseData.phone_numbers
        });
        setTempPhoneNumbers([...customerResponseData.phone_numbers]);
      } else {
        console.error('Unexpected response structure:', response.data);
      }
    } catch (error) {
      console.error('Error fetching customer data:', error);
      setError('Failed to load customer data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!customerData && projectId) {
      fetchCustomerData();
    }
    else if (customerData) {
      setCustomer(customerData);
    }
  }, [projectId, customerData]);

  // Toggle edit mode
  const handleEditToggle = () => {
    setEditing(!editing);
    if (!editing) {
      setTempPhoneNumbers([...customer.phone_numbers]);
    }
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (index, value) => {
    const updatedPhones = [...tempPhoneNumbers];
    updatedPhones[index] = value;
    setTempPhoneNumbers(updatedPhones);
  };

  const addPhoneNumber = () => {
    setTempPhoneNumbers([...tempPhoneNumbers, '']);
  };

  const removePhoneNumber = (index) => {
    const updatedPhones = tempPhoneNumbers.filter((_, i) => i !== index);
    setTempPhoneNumbers(updatedPhones);
  };

  // Save changes
  const handleSubmit = async () => {
    try {
      if (
        tempPhoneNumbers.length === 0 ||
        tempPhoneNumbers.some((phone) => !phone.trim())
      ) {
        throw new Error('Please provide at least one valid phone number');
      }

      const response = await axios.put(
        `${BASE_URL}api/customers/update-details`,
        {
          project_id: projectId,
          name: customer.name,
          email: customer.email,
          address: customer.address,
          phone_numbers: tempPhoneNumbers.filter((phone) => phone.trim())
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        setCustomer({
          ...customer,
          phone_numbers: response.data.customer.telephone_numbers
        });
        setSuccess('Customer details updated successfully');
        setEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Update error:', err);
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to update customer details'
      );
      setTempPhoneNumbers([...customer.phone_numbers]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-t-2 border-b-2 border-teal-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-300 p-5 flex-1 min-w-[600px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Customer Details</h3>
        <div className="relative inline-block group">
  {/* The Button */}
  <button
    onClick={handleEditToggle}
    className={`px-2 py-2 rounded-md flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-md ${
      editing 
        ? 'bg-red-500 text-white hover:bg-red-700' 
        : 'bg-teal-600 text-white hover:bg-teal-700'
    }`}
  >
    {editing ? <CloseIcon fontSize="medium" /> : <EditDocumentIcon fontSize="medium" />}
  </button>

  {/* Dynamic Tooltip Label */}
  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-[9999]">
    <span className="bg-gray-800 text-white text-[11px] px-2 py-1 rounded shadow-xl whitespace-nowrap">
      {editing ? "Cancel" : "Edit"}
    </span>
    {/* Arrow */}
    <div className="w-2 h-2 -mt-1 rotate-45 bg-gray-800"></div>
  </div>
</div>
      </div>

      {success && (
        <div className="p-2 mb-4 text-green-700 bg-green-100 rounded">
          {success}
        </div>
      )}
      {error && (
        <div className="p-2 mb-4 text-red-700 bg-red-100 rounded">{error}</div>
      )}

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1 text-sm">Name</label>
          <input
            name="name"
            value={customer.name || ''}
            onChange={handleInputChange}
            disabled={!editing}
            className={`w-[90%] p-2 rounded-lg border ${
              editing
                ? 'bg-white border-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500'
                : 'bg-gray-200 border-gray-300'
            }`}
          />
        </div>

        {/* Phone Numbers */}
        <div>
          <label className="block mb-1 text-sm">Tel. No</label>
          {editing ? (
            <div className="space-y-2">
              {tempPhoneNumbers.map((phone, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    value={phone}
                    onChange={(e) => handlePhoneChange(index, e.target.value)}
                    className="flex-1 p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    onClick={() => removePhoneNumber(index)}
                    className="p-2 text-xl text-red-500 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                onClick={addPhoneNumber}
                className="px-3 py-2 mt-2 bg-teal-100 rounded-md hover:bg-teal-500"
              >
                + Add Phone Number
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {customer.phone_numbers?.length > 0 ? (
                customer.phone_numbers.map((phone, index) => (
                  <input
                    key={index}
                    value={phone}
                    disabled
                    className="p-2 bg-gray-200 border border-gray-300 rounded-lg"
                  />
                ))
              ) : (
                <input
                  value="No phone numbers provided"
                  disabled
                  className="p-2 bg-gray-200 border border-gray-300 rounded-lg"
                />
              )}
            </div>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block mb-1 text-sm">Address</label>
          <input
            name="address"
            value={customer.address || 'No address provided'}
            onChange={handleInputChange}
            disabled={!editing}
            className={`w-[90%] p-2 rounded-lg border ${
              editing
                ? 'bg-white border-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500'
                : 'bg-gray-200 border-gray-300'
            }`}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 text-sm">Email</label>
          <input
            name="email"
            value={customer.email || ''}
            onChange={handleInputChange}
            disabled={!editing}
            className={`w-[90%] p-2 rounded-lg border ${
              editing
                ? 'bg-white border-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500'
                : 'bg-gray-200 border-gray-300'
            }`}
          />
        </div>

        {/* Save Button */}
        {editing && (
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-white bg-teal-600 rounded-md hover:bg-teal-700"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
