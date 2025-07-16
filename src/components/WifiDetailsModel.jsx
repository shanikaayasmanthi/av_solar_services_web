import React from 'react'

export default function WifiDetailsModel({username, password, show, onClose}) {
  return (
    <div>
      <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999] p-5 box-border"
      onClick={onClose} 
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white p-5 rounded-xl w-[740px]  max-w-[800px] max-h-[70vh] overflow-y-auto shadow-lg flex flex-col gap-4 box-border
                   sm:p-4 md:p-5" 
      >
        <span
          className="absolute top-2.5 right-4 text-2xl cursor-pointer" 
          onClick={onClose}
        >
          &times;
        </span>

        <h2 className="mb-2 text-xl font-semibold">Wifi Details</h2>

        {/* Table Wrapper for Responsiveness */}
            <div className="overflow-x-auto">
              {/* wifi data */}
                <table className="min-w-full border-collapse">
                    <thead>
                    <tr>
                        <th className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">Username</th>
                        <th className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">Password</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">{username || 'Not set'}</td>
                        <td className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">{password || 'Not set'}</td>
                    </tr>
                    </tbody>
                    </table>
            </div>

        {/* Button Wrapper */}
        {/* <div className="flex justify-end sm:justify-center"> */}
          {/* Button */}
          {/* <button
            className="bg-[#00a68b] text-white border-none px-3.5 py-2 rounded-full cursor-pointer transition-colors duration-300 hover:bg-[#007b6b]
                       w-auto sm:w-1/4 sm:px-3 sm:py-2"
            onClick={() => setShowModal(true)}
          >
            Changes on Invertor
          </button>
        </div> */}

        {/* Nested Modal */}
        {/* <SelectChanges show={showModal} onClose={() => setShowModal(false)} /> */}
      </div>
    </div>
    </div>
  )
}
