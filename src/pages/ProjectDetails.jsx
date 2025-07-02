import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import PrintIcon from '@mui/icons-material/Print';
import { CalendarDateRangeIcon, InformationCircleIcon } from '@heroicons/react/16/solid';
import CustomerCard from '../components/CustomerCard';
import ProjectDataCard from '../components/OngridProjectDataCard';

const ProjectDetails = () => {
    const [showModel, setShowModel] = useState(false);
    const [schedule, setSchedule] = useState(false);
    const projectId = useParams().id;

    const [project, setProject] = useState({});
    const [battery, setBattery] = useState([]);
    const [inverter, setInverter] = useState([]);
    const [solarPanel, setSolarPanel] = useState([]);
    const [offGrid, setOffGrid] = useState({});
    const [onGrid, setOnGrid] = useState({});
    const {token} = useAuth();
  const [projectLoading, setProjectLoading] = useState(true);
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
        console.log(projectResponse.data);
        if(projectResponse.data.status === "Request was successful."){
            const projectResponseData = projectResponse.data.data;
            setProject(projectResponseData.project);
            setCustomer(projectResponseData.customer);
            setInverter(projectResponseData.inverter);
            setSolarPanel(projectResponseData.solar_panel);
            if(projectResponseData.project.type == 'offgrid'){
                setOffGrid(projectResponseData.off_grid_hybrid);
                setBattery(projectResponseData.battery);
            }else{
                setOnGrid(projectResponseData.on_grid);
            }
        }
        
    }catch(error){
        console.error("Error fetching project data:", error);
    }finally{
        setProjectLoading(false);
    }
  }

  

  useEffect(()=>{
    fetchProjectData();
    
  },[]);

  return (
    <div>
      {!projectLoading &&
      (
        <>
            <h1 className="mb-6 text-3xl font-bold">Project No :{project.type=='ongrid'?onGrid.on_grid_project_id:offGrid.off_grid_hybrid_project_id}({project?.type})</h1>


  <div class="flex flex-col flex-wrap gap-5 md:flex-row">
    <div class="flex flex-col gap-5">
      
<CustomerCard projectId={projectId}/>
      <div
        class="bg-white rounded-lg border border-gray-300 p-5 flex-1 min-w-[600px] h-[100px]"
      >
        <div class="flex justify-between items-center mb-2.5">
          <h3 class="m-0 text-lg font-semibold">Services Summary</h3>
          {/* <PrintIcon
            class="rounded-full bg-[#00a68b] p-1.5 cursor-pointer" fontSize='medium'
            onClick={() => setSchedule(true)}
          /> */}
          <CalendarDateRangeIcon class="icon h-8 w-8 bg-teal-600 text-white rounded-full p-1 cursor-pointer" 
            onClick={() => setSchedule(true)}
          />
          {/* <ScheduleService show={schedule} onClose={() => setSchedule(false)} /> */}
        </div>
        <div class="flex gap-5 mt-2.5 flex-wrap">
          <div
            class="bg-[#d5f7e9] p-[10px_15px] rounded-lg min-w-[140px] text-center"
          >
            <p class="m-0 font-bold">1st service round</p>
            <span class="text-sm text-gray-700">2025-01-22</span>
          </div>
          <div
            class="bg-[#d5f7e9] p-[10px_15px] rounded-lg min-w-[140px] text-center"
          >
            <p class="m-0 font-bold">2nd service round</p>
            <span class="text-sm text-gray-700">2025-02-22</span>
          </div>
        </div>
      </div>
    </div>

    <div
      class="bg-white rounded-lg border border-gray-300 p-5 flex-1 min-w-[600px]"
    >
    {      project.type == 'ongrid'?(<ProjectDataCard project={project} onGrid={onGrid} solarPanel={solarPanel} inverter={inverter}/>):''}
      
    </div>
  </div>
        </>
        )}
    </div>
  )
}

export default ProjectDetails
