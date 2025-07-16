import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const RoofWork = ({ serviceId }) => {
  const { token } = useAuth();
  const [roofData, setRoofData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRoofWorkData = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/api/roof-work/details',
          {
            params: { service_id: serviceId },
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json'
            }
          }
        );

        if (response.data && response.data.data) {
          setRoofData(response.data.data);
        } else {
          setError('Roof work data not available');
        }
      } catch (err) {
        console.error('Error fetching roof work data:', err);
        setError('Failed to load roof work details');
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchRoofWorkData();
    } else {
      setError('Service ID not provided');
      setLoading(false);
    }
  }, [serviceId, token]);

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

  if (loading) return <p className="text-gray-600">Loading roof work details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-6 w-full overflow-x-auto">
      <h2 className="text-lg font-semibold mb-2 text-gray-800">Roof Work</h2>
      <div className="min-w-[700px]">
        <table className="w-full border-collapse text-sm shadow-md rounded overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border px-4 py-2 text-left">Activity</th>
              <th className="border px-4 py-2 text-left">Reading</th>
              <th className="border px-4 py-2 text-left">Comments</th>
            </tr>
          </thead>
          <tbody>
            {/* Cloudiness */}
            <tr>
              <td className="border px-4 py-2 font-medium bg-gray-50">Cloudiness</td>
              <td className="border px-4 py-2 text-center">{roofData.cloudness.reading}</td>
              {renderCommentCell(roofData.cloudness.comments)}
            </tr>

            {/* Panel Service */}
            <tr>
              <td className="border px-4 py-2 font-medium bg-gray-50">Panel Service</td>
              {renderBooleanCell(roofData.panel_service.checked)}
              {renderCommentCell(roofData.panel_service.comments)}
            </tr>

            {/* Structure Service */}
            <tr>
              <td className="border px-4 py-2 font-medium bg-gray-50">Structure Service</td>
              {renderBooleanCell(roofData.structure_service.checked)}
              {renderCommentCell(roofData.structure_service.comments)}
            </tr>

            {/* Nut & Bolt Condition */}
            <tr>
              <td className="border px-4 py-2 font-medium bg-gray-50">Condition and tightness of nut & bolt</td>
              {renderBooleanCell(roofData.nut_bolt_condition.checked)}
              {renderCommentCell(roofData.nut_bolt_condition.comments)}
            </tr>

            {/* Shadow */}
            <tr>
              <td className="border px-4 py-2 font-medium bg-gray-50">Shadow</td>
              {renderBooleanCell(roofData.shadow.checked)}
              {renderCommentCell(roofData.shadow.comments)}
            </tr>

            {/* Panel MC4 Condition */}
            <tr>
              <td className="border px-4 py-2 font-medium bg-gray-50">Panel MC4 Condition</td>
              {renderBooleanCell(roofData.panel_MC4_condition.checked)}
              {renderCommentCell(roofData.panel_MC4_condition.comments)}
            </tr>

            {/* Took Photos */}
            <tr>
              <td className="border px-4 py-2 font-medium bg-gray-50">Took Photos</td>
              {renderBooleanCell(roofData.took_photos.checked)}
              {renderCommentCell(roofData.took_photos.comments)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoofWork;