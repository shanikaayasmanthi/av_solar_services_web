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
        // console.log(customerResponse.data);
        
        if(customerResponse.data.status === "Request was successful."){
              const customerResponseData = customerResponse.data.data;
              // console.log(customerResponseData);
              
              setCustomer(customerResponseData.customer);
              // console.log(customer);
              
              setCustomerPhone(customerResponseData.phone_numbers);
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
        class="bg-white rounded-lg border border-gray-300 p-5 flex-1 min-w-[600px] h-[400px]"
      >
        <div class="flex justify-between items-center mb-2.5">
          <h3 class="m-0 text-lg font-semibold">Customer Details</h3>
          {/* <EditIcon class="icon text-[35px]" fontSize='medium'/> */}
          <PencilIcon className='cursor-pointer w-7 h-7'/>
          
        </div>
        <div class="card-content">
          <label class="block text-sm mt-2.5 mb-1.5">Name</label>
          <input
            disabled
            value={customer?.name || ''}
            class="w-[90%] p-2 rounded-lg border border-gray-300 bg-gray-200"
          />

          <label class="block text-sm mt-2.5 mb-1.5">Tel. No</label>
          {customerPhone && customerPhone.length > 0 ?(
            <div className='flex flex-row flex-wrap gap-2'>
            {customerPhone.map((phone, index) => (
                
                    <input key={index}
            disabled
            value={phone}
            class="p-2 rounded-lg border border-gray-300 bg-gray-200"
          />
                
            ))}
            </div>
          ):(
            <input
            disabled
            value="No phone numbers provided"
            class="w-[90%] p-2 rounded-lg border border-gray-300 bg-gray-200"
          />
          )}

          <label class="block text-sm mt-2.5 mb-1.5">Address</label>
          <input
            disabled
            value={customer?.address?customer.address:"No address provided"}
            class="w-[90%] p-2 rounded-lg border border-gray-300 bg-gray-200"
          />

          <label class="block text-sm mt-2.5 mb-1.5">Email</label>
          <input
            disabled
            value={customer?.email}
            class="w-[90%] p-2 rounded-lg border border-gray-300 bg-gray-200"
          />
        </div>
      </div>
      )}
    </div>
  )
}
