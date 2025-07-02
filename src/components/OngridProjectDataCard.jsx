import { InformationCircleIcon } from '@heroicons/react/16/solid'
import React from 'react'

export default function OngridProjectDataCard({project,onGrid,inverter,solarPanel}) {
  return (
    <div>
      <div class="flex justify-between items-center mb-2.5">
        <h3 class="m-0 text-lg font-semibold">Project Details</h3>
        <InformationCircleIcon className='h-7 w-7'/>
      </div>
      <div class="card-content">
        <label class="block text-sm mt-2.5 mb-1.5">Electricity bill name</label>
        <input
          disabled
          value={onGrid?.electricity_bill_name || ''}
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
  )
}
