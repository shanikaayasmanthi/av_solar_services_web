import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import PrintIcon from '@mui/icons-material/Print';

const ProjectDetails = () => {
    const [showModel, setShowModel] = useState(false);
    const [schedule, setSchedule] = useState(false);
    const projectId = useParams().id;

    const [project, setProject] = useState({});
    const [customer, setCustomer] = useState({});
    const [battery, setBattery] = useState([]);
    const [inverter, setInverter] = useState([]);
    const [solarPanel, setSolarPanel] = useState([]);
    const [offGrid, setOffGrid] = useState({});
    const [onGrid, setOnGrid] = useState({});
    const {token} = useAuth();
  const [projectLoading, setProjectLoading] = useState(true);
  const [customerLoading, setCustomerLoading] = useState(true);
  const fetchData = async()=>{
    try{
        const projectResponse = await axios.post(`http://127.0.0.1:8000/api/get-project`,
            { 'project_id': projectId },{
          headers: {
            Authorization: `Bearer ${token}`,
          },}
        );
        console.log(projectResponse.data);
        if(projectResponse.data.status === "Request was successful."){
            const responsetData = projectResponse.data.data;
            setProject(responsetData.project);
            setCustomer(responsetData.customer);
            setInverter(responsetData.inverter);
            setSolarPanel(responsetData.solar_panel);
            if(responsetData.project.type == 'offgrid'){
                setOffGrid(responsetData.off_grid_hybrid);
                setBattery(responsetData.battery);
            }else{
                setOnGrid(responsetData.on_grid);
            }
        }
        
    }catch(error){
        console.error("Error fetching project data:", error);
    }finally{
        setProjectLoading(false);
    }
  }

  useEffect(()=>{
    fetchData();
    console.log(onGrid);
    
  },[]);

  return (
    <div>
      {!projectLoading &&
      (
        <>
            <h1 className="mb-6 text-3xl font-bold">Project No :{project.type=='ongrid'?onGrid.on_grid_project_id:offGrid.off_grid_hybrid_project_id}({project?.type})</h1>


  <div class="flex flex-col flex-wrap gap-5 md:flex-row">
    <div class="flex flex-col gap-5">
      {!customerLoading && (
      <div
        class="bg-white rounded-lg border border-gray-300 p-5 flex-1 min-w-[600px] h-[400px]"
      >
        <div class="flex justify-between items-center mb-2.5">
          <h3 class="m-0 text-lg">Customer Details</h3>
          <EditIcon class="icon text-[35px]" fontSize='medium'/>
        </div>
        <div class="card-content">
          <label class="block text-sm mt-2.5 mb-1.5">Name</label>
          <input
            disabled
            value={customer.name}
            class="w-[90%] p-2 rounded-lg border border-gray-300 bg-gray-200"
          />

          <label class="block text-sm mt-2.5 mb-1.5">Tel. No</label>
          <input
            disabled
            value="0723457890"
            class="w-[90%] p-2 rounded-lg border border-gray-300 bg-gray-200"
          />

          <label class="block text-sm mt-2.5 mb-1.5">Address</label>
          <input
            disabled
            value="Divisional secretary office, yakkalamulla"
            class="w-[90%] p-2 rounded-lg border border-gray-300 bg-gray-200"
          />

          <label class="block text-sm mt-2.5 mb-1.5">Email</label>
          <input
            disabled
            value="dso@gmail.com"
            class="w-[90%] p-2 rounded-lg border border-gray-300 bg-gray-200"
          />
        </div>
      </div>
      )}

      <div
        class="bg-white rounded-lg border border-gray-300 p-5 flex-1 min-w-[600px] h-[100px]"
      >
        <div class="flex justify-between items-center mb-2.5">
          <h3 class="m-0 text-lg">Services Summary</h3>
          <PrintIcon
            class="rounded-full bg-[#00a68b] p-1.5 cursor-pointer" fontSize='medium'
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
      <div class="flex justify-between items-center mb-2.5">
        <h3 class="m-0 text-lg">Project Details</h3>
        <InfoIcon class="icon"fontSize='medium'/>
      </div>
      <div class="card-content">
        <label class="block text-sm mt-2.5 mb-1.5">Electricity bill name</label>
        <input
          disabled
          value="Divisional Secretary Yakkalamulla"
          class="w-[90%] p-2 rounded-lg border border-gray-300 bg-gray-200"
        />

        <label class="block text-sm mt-2.5 mb-1.5">Site address</label>
        <input
          disabled
          value="Divisional secretary office, yakkalamulla"
          class="w-[90%] p-2 rounded-lg border border-gray-300 bg-gray-200"
        />

        <div class="flex flex-row gap-[150px]">
          <div class="flex flex-col">
            <label class="block text-sm mt-2.5 mb-1.5">Nearest town</label>
            <input
              disabled
              value="Galle"
              class="w-[70%] p-2 rounded-lg border border-gray-300 bg-gray-200 mr-[4%]"
            />
          </div>
          <div class="flex flex-col">
            <label class="block text-sm mt-2.5 mb-1.5">No. of panels</label>
            <input
              disabled
              value="20"
              class="w-[70%] p-2 rounded-lg border border-gray-300 bg-gray-200 mr-[4%]"
            />
          </div>
        </div>
        <div class="flex flex-row gap-[150px]">
          <div class="flex flex-col">
            <label class="block text-sm mt-2.5 mb-1.5">
              Project installation on
            </label>
            <input
              disabled
              value="2024-12-10"
              class="w-[70%] p-2 rounded-lg border border-gray-300 bg-gray-200 mr-[4%]"
            />
          </div>
          <div class="flex flex-col">
            <label class="block text-sm mt-2.5 mb-1.5">System on</label>
            <input
              disabled
              value="2024-12-10"
              class="w-[70%] p-2 rounded-lg border border-gray-300 bg-gray-200 mr-[4%]"
            />
          </div>
        </div>
        <label class="block text-sm mt-2.5 mb-1.5">Special Note</label>
        <input
          disabled
          value="AC 4P SPD Phoenix replaced by Thimanka on 30/08/2024"
          class="w-[90%] p-2 rounded-lg border border-gray-300 bg-gray-200"
        />

        <div class="flex flex-row gap-[150px]">
          <div class="flex flex-col">
            <label class="block text-sm mt-2.5 mb-1.5">Longitude</label>
            <input
              disabled
              value="6.276992"
              class="w-[70%] p-2 rounded-lg border border-gray-300 bg-gray-200 mr-[4%]"
            />
          </div>
          <div class="flex flex-col">
            <label class="block text-sm mt-2.5 mb-1.5">Latitude</label>
            <input
              disabled
              value="80.855238"
              class="w-[70%] p-2 rounded-lg border border-gray-300 bg-gray-200 mr-[4%]"
            />
          </div>
        </div>
        <div class="mt-4 flex gap-2.5 flex-wrap">
          <button
            class="bg-[#00a68b] text-white border-none px-3.5 py-2 rounded-lg cursor-pointer hover:bg-[#008f76]"
            onClick={() => setShowModal(true)}
          >
            Solar Panel Details
          </button>
          {/* <SolarPanelModal show={showModal} onClose={() => setShowModal(false)} /> */}
          <button
            class="bg-[#00a68b] text-white border-none px-3.5 py-2 rounded-lg cursor-pointer hover:bg-[#008f76]"
          >
            Invertor Details
          </button>
          <button
            class="bg-[#00a68b] text-white border-none px-3.5 py-2 rounded-lg cursor-pointer hover:bg-[#008f76]"
          >
            Wifi Details
          </button>
        </div>
      </div>
    </div>
  </div>
        </>
        )}
    </div>
  )
}

export default ProjectDetails
