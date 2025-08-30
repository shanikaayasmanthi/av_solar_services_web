import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { ArrowLeftCircleIcon, CalendarDateRangeIcon } from '@heroicons/react/16/solid';
import CustomerCard from '../components/CustomerCard';
import OngridProjectDataCard from '../components/OngridProjectDataCard';
import ServiceSummaryCard from '../components/ServiceSummaryCard';
import OffgridProjectDataCard from '../components/OffgridProjectDetails';
import ScheduleServiceModel from '../components/ScheduleServiceModel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ProjectDetails = () => {
    const [schedule, setSchedule] = useState(false);
    const projectId = useParams().id;
    const navigate = useNavigate();    
    
    const [project, setProject] = useState({});
    const [offGrid, setOffGrid] = useState({});
    const [onGrid, setOnGrid] = useState({});
    const {token} = useAuth();
    const [servicesSummary, setServicesSummary] = useState([]);
  const [projectLoading, setProjectLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summeryError, setSummeryError] = useState(null);
  const fetchProjectData = async()=>{
    try{
        const projectResponse = await axios.get(`http://127.0.0.1:8000/api/get-project`,
            {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            project_id: projectId
          }
        }
        );

        console.log("project id", projectId);
        console.log("API Response:", projectResponse.data);
        // console.log(projectResponse.data);
        if(projectResponse.data.status === "Request was successful." || projectResponse.data.success === true){
            const projectResponseData = projectResponse.data.data;
            setProject(projectResponseData.project);
            if(projectResponseData.project.type == 'offgrid'){
                setOffGrid(projectResponseData.off_grid_hybrid);
            }else{
                setOnGrid(projectResponseData.on_grid);
            }
        } else {
            console.error("Unexpected response structure:", projectResponse.data);
        }
        
    }catch(error){
        console.error("Error fetching project data:", error);
    }finally{
        setProjectLoading(false);
    }
  }

  const fetchServiceSummary = async()=>{
    try{
      const servicesResponse = await axios.get('http://127.0.0.1:8000/api/get-services-summary',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            project_id: projectId
          }
        }
      );

      if(servicesResponse.status === 200){
        const servicesData = servicesResponse.data.data.services;
        // console.log("Services Summary Data:", servicesData);
        
        setServicesSummary(servicesData);
        setSummaryLoading(false);
        
      }else if(servicesResponse.status === 404){
        setSummaryLoading(false);
        setSummeryError("No Services Done for this project.");
      }else{
        console.error("Failed to fetch service summary:", servicesResponse.data.message);
        setSummeryError("Failed to fetch service summary.");
        setSummaryLoading(false);
      }
    }catch(error){
        console.error("Error fetching service summary:", error);
        setSummeryError("An error occurred while fetching service summary.");
    }
  }

  useEffect(()=>{
    fetchProjectData();
    fetchServiceSummary();
    
  },[]);

  return (
    <div className="origin-top-left scale-[0.75] w-[133.33%]">
      {/* <div> */} 
      {!projectLoading &&  project?.type &&
      (
        <>
            <div className='flex gap-1 align-baseline contents-center'>
<div 
  className='flex items-center justify-center w-10 h-10 bg-transparent text-black cursor-pointer 
             hover:bg-teal-100 rounded-md transition-colors duration-200' 
  onClick={() => navigate(-1)}
>
  <ArrowBackIcon fontSize='medium' />
</div>


              {/* <ArrowLeftCircleIcon className='w-6 h-6 my-2 text-black cursor-pointer' onClick={() => navigate(-1)}/> */}
              <h1 className="mb-6 text-3xl font-bold">Project No :{project.type=='ongrid'?onGrid.on_grid_project_id:offGrid.off_grid_hybrid_project_id}({project.type})</h1>

            </div>

  <div className="flex flex-col flex-wrap gap-5 md:flex-row justify-center">
    <div className="flex flex-col gap-5">

<CustomerCard projectId={projectId}/>
      <div
        className="bg-white rounded-lg border border-gray-300 p-5 flex-1 min-w-[600px] h-[100px]"
      >
        <div className="flex justify-between items-center mb-2.5">
          <h3 className="m-0 text-lg font-semibold">Services Summary</h3>
          {/* <PrintIcon
            className="rounded-full bg-[#00a68b] p-1.5 cursor-pointer" fontSize='medium'
            onClick={() => setSchedule(true)}
          /> */}
          <CalendarDateRangeIcon className="icon h-8 w-8 bg-teal-600 text-white rounded-md p-1 cursor-pointer hover:bg-teal-700 hover:transform hover:scale-105 transition-transform duration-200" 
            onClick={() => setSchedule(true)}
          />
          {/* <ScheduleService show={schedule} onClose={() => setSchedule(false)} /> */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-2.5">
          {!summaryLoading && servicesSummary.length > 0 ? (
               servicesSummary.map((service) => (
                                            <ServiceSummaryCard 
                                                key={service.service_id} 
                                                service={service}
                                                project_id={projectId}
                                                project_no={project.type === 'ongrid' ? onGrid.on_grid_project_id : offGrid.off_grid_hybrid_project_id}
                                                customer_name={project.customer_name?.name}
                                                nearest_town={project.nearest_town}
                                                power={service.power}
                                                power_time={service.power_time}
                                            />
                                        ))
          ):(<div>
            {summeryError ? (
              <p className="text-red-500">{summeryError}</p>
            ) : (
              <p>No services available.</p>
            )}
          </div>)}
        </div>
      </div>
    </div>

    <div
      className="bg-white rounded-lg border border-gray-300 p-5 flex-1 min-w-[600px]"
    >
{ project.type == 'ongrid'
  ? (
      <OngridProjectDataCard 
        project={project}
        onGrid={onGrid}
        offGrid={offGrid}
        setProject={setProject}
        setOnGrid={setOnGrid}
        setOffGrid={setOffGrid}

      />
    )
  : (
      <OffgridProjectDataCard 
        project={project}
        onGrid={onGrid}
        offGrid={offGrid}
        setProject={setProject}
        setOnGrid={setOnGrid}
        setOffGrid={setOffGrid}

      />
    )
}

      
    </div>
  </div>
        </>
        )}

        {schedule && (
          <ScheduleServiceModel show={schedule} onClose={() => setSchedule(false)} projectId={project.id} />
        )}
    </div>
    

  )
  

}

export default ProjectDetails
