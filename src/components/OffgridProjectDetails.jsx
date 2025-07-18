import { InformationCircleIcon } from '@heroicons/react/16/solid'
import React, { useState } from 'react'
import SolarPanelDetailsModel from './SolarPanelDetailsModel';
import InverterDetailsModel from './InverterDetailsModel';
import BatteryDetailsModel from './BatteryDetailsModel';
import WifiDetailsModel from './wifiDetailsModel';

export default function OffgridProjectDataCard({project, offGrid}) {

  const [showSolarPanelModal, setShowSolarPanelModal] = useState(false);
  const [showInverterModal, setShowInverterModal] = useState(false);
  const [showWifiModal, setShowWifiModal] = useState(false);
  const [showBatteryModal, setShowBatteryModal] = useState(false);
  
  return (
    <div>
      <div class="flex justify-between items-center mb-2.5">
        <h3 class="m-0 text-lg font-semibold">Project Details</h3>
        <InformationCircleIcon className='h-7 w-7'/>
      </div>
      <div class="card-content">
        <label class="block text-sm mt-2.5 mb-1.5">Site address</label>
        <input
          disabled
          value={project?.project_address || ''}
          class="w-[90%] p-2 rounded-lg border border-gray-300 bg-gray-200"
        />

        <div class="flex flex-row flex-wrap">
          <div class="flex flex-col w-1/2">
            <label class="block text-sm mt-2.5 mb-1.5">Connection type</label>
            <input
              disabled
              value={offGrid?.connection_type || '-'}
              class="w-[70%] p-2 rounded-lg border border-gray-300 bg-gray-200 mr-[4%]"
            />
          </div>
          <div class="flex flex-col w-1/2">
            <label class="block text-sm mt-2.5 mb-1.5">Service Years & Rounds</label>
            <input
              disabled
              value={`${project?.service_rounds_in_agreement || '0'} rounds for ${project?.service_years_in_agreement || '0'} years`}
              class="w-[70%] p-2 rounded-lg border border-gray-300 bg-gray-200 mr-[4%]"
            />
          </div>
        </div>

        <div class="flex flex-row justify-between">
          <div class="flex flex-col w-1/2">
            <label class="block text-sm mt-2.5 mb-1.5">Nearest town</label>
            <input
              disabled
              value={project?.neatest_town || '-'}
              class="w-[70%] p-2 rounded-lg border border-gray-300 bg-gray-200 mr-[4%]"
            />
          </div>
          <div class="flex flex-col w-1/2">
            <label class="block text-sm mt-2.5 mb-1.5">No. of panels</label>
            <input
              disabled
              value={project?.no_of_panels || '0'}
              class="w-[70%] p-2 rounded-lg border border-gray-300 bg-gray-200 mr-[4%]"
            />
          </div>
        </div>
        <div class="flex flex-row justify-between">
          <div class="flex flex-col w-1/2">
            <label class="block text-sm mt-2.5 mb-1.5">
              Project installation on
            </label>
            <input
              disabled
              value={project?.project_installation_date || 'Not installed yet'}
              class="w-[70%] p-2 rounded-lg border border-gray-300 bg-gray-200 mr-[4%]"
            />
          </div>
          <div class="flex flex-col w-1/2">
            <label class="block text-sm mt-2.5 mb-1.5">System on</label>
            <input
              disabled
              value={project?.system_on || 'Not started'}
              class="w-[70%] p-2 rounded-lg border border-gray-300 bg-gray-200 mr-[4%]"
            />
          </div>
        </div>
        <label class="block text-sm mt-2.5 mb-1.5">Special Note</label>
        <textarea
          disabled
          value={`${project?.remarks|| offGrid?.remarks ||'No special notes'}`}
          class="w-[90%] p-2 rounded-lg border border-gray-300 bg-gray-200"
        />

        <div class="flex flex-row justify-between">
          <div class="flex flex-col w-1/2">
            <label class="block text-sm mt-2.5 mb-1.5">Longitude</label>
            <input
              disabled
              value={project?.longitude || ''}
              class="w-[70%] p-2 rounded-lg border border-gray-300 bg-gray-200 mr-[4%]"
            />
          </div>
          <div class="flex flex-col w-1/2">
            <label class="block text-sm mt-2.5 mb-1.5">Latitude</label>
            <input
              disabled
              value={project?.lattitude || ''}
              class="w-[70%] p-2 rounded-lg border border-gray-300 bg-gray-200 mr-[4%]"
            />
          </div>
        </div>
        <div class="mt-4 flex gap-2.5 flex-wrap">
          <button
            class="bg-[#00a68b] text-white border-none px-3.5 py-2 rounded-lg cursor-pointer hover:bg-[#008f76]"
            onClick={() => setShowSolarPanelModal(true)}
          >
            Solar Panel Details
          </button>
          {/* <SolarPanelModal show={showModal} onClose={() => setShowModal(false)} /> */}
          <button
            class="bg-[#00a68b] text-white border-none px-3.5 py-2 rounded-lg cursor-pointer hover:bg-[#008f76]"
            onClick={() => setShowInverterModal(true)}
          >
            Invertor Details
          </button>
          <button
            class="bg-[#00a68b] text-white border-none px-3.5 py-2 rounded-lg cursor-pointer hover:bg-[#008f76]"
            onClick={() => setShowBatteryModal(true)}
          >
            Battery Details
          </button>
          <button
            class="bg-[#00a68b] text-white border-none px-3.5 py-2 rounded-lg cursor-pointer hover:bg-[#008f76]"
            onClick={() => setShowWifiModal(true)}
          >
            Wifi Details
          </button>
           
        </div>
      </div>

      {showSolarPanelModal && (
        <SolarPanelDetailsModel show={showSolarPanelModal} onClose={()=>setShowSolarPanelModal(false)} projectId={project.id} panelCapacity={project.panel_capacity} noOfPanels={project?.no_of_panels}/>
      )}
      {showInverterModal && (
        <InverterDetailsModel show={showInverterModal} onClose={()=>setShowInverterModal(false)} projectId={project.id}/>
      )}
      {showBatteryModal && (
        <BatteryDetailsModel show={showBatteryModal} onClose={()=>setShowBatteryModal(false)} offgridProjectId={offGrid.off_grid_hybrid_project_id}/>
      )}
        {showWifiModal && (
            <WifiDetailsModel username={offGrid.wifi_username} password={offGrid.wifi_password} show={showWifiModal} onClose={()=>setShowWifiModal(false)}/>
        )}
    </div>
  )
}
