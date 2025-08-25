import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftCircleIcon, XCircleIcon } from "@heroicons/react/16/solid";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

export default function ExternalCustomerDetails() {
  const navigate = useNavigate();
  const { token } = useAuth();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nic, setNic] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState([""]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

    // Search state
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");

  // Phone number handlers
  const handleAddPhoneNumber = () => setPhoneNumbers([...phoneNumbers, ""]);
  const handlePhoneNumberChange = (index, value) => {
    const updated = [...phoneNumbers];
    updated[index] = value;
    setPhoneNumbers(updated);
  };
  const handleRemovePhoneNumber = (index) => {
    const updated = phoneNumbers.filter((_, i) => i !== index);
    setPhoneNumbers(updated);
  };

const handleCreateExternalCustomer = async () => {
  try {
    setError(null);
    setSuccessMessage("");

    const formData = {
      name,
      email,
      address,
      nic, 
      phone_no: phoneNumbers[0],
    };

    const response = await axios.post(
      "http://127.0.0.1:8000/api/add-external-customers",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    const customer = response.data.data;
    setSuccessMessage("Customer created successfully.");
    navigate("/openProject", { state: { customerId: customer.id } });
  } catch (err) {
    if (err.response?.data?.message) {
      setError(err.response.data.message);
    } else {
      setError("Failed to create customer. Please try again.");
    }
  }
};

const handleSearchCustomer = async () => {
  try {
    setSearchError("");
    setSearchResult(null);

    const response = await axios.get(
      "http://127.0.0.1:8000/api/find-external-customer",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        params: query.includes("@") ? { email: query } : { name: query },
      }
    );

    if (response.data.success && response.data.data.length > 0) {
      setSearchResult(response.data.data[0]); // or handle multiple matches
    } else {
      setSearchError("No customer found.");
    }
  } catch (err) {
    console.error(err);
    setSearchError("An error occurred during search.");
  }
};


  return (
       <div className="origin-top-left scale-[0.75] w-[133.33%]">
    <div className="relative">
      <div className="flex items-center gap-2 mb-6">
        <ArrowLeftCircleIcon
          className="w-6 h-6 text-black cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-3xl font-bold">Customer Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Column: New External Customer */}
        <div className="bg-white p-6 shadow-lg rounded-lg w-[650px]">
          <h2 className="text-xl font-semibold mb-4">New External Customer</h2>
          
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className=" w-[500px] p-2 bg-gray-100 border rounded"
            />
            <input
              type="nic"
              placeholder="NIC"
              value={nic}
              onChange={(e) => setNic(e.target.value)}
              className="w-[500px] p-2 bg-gray-100 border rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-[500px] p-2 bg-gray-100 border rounded"
            />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-[500px] p-2 bg-gray-100 border rounded"
            />

            <div>
              {phoneNumbers.map((phone, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) =>
                      handlePhoneNumberChange(index, e.target.value)
                    }
                    className="w-[500px] p-2 bg-gray-100 border rounded"
                  />
                  {phoneNumbers.length > 1 && (
                    <XCircleIcon
                      className="w-5 h-5 text-red-500 cursor-pointer"
                      onClick={() => handleRemovePhoneNumber(index)}
                    />
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddPhoneNumber}
                className="text-blue-600 text-sm mt-1 hover:underline"
              >
                + Add another phone number
              </button>
            </div>

            {error && <p className="text-red-500">{error}</p>}
            {successMessage && <p className="text-green-600">{successMessage}</p>}

            <button
              onClick={handleCreateExternalCustomer}
              className="flex justify-center items-center w-[150px] ml-30 mt-4 px-2 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
            >
              Create & Continue
            </button>
          </div>
          
        </div>

        {/* Right Column: Search External Customer */}
        <div className="bg-white p-6 shadow-lg rounded-lg w-[650px]">
          <h2 className="text-xl font-semibold mb-4">Find Existing Customer</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search the customer by"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-2 bg-gray-100 border rounded"
              />
              <button
                onClick={handleSearchCustomer}
                className="w-[120px] px-2 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
              >
                Find
              </button>
            </div>

            {searchError && <p className="text-red-500">{searchError}</p>}

{searchResult && (
  <div className="mt-6 p-6 border rounded bg-white shadow-md">
    <h3 className="text-xl font-semibold mb-4 text-blue-700">Customer Found</h3>
    
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-gray-600 font-medium">Name</label>
        <div className="border px-3 py-2 rounded bg-gray-100 text-gray-800">
          {searchResult.name}
        </div>
      </div>

      <div>
        <label className="block text-gray-600 font-medium">Email</label>
        <div className="border px-3 py-2 rounded bg-gray-100 text-gray
        -800">
          {searchResult.email}
        </div>
      </div>

      <div>
        <label className="block text-gray-600 font-medium">NIC</label>
        <div className="border px-3 py-2 rounded bg-gray-100 text-gray-800">
          {searchResult.nic}
        </div>
      </div>

      <div>
        <label className="block text-gray-600 font-medium">Phone</label>
        <div className="border px-3 py-2 rounded bg-gray-100 text-gray-800">
          {searchResult.phone_no}
        </div>
      </div>

      <div className="col-span-2">
        <label className="block text-gray-600 font-medium">Address</label>
        <div className="border px-3 py-2 rounded bg-gray-100 text-gray-800">
          {searchResult.address}
        </div>
      </div>
    </div>

    <div className="mt-6 text-right">
      <button
        className="px-5 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-200"
        onClick={() =>
          navigate("/openProject", {
            state: { customerId: searchResult.id },
          })
        }
      >
        Continue
      </button>
    </div>
  </div>
)}


          </div>
        </div>
      </div>
    </div>
    </div>
  );
}