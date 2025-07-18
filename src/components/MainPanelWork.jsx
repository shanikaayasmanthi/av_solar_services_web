import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const MainPanelWork = ({ serviceId }) => {
  const { token } = useAuth();
  const [mainPanelData, setMainPanelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMainPanelData = async () => {
      try {
        const response = await axios.post(
          'http://localhost:8000/api/mainpanel/details',
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
          setError(data.message || 'Main panel work details not found for this service');
        } else {
          setError('Main panel work data not available');
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
      <td className="border border-gray-300 px-4 py-2 text-center">{data?.reading ?? '-'}</td>
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
      <td className="border border-gray-300 px-4 py-2 text-center">{comment ?? '-'}</td>
    </tr>
  );

  if (loading) return <p className="text-gray-600">Loading main panel work details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

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
            {renderReadingCommentRow("Inverter Service Fan Time", mainPanelData?.invertor_service_fan_time)}
            {renderReadingCommentRow("Breaker Service", mainPanelData?.breaker_service)}
            {renderReadingCommentRow("DC Surge Arrestors", mainPanelData?.DC_surge_arrestors)}
            {renderReadingCommentRow("AC Surge Arrestors", mainPanelData?.AC_surge_arrestors)}
            {renderReadingCommentRow("MC4 Condition", mainPanelData?.invertor_connection_MC4_condition)}
            {renderReadingCommentRow("Startup Time", mainPanelData?.invertor_startup_time)}
            {renderReadingCommentRow("E Today", mainPanelData?.e_today_invertor)}
            {renderReadingCommentRow("E Total", mainPanelData?.e_total_invertor)}
            {renderBooleanRow("Alta Vision Sticker", mainPanelData?.alta_vision_sticker?.checked, mainPanelData?.alta_vision_sticker?.comments)}
            {renderBooleanRow("Wi-Fi Config Done", mainPanelData?.wifi_config_done?.checked, mainPanelData?.wifi_config_done?.comments)}
            {renderSimpleRow("Router Username", mainPanelData?.router_username, mainPanelData?.router_username_comments)}
            {renderSimpleRow("Router Password", mainPanelData?.router_password, mainPanelData?.router_password_comments)}
            {renderSimpleRow("Router Serial Number", mainPanelData?.router_serial_number, mainPanelData?.router_serial_number_comments)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MainPanelWork;