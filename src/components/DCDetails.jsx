import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const DCDetails = ({ serviceId }) => {
  const { token } = useAuth();
  const [dcData, setDcData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDCData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/dc/details-by-service-id", {
          params: {
            service_id: serviceId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        if (response.data) {
          setDcData(response.data);
        } else {
          setError("DC data not available.");
        }
      } catch (err) {
  console.error("Error fetching DC data:", err.response?.data || err.message);

  if (err.response && err.response.status === 404) {
    setError(err.response.data.message || "DC data not found.");
  } else {
    setError("Failed to load DC data.");
  }

  setLoading(false);
  return
}
 finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchDCData();
    } else {
      setError("Service ID not provided.");
      setLoading(false);
    }
  }, [serviceId]);

  const renderRow = (label, prefix) => (
    <tr>
      <td className="border px-2 py-2 font-medium w-[250px] bg-gray-50 whitespace-nowrap">{label}</td>
      {[...Array(8)].map((_, i) => (
        <td key={i} className="border px-2 py-2 text-center text-sm sm:text-base">
          {dcData ? dcData[`${prefix}_string_${i + 1}`] ?? "-" : "-"}
        </td>
      ))}
    </tr>
  );

  if (loading) return <p className="text-gray-600">Loading DC details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-6 w-full overflow-x-auto">
      <h2 className="text-lg font-semibold mb-5 text-gray-800">DC Service Details</h2>
      <div className="md:min-w-[600px] flex justify-center">
        <table className="w-[95%] border-collapse text-sm shadow-md rounded overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border px-2 py-2 text-left">DC</th>
              {[...Array(8)].map((_, i) => (
                <th key={i} className="border px-3 py-3 text-center">String {i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody >
            {renderRow("O/C Voltage", "OC_valtage")}
            {renderRow("Load Voltage", "load_valtage")}
            {renderRow("Load Current", "load_current")}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DCDetails;
