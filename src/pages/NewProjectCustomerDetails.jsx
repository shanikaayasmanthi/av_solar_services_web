import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftCircleIcon } from "@heroicons/react/16/solid";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

export default function NewProjectCustomerDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const customerType = location.state?.customerType || "new";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isNewCustomer, setIsNewCustomer] = useState(null);
  const [query, setQuery] = useState("");
  const [searchqueryError, setSearchQueryError] = useState("");
  const {token} = useAuth();
  const [customer, setCustomer] = useState({});
  const [customerLoading, setCustomerLoading] = useState(true);
  const [customerFound, setCustomerFound] = useState(false);

  useEffect(() => {
    if (customerType === "new") {
      setIsNewCustomer(true);
      setCustomerFound(true);
    } else {
      setIsNewCustomer(false);
      setCustomerFound(false);
    }
  },[customerType,customer]);

  const searchCustomer = async() => {
    if (!query.trim()) {
      setSearchQueryError("Please enter a customer name to search");
      setCustomer(null);
      setCustomerFound(false);
      return;
    }
    const response = await axios.get('http://127.0.0.1:8000/api/search-customer', 
        {
            headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
            },
            params: { 
                query : query }
        }
    );

    if(response.status !== 200){
        setSearchQueryError("No customer found with that email");
        // setCustomer(null);
        setCustomerFound(false);
        setCustomerLoading(false);
        return;
    }else{
      setCustomer(response.data.data.customer);
      setCustomerFound(true);
    }
    
    setCustomerLoading(false);
    

    console.log(customer);
    
  };

  const handleonContiuneClick = () => {
    if (customer.id > 0) {
      navigate("/openProject", { state: { customerId: customer.id } });
    } else {
      alert("Please search for a customer first.");
    }
  };

  const handleonCreateAndContinueClick = async()=>{
    if(!name || !email || !address || !phone){
      alert("Please fill all the fields");
      return;
    }
    
    const response = await axios.post('http://127.0.0.1:8000/api/register',
      {
        name: name,
        email: email,
        address: address,
        phone_numbers: [phone],
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
  }

  return (
    <div>
      <div className="flex gap-1 align-baseline contents-center">
        <ArrowLeftCircleIcon
          className="w-6 h-6 my-2 text-black cursor-pointer"
          onClick={() => navigate(-1)}
        />

        <h1 className="mb-4 text-3xl font-bold">New Project</h1>
      </div>

      <div className="flex flex-col items-center w-full max-w-xl p-6 mx-auto bg-white rounded-lg shadow-xl sm:p-8 md:p-10">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">
          Customer Details
        </h2>

        {/* <div className='mb-8'> */}
        {!isNewCustomer && (
          <>
            <div className="flex flex-col items-center justify-center w-full gap-4 mb-2 md:flex-row">
              <div className="relative">
                <input
                  type="text"
                  className="px-4 py-2 pl-10 text-gray-700 bg-gray-100 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Search the customer by email"
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSearchQueryError("");
                  }}
                />
                <svg
                  className="absolute w-5 h-5 text-gray-700 transform left-3 bottom-[11px]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <button
                className="flex-shrink-0 px-5 py-2 text-white transition-colors duration-200 bg-teal-600 rounded-lg cursor-pointer hover:bg-teal-700"
                onClick={searchCustomer}
              >
                Find
              </button>
            </div>
            {searchqueryError && (
              <p className="text-red-500">{searchqueryError}</p>
            )}
          </>
        )}
        {/* </div> */}

                        <div className="flex flex-col w-full gap-4 mt-4">
          <div>
            <label
              htmlFor="name"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              disabled ={!isNewCustomer}
              placeholder="name"
              value={customer?customer.name: name}
              onChange={(e) => {isNewCustomer?setName(e.target.value):null}}
              className="w-full p-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="text"
              placeholder="email"
              disabled ={!isNewCustomer}
              value={customer?customer.email: email}
              onChange={(e) => {isNewCustomer?setEmail(e.target.value):null}}
              className="w-full p-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <input
              id="address"
              type="text"
              disabled ={!isNewCustomer}
              placeholder="address"
              value={customer?customer.address: address}
              onChange={(e) => {isNewCustomer?setAddress(e.target.value):null}}
              className="w-full p-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Tel. No
            </label>
            {customer.phone_numbers && customer.phone_numbers.length > 0 ?(
              <div className="flex flex-row flex-wrap gap-2">
                {customer.phone_numbers.map((phone, index) => (
                <input
                key={index}
              id="phone"
              type="text"
              disabled ={!isNewCustomer}
              placeholder="Tel. No"
              value={phone}
              onChange={(e) => {isNewCustomer?setPhone(e.target.value):null}}
              className="p-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-fit"
            />
              )
            )}
              </div>):(
              <input
              id="phone"
              type="text"
              disabled ={!isNewCustomer}
              placeholder="Tel. No"
              value={phone}
              onChange={(e) => {isNewCustomer?setPhone(e.target.value):null}}
              className="w-full p-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            )}
          </div>
        </div>
        {!isNewCustomer &&(
            <button
          className="px-10 py-2 mt-8 font-semibold text-white transition-colors duration-200 bg-blue-600 rounded-lg cursor-pointer text-m hover:bg-blue-700"
          onClick={handleonContiuneClick}
        >
          Continue
        </button>
        )}

        {
            isNewCustomer&&(
                <button
          className="px-10 py-2 mt-8 font-semibold text-white transition-colors duration-200 bg-blue-600 rounded-lg cursor-pointer text-m hover:bg-blue-700"
          onClick={handleonCreateAndContinueClick}
        >
          Create & Continue
        </button>
            )
        }

        
      </div>
    </div>
  );
}
