import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
//import { PencilIcon } from '@heroicons/react/16/solid';

const PendingInstallationCustomerCard = ({ projectId }) => {
  const { token } = useAuth();
  const [customer, setCustomer] = useState({});
  const [customerPhone, setCustomerPhone] = useState([]);
  const [loading, setLoading] = useState(true);

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

      if (response.data.status === 'success') {
        const customerData = response.data.customers[0]; 
        setCustomer({
          name: customerData.customer_name,
          email: customerData.email,
          address: customerData.address,
          phone_numbers: customerData.telephone_numbers,
        });
        setCustomerPhone(customerData.telephone_numbers);
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
    } finally {
      setLoading(false);
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
    <div>
      {!loading && (
        <div className="bg-white rounded-lg border border-gray-300 p-5 flex-1 min-w-[600px] h-[450px]">
          <div className="flex justify-between items-center mb-2.5">
            <h3 className="m-0 text-lg font-semibold">Customer Details</h3>
            {/* <PencilIcon className='cursor-pointer w-7 h-7'/> */}
          </div>
          
          <div className="card-content">
            <label className="block text-sm mt-2.5 mb-1.5">Name</label>
            <input
              disabled
              value={customer?.name || ''}
              className="w-[90%] p-2 rounded-lg border border-gray-300 bg-gray-200"
            />

            <label className="block text-sm mt-2.5 mb-1.5">Tel. No</label>
            {customerPhone && customerPhone.length > 0 ? (
              <div className='flex flex-row flex-wrap gap-2'>
                {customerPhone.map((phone, index) => (
                  <input 
                    key={index}
                    disabled
                    value={phone}
                    className="p-2 rounded-lg border border-gray-300 bg-gray-200"
                  />
                ))}
              </div>
            ) : (
              <input
                disabled
                value="No phone numbers provided"
                className="w-[90%] p-2 rounded-lg border border-gray-300 bg-gray-200"
              />
            )}

            <label className="block text-sm mt-2.5 mb-1.5">Address</label>
            <input
              disabled
              value={customer?.address ? customer.address : "No address provided"}
              className="w-[90%] p-2 rounded-lg border border-gray-300 bg-gray-200"
            />

            <label className="block text-sm mt-2.5 mb-1.5">Email</label>
            <input
              disabled
              value={customer?.email || "No email provided"}
              className="w-[90%] p-2 rounded-lg border border-gray-300 bg-gray-200"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingInstallationCustomerCard;