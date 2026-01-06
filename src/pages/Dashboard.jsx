import React, { useEffect, useState } from 'react'
import DashboardCard from '../components/DashboardCard'
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import ServiceSummary from '../components/MonthlySummaryReport';
import AnnualServiceSummary from '../components/AnnualSummaryReport';
import { BASE_URL } from "../constants/BaseUrl.jsx";

export default function Dashboard() {

  const {token} = useAuth();

  const [projectCount, setProjectCount] = useState(0);
  const [holdProjectCount, setHoldProjectCount] = useState(0);
  const [firstServiceCount, setFirstServiceCount] = useState(0);
  const [secondServiceCount, setSecondServiceCount] = useState(0);

  const fetchProjectCount = async()=>{
    try{
      const response = await axios.get(`${BASE_URL}api/get-project-count`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      }
    )
     console.log(response.data);
if(response.data && response.data.success === true){
  setProjectCount(response.data.data.project_count);
}else{
      console.warn("Unexpected response status:", response.status);
    }
    
    }catch(error){
      console.error("Error fetching project count:", error);
    }
  }

    const fetchHoldProjectCount = async()=>{
    try{
      const response = await axios.get(`${BASE_URL}api/get-hold-project-count`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      }
    )
     console.log(response.data);
if(response.data && response.data.success === true){
  setHoldProjectCount(response.data.data.hold_project_count);
}else{
      console.warn("Unexpected response status:", response.status);
    }
    
    }catch(error){
      console.error("Error fetching project count:", error);
    }
  }

  const fetchServiceCounts = async()=>{
    try{
      const response =await axios.get(`${BASE_URL}api/get-service-counts`,
        {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      }
      )
      // console.log(response.data);
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
    fetchHoldProjectCount();
  },[])
  
  return (
    <div className="origin-top-left scale-[0.75] w-[133.33%] max-h-[80vh]">
    <div> {/* Added bg-gray-100 to main content for context */}
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 ml-4 md:grid-cols-4">
        <DashboardCard title="Total Projects" value={projectCount} />
        <DashboardCard title="First Service Done on" value={firstServiceCount} />
        <DashboardCard title="Second Service Done on" value={secondServiceCount} />
        <DashboardCard title="Hold Projects" value={holdProjectCount} />
      </div>
        {/* Add the ServiceSummary component below the cards */}
        <div className="mt-8">
          <ServiceSummary />
        </div>

        <div className="mt-8">
          <AnnualServiceSummary />

        </div>

    </div>
    </div>
  )
}
