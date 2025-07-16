import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const OutdoorWork = ({ serviceId }) => {
  const { token } = useAuth();
  const [outdoorData, setOutdoorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOutdoorWorkData = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/api/outdoor-work/details',
          {
            params: { service_id: serviceId },
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json'
            }
          }
        );

       const { data } = response;

      if (data.status === 'success' && data.data) {
        setOutdoorData(data.data);
      } else if (data.status === 'no_data') {
        setError(data.message || 'Outdoor work details not found for this service');
      } else {
        setError('Outdoor work data not available');
      }

      } catch (err) {
        console.error('Error fetching outdoor work data:', err);
        setError('Failed to load outdoor work details');
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchOutdoorWorkData();
    } else {
      setError('Service ID not provided');
      setLoading(false);
    }
  }, [serviceId, token]);

  const renderReadingCell = (value) => (
    <td className="border px-4 py-2 text-center">
      {value || '-'}
    </td>
  );

  const renderBooleanCell = (value) => (
    <td className="border px-4 py-2 text-center">
      {value ? 'Yes' : 'No'}
    </td>
  );

  const renderCommentCell = (comment) => (
    <td className="border px-4 py-2">
      {comment || '-'}
    </td>
  );

  if (loading) return <p className="text-gray-600">Loading outdoor work details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-6 w-full overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Outdoor Work</h2>
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
            {/* CEB Import Reading */}
            <tr>
              <td className="border px-4 py-2 font-medium bg-gray-50">CEB Import Reading</td>
              {renderReadingCell(outdoorData.CEB_import.reading)}
              {renderCommentCell(outdoorData.CEB_import.comments)}
            </tr>

            {/* CEB Export Reading */}
            <tr>
              <td className="border px-4 py-2 font-medium bg-gray-50">CEB Export Reading</td>
              {renderReadingCell(outdoorData.CEB_export.reading)}
              {renderCommentCell(outdoorData.CEB_export.comments)}
            </tr>

            {/* Ground Resistance */}
            <tr>
              <td className="border px-4 py-2 font-medium bg-gray-50">Ground Resistance</td>
              {renderReadingCell(outdoorData.ground_resistance.reading)}
              {renderCommentCell(outdoorData.ground_resistance.comments)}
            </tr>

            {/* Earthing Rod Connection */}
            <tr>
              <td className="border px-4 py-2 font-medium bg-gray-50">Earthing Rod Connection</td>
              {renderBooleanCell(outdoorData.earthing_rod.checked)}
              {renderCommentCell(outdoorData.earthing_rod.comments)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OutdoorWork;