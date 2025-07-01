import React, { useEffect, useState } from 'react'
import DashboardCard from '../components/DashboardCard'
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {

  const {token} = useAuth();

  const [projectCount, setProjectCount] = useState(0);
  const [firstServiceCount, setFirstServiceCount] = useState(0);
  const [secondServiceCount, setSecondServiceCount] = useState(0);

  const fetchProjectCount = async()=>{
    try{
      const response = await axios.get('http://127.0.0.1:8000/api/get-project-count',
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      }
    )
    console.log(response.data);
    if(response.data.status ==='Request was successful.'){
      setProjectCount(response.data.data.project_count);
      
    }else{
      console.warn("Unexpected response status:", response.status);
    }
    
    }catch(error){
      console.error("Error fetching project count:", error);
    }
  }

  const fetchServiceCounts = async()=>{
    try{
      const response =await axios.get('http://127.0.0.1:8000/api/get-service-counts',
        {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      }
      )
      console.log(response.data);
    if(response.data.status ==='Request was successful.'){
      setFirstServiceCount(response.data.data.first_service_count);
      setSecondServiceCount(response.data.data.second_service_count);
      
    }else{
      console.warn("Unexpected response status:", response.status);
    }
    }catch(error){
      console.error("Error fetching service counts:", error);
    
    }
  }

  useEffect(()=>{
    fetchProjectCount();
    fetchServiceCounts();
  },[])
  
  return (
    <div> {/* Added bg-gray-100 to main content for context */}
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 ml-4 md:grid-cols-3">
        <DashboardCard title="Total Projects" value={projectCount} />
        <DashboardCard title="First Service Done on" value={firstServiceCount} />
        <DashboardCard title="Second Service Done on" value={secondServiceCount} />
      </div>
    </div>
  )
}
