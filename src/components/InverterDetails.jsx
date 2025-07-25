import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const InverterDetails = ({ projectId }) => {
  const { token } = useAuth();
  const [inverterData, setInverterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [noOfInvertersAllowed, setNoOfInvertersAllowed] = useState(null);

  const fetchInverterData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/get-inverters', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          project_id: projectId
        }
      });
      
      if (response.status === 200) {
        setInverterData(response.data.data.inverters || []);
        setNoOfInvertersAllowed(response.data.data.no_of_inverters_allowed);
      } else {
        setError(response.data.message || "Failed to fetch inverter data.");
      }
    } catch (error) {
      console.error("Error fetching inverter data:", error);
      if (error.response && error.response.status === 404) {
        setError("No inverter data available.");
      } else {
        setError("An error occurred while fetching inverter data.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchInverterData();
    }
  }, [projectId]);

  if (loading) return <p className="text-gray-600">Loading inverter details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-6 w-full overflow-x-auto">
      <h2 className="text-lg font-semibold mb-5 text-gray-800">Inverter Details</h2>


      <div className="mb-5 font-semibold text-left text-gray-600">
        Current Inverters in Project: {inverterData.length}
        {noOfInvertersAllowed !== undefined && `, Allowed: ${noOfInvertersAllowed}`}
      </div>
      <div className="md:min-w-[600px] flex justify-center mb-5">
        <table className="w-[95%] border-collapse text-sm shadow-md rounded overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border px-4 py-2 text-left">Brand</th>
              <th className="border px-4 py-2 text-left">Model No</th>
              <th className="border px-4 py-2 text-left">Check Code</th>
              <th className="border px-4 py-2 text-left">Serial No</th>
              <th className="border px-4 py-2 text-left">Capacity (kW)</th>
            </tr>
          </thead>
          <tbody>
            {inverterData.length > 0 ? (
              inverterData.map((inverter, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{inverter.brand || '-'}</td>
                  <td className="border px-4 py-2">{inverter.invertor_model_no || '-'}</td>
                  <td className="border px-4 py-2">{inverter.invertor_check_code || '-'}</td>
                  <td className="border px-4 py-2">{inverter.invertor_serial_no || '-'}</td>
                  <td className="border px-4 py-2">{inverter.invertor_capacity || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="border px-4 py-2 text-center text-gray-500">
                  No inverter data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InverterDetails;