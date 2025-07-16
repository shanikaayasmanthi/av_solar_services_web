import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext.jsx"; // Ensure this path is correct

const NewProjectOpen = () => {
  const { token } = useAuth();
  const location = useLocation();
  // Ensure customer_id is correctly extracted from location.state.customer.id
  const customer_id = location.state?.customerId||null;

  const [formData, setFormData] = useState({
    project_name:"",
    project_address: "",
    no_of_panels: "",
    project_no:null,
    type: "", // 'on_grids' or 'offgridhybrids'
    system_capacity: "", // Added for panel capacity
    project_installation_date: "",
    nearest_town: "", // Corrected typo from 'neatest_town' to 'nearest_town'
    service_years_in_agreement: "",
    service_rounds_in_agreement: "",
    customer_id: customer_id || null, // Important!
  });

  // Log customer_id to ensure it's being received
  useEffect(() => {
    console.log("Customer ID received:", customer_id);
    if (customer_id) {
      setFormData((prevData) => ({
        ...prevData,
        customer_id: customer_id,
      }));
    }
  }, [customer_id]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/openproject",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      console.log("Project created:", response.data);
      alert("Project opened successfully!");
      // Optionally, navigate to another page or clear form
      setFormData({ // Clear form after successful submission
        project_address: "",
        no_of_panels: "",
        type: "",
        project_installation_date: "",
        system_capacity: "",
        project_name: "",
        nearest_town: "",
        service_years_in_agreement: "",
        service_rounds_in_agreement: "",
        customer_id: customer_id || "",
        project_no:null,
      });

    } catch (error) {
      console.error(
        "Error opening project:",
        error.response?.data || error.message
      );
      alert("Error creating project: " + (error.response?.data?.message || "Please check console for details."));
    }
  };

  return (
    <>
      {/* Title "New Project" outside the form container, similar to your previous "Customer Details" page */}
      <h1 className="mb-4 text-3xl font-bold">
        New Project
      </h1>

      <div className="w-full max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-xl sm:p-8 md:px-10 md:py-6">
        <h2 className="mb-4 text-2xl font-bold text-center text-gray-800">
          Project Details
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-6 md:flex-row md:gap-10">
            {/* Left Side */}
            <div className="flex flex-col flex-1 gap-4">
            <label htmlFor="project_address" className="block text-sm font-medium text-gray-700">
                Project Name
              </label>
              <input
                id="project_name"
                name="project_name"
                value={formData.project_name}
                onChange={handleChange}
                type="text"
                placeholder="project name"
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              />
              <label htmlFor="project_address" className="block text-sm font-medium text-gray-700">
                Site address
              </label>
              <input
                id="project_address"
                name="project_address"
                value={formData.project_address}
                onChange={handleChange}
                type="text"
                placeholder="site address"
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              />

              <label htmlFor="no_of_panels" className="block mt-2 text-sm font-medium text-gray-700">
                No of panels
              </label>
              <input
                id="no_of_panels"
                name="no_of_panels"
                value={formData.no_of_panels}
                onChange={handleChange}
                type="text"
                placeholder="no of panels"
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              />

              <label htmlFor="type" className="block mt-2 text-sm font-medium text-gray-700">
                Solar system type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2 pr-8 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              >
                <option value="">Select type</option>
                <option value="on_grid">On-grid</option>
                <option value="off_grid&hybrid">Off-grid & Hybrid</option>
              </select>
            </div>

            {/* Right Side */}
            <div className="flex flex-col flex-1 gap-4">
            <div className="flex flex-col gap-4 mt-2 sm:flex-row">
                <div className="flex flex-col flex-1 gap-4">
                  <label htmlFor="system_capacity" className="block text-sm font-medium text-gray-700">
                System Capacity (kW)
              </label>
              <input
                id="system_capacity"
                name="system_capacity"
                value={formData.system_capacity}
                onChange={handleChange}
                type="number"
                placeholder="system capacity in kW"
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              />
                </div>

                <div className="flex flex-col flex-1 gap-4">
                  <label htmlFor="project_no" className="block text-sm font-medium text-gray-700">
                    Project No
                  </label>
                  <input
                    id="project_no"
                    name="project_no"
                    value={formData.project_no}
                    onChange={handleChange}
                    type="text"
                    placeholder="project no"
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  />
                </div>
              </div>
            
              <label htmlFor="project_installation_date" className="block text-sm font-medium text-gray-700">
                Date to Start Project
              </label>
              <input
                id="project_installation_date"
                name="project_installation_date"
                value={formData.project_installation_date}
                onChange={handleChange}
                type="date"
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              />

              <label htmlFor="nearest_town" className="block mt-2 text-sm font-medium text-gray-700">
                Nearest Town
              </label>
              <input
                id="nearest_town"
                name="nearest_town"
                value={formData.nearest_town}
                onChange={handleChange}
                type="text"
                placeholder="nearest town"
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              />

              <div className="flex flex-col gap-4 mt-2 sm:flex-row">
                {/* Service Years */}
                <div className="flex flex-col flex-1 gap-4">
                  <label htmlFor="service_years_in_agreement" className="block text-sm font-medium text-gray-700">
                    Service Years
                  </label>
                  <input
                    id="service_years_in_agreement"
                    name="service_years_in_agreement"
                    value={formData.service_years_in_agreement}
                    onChange={handleChange}
                    type="text"
                    placeholder="years"
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  />
                </div>

                {/* Service Rounds */}
                <div className="flex flex-col flex-1 gap-4">
                  <label htmlFor="service_rounds_in_agreement" className="block text-sm font-medium text-gray-700">
                    Service rounds
                  </label>
                  <input
                    id="service_rounds_in_agreement"
                    name="service_rounds_in_agreement"
                    value={formData.service_rounds_in_agreement}
                    onChange={handleChange}
                    type="text"
                    placeholder="rounds"
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit" // Important: set type="submit" for form button
            className="self-center px-10 py-2 mt-2 font-semibold text-white transition-colors duration-200 bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
          >
            Open Project
          </button>
        </form>
      </div>
      </>
  );
};

export default NewProjectOpen;