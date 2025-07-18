import {
  XCircleIcon,
  PlusCircleIcon,
  MinusCircleIcon,
} from "@heroicons/react/24/solid"; // Import a close icon
import axios from "axios";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const ExpandPanelsModel = ({ onClose ,projectId,onPanelsUpdated,option}) => {
    const {token} = useAuth();
  const [totalPanels, setTotalPanels] = useState(null);
  const [error, setError] = useState("");
  const [panelSets, setPanelSets] = useState([
    { model: "", modelCode: "", type: "", numPanels: null, wattage: "" },
  ]);

  const handleInputChange = (index, field, value) => {
    const newPanelSets = [...panelSets];
    newPanelSets[index] = { ...newPanelSets[index], [field]: value };
    setPanelSets(newPanelSets);
  };

  const handleAddPanelSet = () => {
    setPanelSets([
      ...panelSets,
      { model: "", modelCode: "", type: "", numPanels: null, wattage: "" },
    ]);
  };

  const handleRemovePanelSet = (index) => {
    const newPanelSets = panelSets.filter((_, i) => i !== index);
    setPanelSets(newPanelSets);
  };

  const handleDone = async() => {
    setError(""); // Reset error message
    if (totalPanels || totalPanels > 0) {
      let panels = 0;

      for (const panelSet of panelSets) {
        // Changed from forEach to for...of
        // Check if any required field in the current set is empty
        if (
          !panelSet.model ||
          !panelSet.modelCode ||
          !panelSet.type ||
          !panelSet.numPanels ||
          !panelSet.wattage
        ) {
          // Assuming setError is defined in your component's state
          setError("Please fill all fields for each panel set.");
          return; // This exits the handleDone function immediately
        }

        // Safely parse and sum numPanels
        const num = parseInt(panelSet.numPanels, 10);
        if (isNaN(num) || num <= 0) {
          setError(
            'Please enter a valid number (greater than 0) for "No of Panels" in all sets.'
          );
          return; // This exits the handleDone function immediately
        }
        panels += num;
      }

        if (panels != totalPanels) {
          setError(
            `Total number of panels (${panels}) does not match the specified total (${totalPanels}). Please check your entries.`
          );
          return;
        }
    } else {
      setError("Please specify the total number of panels.");
      return;
    }
    console.log("Panel Data:", panelSets);
    console.log(projectId);
    
    
    try{
        const response = await axios.post("http://127.0.0.1:8000/api/add-new-solar-panels",
        {
            project_id:projectId,
            total_panels: totalPanels,
            panel_sets: panelSets,
            option:option
        },
        {
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            
        }
    )

    console.log("Response:", response);
       if(response.status===200 && response.data.status === "Request was successful."){
        if (onPanelsUpdated) {
          onPanelsUpdated();
        }
        onClose();
        
    }else {
        setError("Please try again.");
        return;
     }
    
    
    }catch(error){
     if(error.response.status == 422){
        setError("Please enter valid data.");
        return;
    }else if(error.response.status == 401){
        setError("Unauthorized access. Please log in again.");
        return;
    }else if(error.response.status == 400){
        setError("Total number of panels exceeds the project capacity.");
        return;
    }
}
    
    // onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]"
      onClick={onClose}
    >
      <div
        className="bg-white p-5 rounded-xl shadow-lg w-[90%] max-w-[1000px] h-[80%] max-h-[450px] overflow-y-auto relative
                           md:w-4/5 lg:w-3/5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <span
          className="absolute top-2.5 right-4 text-2xl cursor-pointer"
          onClick={onClose}
        >
          &times;
        </span>

        <div className="pt-4">
          <h3 className="mb-5 text-xl font-semibold text-gray-800">
            {option==="add"?"Add":"Expand"} Panels
          </h3>
          <div className="w-full p-2 mx-auto text-center text-gray-700 sm:w-1/2 md:w-1/3">
            <input
              type="number"
              placeholder="Total no of Panel Change"
              value={totalPanels}
              onChange={(e) => {
                setTotalPanels(e.target.value);
                setError("");
              }}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {panelSets.map((panelSet, index) => (
            <div
              key={index}
              className="flex flex-col gap-5 pb-5 mb-5 border-b border-gray-200 last:border-b-0 last:pb-0 last:mb-0"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-medium text-gray-700">
                  Panel Set {index + 1}
                </h4>
                {panelSets.length > 1 && (
                  <button
                    onClick={() => handleRemovePanelSet(index)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                    aria-label={`Remove Panel Set ${index + 1}`}
                  >
                    <MinusCircleIcon className="w-6 h-6" />
                  </button>
                )}
              </div>

              <div className="flex flex-col justify-between gap-1 sm:flex-row sm:flex-wrap">
                <div className="flex-1 min-w-[140px] text-center text-gray-700 p-2 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Panel model"
                    value={panelSet.model}
                    onChange={(e) => {
                      handleInputChange(index, "model", e.target.value);
                      setError("");
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1 min-w-[140px] text-center  text-gray-700 p-2 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Model code"
                    value={panelSet.modelCode}
                    onChange={(e) => {
                      handleInputChange(index, "modelCode", e.target.value);
                      setError("");
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1 min-w-[140px] text-center  text-gray-700 p-2 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Panel type"
                    value={panelSet.type}
                    onChange={(e) => {
                      handleInputChange(index, "type", e.target.value);
                      setError("");
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1 min-w-[140px] text-center  text-gray-700 p-2 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="No of Panels"
                    value={panelSet.numPanels}
                    onChange={(e) => {
                      handleInputChange(index, "numPanels", e.target.value);
                      setError("");
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1 min-w-[140px] text-center  text-gray-700 p-2 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Wattage"
                    value={panelSet.wattage}
                    onChange={(e) => {
                      handleInputChange(index, "wattage", e.target.value);
                      setError("");
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-end mt-6">
            <button
              onClick={handleAddPanelSet}
              className="flex items-center px-5 py-2 mb-4 space-x-2 text-white transition-colors duration-300 bg-green-600 rounded-lg hover:bg-green-700"
            >
              <PlusCircleIcon className="w-5 h-5" />
              <span>Add New Panel Set</span>
            </button>
          </div>

          {error && <p className="text-sm text-center text-red-600">{error}</p>}
          <button
            className="block px-5 py-2 mx-auto mt-1 text-white transition-colors duration-300 bg-blue-600 rounded-lg hover:bg-blue-700"
            onClick={handleDone}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpandPanelsModel;
