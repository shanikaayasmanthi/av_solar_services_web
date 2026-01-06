import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { BASE_URL } from "../constants/BaseUrl.jsx";

const MainPanelWork = ({ serviceId }) => {
  const { token } = useAuth();
  const [mainPanelData, setMainPanelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMainPanelData = async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}api/mainpanel/details`,
          { service_id: serviceId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json'
            }
          }
        );

        const { data } = response;

        if (data.status === 'success' && data.data) {
          setMainPanelData(data.data);
        } else if (data.status === 'no_data') {
          setMainPanelData(null);
          setError(""); // Not an error
        } else {
          setError("Main panel work data not available"); // Real error
        }


      } catch (err) {
        console.error('Error fetching main panel work data:', err);
        setError('Failed to load main panel work details');
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchMainPanelData();
    } else {
      setError('Service ID not provided');
      setLoading(false);
    }
  }, [serviceId, token]);

  const renderReadingCommentRow = (label, data) => (
    <tr>
      <td className="bg-gray-50 font-medium px-4 py-2 border border-gray-300">{label}</td>
      <td className="border border-gray-300 px-4 py-2 text-center">
        {data?.reading ?? data?.value ?? data?.description ?? data?.status ?? '-'}
      </td>
      <td className="border border-gray-300 px-4 py-2 ">{data?.comments ?? '-'}</td>
    </tr>
  );

  const renderSimpleRow = (label, value, comment) => (
    <tr>
      <td className="bg-gray-50 font-medium px-4 py-2 border border-gray-300">{label}</td>
      <td className="border border-gray-300 px-4 py-2 text-center">{value ?? '-'}</td>
      <td className="border border-gray-300 px-4 py-2 ">{comment ?? '-'}</td>
    </tr>
  );

  const renderBooleanRow = (label, checked, comment) => (
    <tr>
      <td className="bg-gray-50 font-medium px-4 py-2 border border-gray-300">{label}</td>
      <td className="border border-gray-300 px-4 py-2 text-center">
        {checked === true ? 'Yes' : checked === false ? 'No' : '-'}
      </td>
      <td className="border border-gray-300 px-4 py-2">{comment ?? '-'}</td>
    </tr>
  );

  const renderStatusRow = (label, data) => (
    <tr>
      <td className="bg-gray-50 font-medium px-4 py-2 border border-gray-300">{label}</td>
      <td className="border border-gray-300 px-4 py-2 text-center">
        {data?.status === 1 ? 'Yes' : data?.status === 0 ? 'No' : data?.status ?? '-'}
      </td>
      <td className="border border-gray-300 px-4 py-2 ">{data?.comments ?? '-'}</td>
    </tr>
  );

  if (loading) return <p className="text-gray-600">Loading main panel work details...</p>;

  if (error) {
    return <p className="text-red-500">{error}</p>; // Real error (e.g., validation, server error)
  }

  if (!mainPanelData) {
    return <p className="text-gray-500 italic">Main panel work details not added yet.</p>; // No data but not error
  }

  return (
    <div className="mt-6 w-full overflow-x-auto ">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Main Panel Work</h2>
      <div className="md:min-w-[600px] flex justify-center">
        <table className="w-[95%] border-collapse text-sm shadow-md rounded overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
                <th className="border p-3 text-left w-[40%]">Activity</th>
                <th className="border p-3 text-left w-[20%]">Reading</th>
                <th className="border p-3 text-left w-[40%]">Comments</th>
            </tr>
          </thead>
            <tbody>
              {renderReadingCommentRow("On Grid Voltage", mainPanelData?.on_grid_voltage)}
              {renderReadingCommentRow("Off Grid Voltage", mainPanelData?.off_grid_voltage)}
              {renderBooleanRow("Inverter Fan Time", mainPanelData?.invertor_fan_time?.checked, mainPanelData?.invertor_fan_time?.comments)}
              {renderBooleanRow("Breaker Service", mainPanelData?.breaker_service?.checked, mainPanelData?.breaker_service?.comments)}
              {renderStatusRow("DC Surge Arrestors", mainPanelData?.dc_surge_arrestors)}
              {renderStatusRow("AC Surge Arrestors", mainPanelData?.ac_surge_arrestors)}
              {renderStatusRow("Inverter MC4 Condition", mainPanelData?.invertor_mc4_condition)}
              {renderReadingCommentRow("Low Voltage Range", mainPanelData?.low_voltage_range)}
              {renderReadingCommentRow("High Voltage Range", mainPanelData?.high_voltage_range)}
              {renderReadingCommentRow("Low Frequency Range", mainPanelData?.low_frequency_range)}
              {renderReadingCommentRow("High Frequency Range", mainPanelData?.high_frequency_range)}
              {renderReadingCommentRow("Inverter Startup Time", mainPanelData?.invertor_startup_time)}
              {renderReadingCommentRow("E Today", mainPanelData?.e_today)}
              {renderReadingCommentRow("E Total", mainPanelData?.e_total)}
              {renderReadingCommentRow("Power Bulb Blinking Style", mainPanelData?.power_bulb_blinking_style)}
              {renderBooleanRow("Alta Vision Sticker", mainPanelData?.alta_vision_sticker?.available, mainPanelData?.alta_vision_sticker?.comments)}
              {renderBooleanRow("Wi-Fi Config Done", mainPanelData?.wifi_config_done?.done, mainPanelData?.wifi_config_done?.comments)}
              {renderSimpleRow("Router Username", mainPanelData?.router_credentials?.username, mainPanelData?.router_credentials?.username_comments)}
              {renderSimpleRow("Router Password", mainPanelData?.router_credentials?.password, mainPanelData?.router_credentials?.password_comments)}
              {renderSimpleRow("Router Serial Number", mainPanelData?.router_credentials?.serial_number, mainPanelData?.router_credentials?.serial_number_comments)}
              {renderBooleanRow("Took Photos", mainPanelData?.took_photos?.status, mainPanelData?.took_photos?.comments)}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default MainPanelWork;