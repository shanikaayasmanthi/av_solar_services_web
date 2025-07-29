import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const PendingInstallationCustomerCard = ({ projectId }) => {
  const { token } = useAuth();
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    address: '',
    phone_numbers: []
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [tempPhoneNumbers, setTempPhoneNumbers] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchCustomerData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/customers/non-installed', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          project_id: projectId
        }
      });

      if (response.data.status === 'success' && response.data.customers.length > 0) {
        const customerData = response.data.customers[0];
        setCustomer({
          name: customerData.customer_name,
          email: customerData.email,
          address: customerData.address,
          phone_numbers: customerData.telephone_numbers
        });
        setTempPhoneNumbers([...customerData.telephone_numbers]);
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
      setError('Failed to load customer data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setEditing(!editing);
    if (!editing) {
      // When entering edit mode, copy current phone numbers to temp state
      setTempPhoneNumbers([...customer.phone_numbers]);
    }
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
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

  const handleSubmit = async () => {
    try {
      // Validate at least one phone number exists
      if (tempPhoneNumbers.length === 0 || tempPhoneNumbers.some(phone => !phone.trim())) {
        throw new Error('Please provide at least one valid phone number');
      }

      const response = await axios.put(
        'http://127.0.0.1:8000/api/customers/update-details',
        {
          project_id: projectId,
          name: customer.name,
          email: customer.email,
          address: customer.address,
          phone_numbers: tempPhoneNumbers.filter(phone => phone.trim())
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        // Update local state with new data
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
      setError(err.response?.data?.message || err.message || 'Failed to update customer details');
      // Revert to original phone numbers if update fails
      setTempPhoneNumbers([...customer.phone_numbers]);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchCustomerData();
    }
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-6 flex-1 min-w-[600px] ">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Customer Details</h3>
        <button
          onClick={handleEditToggle}
          className={`px-3 py-1 rounded-md ${editing ? 'bg-red-200 text-gray-800 hover:bg-red-400' : 'bg-teal-600 text-white hover:bg-teal-700 '}`}
        >
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {success && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            name="name"
            value={customer.name}
            onChange={handleInputChange}
            disabled={!editing}
            className={`w-full p-2 rounded-lg border ${editing ? 'bg-white focus:outline-none focus:ring-2 focus:ring-teal-500' : 'bg-gray-100 border-gray-200'}`}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            name="email"
            value={customer.email}
            onChange={handleInputChange}
            disabled={!editing}
            className={`w-full p-2 rounded-lg border ${editing ? 'bg-white focus:outline-none focus:ring-2 focus:ring-teal-500' : 'bg-gray-100 border-gray-200'}`}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Address</label>
          <input
            name="address"
            value={customer.address}
            onChange={handleInputChange}
            disabled={!editing}
            className={`w-full p-2 rounded-lg border ${editing ? 'bg-white focus:outline-none focus:ring-2 focus:ring-teal-500' : 'bg-gray-100 border-gray-200'}`}
          />
        </div>

        <div>
          <label className="block text-sm mb-4">Phone Numbers</label>
          {editing ? (
            <div className="space-y-2">
              {tempPhoneNumbers.map((phone, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    value={phone}
                    onChange={(e) => handlePhoneChange(index, e.target.value)}
                    className="flex-1 p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    onClick={() => removePhoneNumber(index)}
                    className="p-2 text-red-500 text-xl hover:text-red-800 "
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                onClick={addPhoneNumber}
                className="mt-2 px-3 py-2 bg-teal-100 rounded-md hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
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
                    className="p-2 rounded-lg border bg-gray-100 border-gray-200"
                  />
                ))
              ) : (
                <input
                  value="No phone numbers provided"
                  disabled
                  className="p-2 rounded-lg border bg-gray-100 border-gray-200"
                />
              )}
            </div>
          )}
        </div>

        {editing && (
          <div className="pt-4 flex justify-end">
            <button
              onClick={handleSubmit}
              className="  px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 "
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingInstallationCustomerCard;