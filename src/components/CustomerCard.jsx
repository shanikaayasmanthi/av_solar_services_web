import { PencilIcon } from '@heroicons/react/16/solid'
import React, { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { useState } from 'react'

export default function CustomerCard({projectId}) {

  const {token} = useAuth();
      const [customer, setCustomer] = useState({});
      const [customerPhone,setCustomerPhone] = useState([]);
  const [customerLoading, setCustomerLoading] = useState(true);


  const fetchCustomerData = async() => {
      try{
        const customerResponse = await axios.get('http://127.0.0.1:8000/api/get-customer',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              project_id: projectId
            }
            }
        );
        // Handle both response structures
        if(customerResponse.data.status === "Request was successful." || customerResponse.data.success === true){
          const customerResponseData = customerResponse.data.data;
          setCustomer(customerResponseData.customer);
          setCustomerPhone(customerResponseData.phone_numbers);
        } else {
          console.error("Unexpected response structure:", customerResponse.data);
        }
      }catch(error){
        console.error("Error fetching project data:", error);
      }finally{
        setCustomerLoading(false);
      }
    }

    useEffect(() => {
      fetchCustomerData();
    },[]);
  return (
    <div>
      {!customerLoading && (
      <div
        className="bg-white rounded-lg border border-gray-300 p-5 flex-1 min-w-[600px] h-[400px]"
      >
        <div className="flex justify-between items-center mb-2.5">
          <h3 className="m-0 text-lg font-semibold">Customer Details</h3>
          {/* <EditIcon className="icon text-[35px]" fontSize='medium'/> */}
          <PencilIcon className='cursor-pointer w-7 h-7'/>
          
        </div>
        <div className="card-content">
          <label className="block text-sm mt-2.5 mb-1.5">Name</label>
          <input
            disabled
            value={customer?.name || ''}
            className="w-[90%] p-2 rounded-lg border border-gray-300 bg-gray-200"
          />

          <label className="block text-sm mt-2.5 mb-1.5">Tel. No</label>
          {customerPhone && customerPhone.length > 0 ?(
            <div className='flex flex-row flex-wrap gap-2'>
            {customerPhone.map((phone, index) => (
                
                    <input key={index}
            disabled
            value={phone}
            className="p-2 rounded-lg border border-gray-300 bg-gray-200"
          />
                
            ))}
            </div>
          ):(
            <input
            disabled
            value="No phone numbers provided"
            className="w-[90%] p-2 rounded-lg border border-gray-300 bg-gray-200"
          />
          )}

          <label className="block text-sm mt-2.5 mb-1.5">Address</label>
          <input
            disabled
            value={customer?.address?customer.address:"No address provided"}
            className="w-[90%] p-2 rounded-lg border border-gray-300 bg-gray-200"
          />

          <label className="block text-sm mt-2.5 mb-1.5">Email</label>
          <input
            disabled
            value={customer?.email}
            className="w-[90%] p-2 rounded-lg border border-gray-300 bg-gray-200"
          />
        </div>
      </div>
      )}
    </div>
  )
}
