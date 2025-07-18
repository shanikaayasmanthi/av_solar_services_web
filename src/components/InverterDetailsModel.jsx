import React, { useState, useEffect } from 'react';
import ImageIcon from '@mui/icons-material/Image';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import DCDetails from '../components/DCDetails';
import ACDetails from '../components/ACDetails'; 
import axios from 'axios';
import { useAuth } from "../contexts/AuthContext";

const ServiceDetail = () => {
  const { token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [projectId, setProjectId] = useState(null);
  const [invertors, setInvertors] = useState([]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('project_id');
    setProjectId(id);
  }, [location.search]);

  useEffect(() => {
    if (!projectId || !token) return;

    const fetchInvertors = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/api/get-inverters',
          {
            params: { project_id: projectId },
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          }
        );
        setInvertors(response.data.data.inverters || []);
      } catch (err) {
        console.error("Error fetching inverter data:", err);
        setInvertors([]);
      }
    };

    fetchInvertors();
  }, [projectId, token]);

  return (
    <div>
      <h2>Inverter Details</h2>
      {invertors.length > 0 ? (
        invertors.map((inv, index) => (
          <div key={index}>
            <p><strong>Model:</strong> {inv.model}</p>
            <p><strong>Serial No:</strong> {inv.serial_no}</p>
            <hr />
          </div>
        ))
      ) : (
        <p>No inverter data available.</p>
      )}
    </div>
  );
};

export default ServiceDetail;
