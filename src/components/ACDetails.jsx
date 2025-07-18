import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const ACDetails = ({ serviceId }) => {
  const { token } = useAuth();
  const [acData, setAcData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchACData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/ac/details-by-service-id", {
          params: { service_id: serviceId },
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        if (response.data) {
          setAcData(response.data);
        } else {
          setError("AC data not available.");
        }
      } catch (err) {
  console.error("Error fetching AC data:", err.response?.data || err.message);
  
  if (err.response && err.response.status === 404) {
    setError(err.response.data.message || "AC data not found.");
  } else {
    setError("Failed to load AC data.");
  }

  setLoading(false);
  return;

}

finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchACData();
    } else {
      setError("Service ID not provided.");
      setLoading(false);
    }
  }, [serviceId]);

  const renderRow = (label, prefix) => (
    <tr>
      <td className="border px-2 py-2 w-[250px] font-medium bg-gray-50 whitespace-nowrap">{label}</td>
      {[
        "L1_L2", "L2_L3", "L1_L3",
        "L1_N", "L2_N", "L3_N",
        "N_E"
      ].map((phase, i) => (
        <td key={i} className="border px-2 py-2 text-center text-sm sm:text-base">
          {acData ? acData[`${prefix}_${phase}`] ?? "-" : "-"}
        </td>
      ))}
    </tr>
  );

  if (loading) return <p className="text-gray-600">Loading AC details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-6 w-full overflow-x-auto">
      <h2 className="text-lg font-semibold mb-5 text-gray-800">AC Service Details</h2>
      <div className="md:min-w-[600px] flex justify-center">
        <table className="w-[95%] border-collapse text-sm shadow-md  rounded overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border  px-2 py-2 text-left">AC</th>
              {["L1-L2", "L2-L3", "L1-L3", "L1-N", "L2-N", "L3-N", "N-E"].map((label, i) => (
                <th key={i} className="border px-3 py-3 text-center">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {renderRow("O/C Voltage", "OC_valtage")}
            {renderRow("Load Voltage", "load_valtage")}
            {renderRow("Load Current", "load_current")}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ACDetails;
