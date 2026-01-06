import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { BASE_URL } from "../constants/BaseUrl.jsx";

const NewSolarPanelDetails = ({ show, onClose, projectId, panelCapacity, noOfPanels }) => {
  const { token } = useAuth();
  const [newPanelRows, setNewPanelRows] = useState([]);
  const [totalPanelsInput, setTotalPanelsInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addNewEmptyRow = () => {
    const newRow = {
      id: `new-${Date.now()}-${newPanelRows.length}`,
      solar_panel_model: "",
      panel_model_code: "",
      panel_type: "",
      wattage_of_pannel: "",
      no_of_panels: "",
    };
    setNewPanelRows([...newPanelRows, newRow]);
    setError("");
  };

  const handleNewRowChange = (index, field, value) => {
    const updatedRows = [...newPanelRows];
    updatedRows[index] = { ...updatedRows[index], [field]: value };
    setNewPanelRows(updatedRows);
    setError("");
  };

  const handleDeleteRow = (id) => {
    setNewPanelRows(newPanelRows.filter(row => row.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Validate total panels input
      const parsedTotalPanels = parseInt(totalPanelsInput, 10);
      if (isNaN(parsedTotalPanels)) {
        throw new Error("Please enter a valid total number of panels");
      }

      // Validate each panel row
      const payloadPanels = newPanelRows.map(row => {
        if (!row.solar_panel_model || !row.panel_model_code || !row.panel_type || 
            !row.wattage_of_pannel || !row.no_of_panels) {
          throw new Error("Please fill all fields for each panel");
        }

        const numPanels = parseInt(row.no_of_panels, 10);
        const wattage = parseFloat(row.wattage_of_pannel);

        if (isNaN(numPanels)) {
          throw new Error("Please enter a valid number of panels");
        }

        if (isNaN(wattage)) {
          throw new Error("Please enter a valid wattage");
        }

        return {
          model: row.solar_panel_model,
          modelCode: row.panel_model_code,
          type: row.panel_type,
          wattage: wattage,
          numPanels: numPanels,
        };
      });

      // Calculate total panels being added
      const totalPanelsBeingAdded = payloadPanels.reduce(
        (sum, panel) => sum + panel.numPanels, 0
      );

      if (totalPanelsBeingAdded !== parsedTotalPanels) {
        throw new Error(
          `Total panels entered (${totalPanelsBeingAdded}) doesn't match specified total (${parsedTotalPanels})`
        );
      }

      // API call to add new panels
      const response = await axios.post(
        `${BASE_URL}api/add-new-solar-panels`,
        {
          project_id: projectId,
          total_panels: parsedTotalPanels,
          panel_sets: payloadPanels,
          option: "add",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "Request was successful.") {
        setSuccess("Solar panels added successfully!");
        setNewPanelRows([]);
        setTotalPanelsInput("");
        setTimeout(() => onClose(), 1500);
      } else {
        throw new Error(response.data.message || "Failed to add panels");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div 
        className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Solar Panels</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        {/* <div className="mb-4">
          <p className="font-medium">Project Capacity: {panelCapacity} kW</p>
          <p className="font-medium">Allowed Panels: {noOfPanels}</p>
        </div> */}

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
            {success}
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-2 font-medium">
            Total Number of Panels to Add
          </label>
          <input
            type="number"
            value={totalPanelsInput}
            onChange={(e) => setTotalPanelsInput(e.target.value)}
            className="w-full p-2 border rounded"
            min="1"
            placeholder="Enter total panels"
          />
        </div>

        <div className="overflow-x-auto mb-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Panel Model</th>
                <th className="p-2 border">Model Code</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Wattage</th>
                <th className="p-2 border">No. of Panels</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {newPanelRows.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No panels added yet
                  </td>
                </tr>
              ) : (
                newPanelRows.map((row, index) => (
                  <tr key={row.id}>
                    <td className="p-2 border">
                      <input
                        type="text"
                        value={row.solar_panel_model}
                        onChange={(e) => 
                          handleNewRowChange(index, "solar_panel_model", e.target.value)
                        }
                        className="w-full p-1 border rounded"
                        placeholder="Model"
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        type="text"
                        value={row.panel_model_code}
                        onChange={(e) => 
                          handleNewRowChange(index, "panel_model_code", e.target.value)
                        }
                        className="w-full p-1 border rounded"
                        placeholder="Code"
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        type="text"
                        value={row.panel_type}
                        onChange={(e) => 
                          handleNewRowChange(index, "panel_type", e.target.value)
                        }
                        className="w-full p-1 border rounded"
                        placeholder="Type"
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        type="number"
                        value={row.wattage_of_pannel}
                        onChange={(e) => 
                          handleNewRowChange(index, "wattage_of_pannel", e.target.value)
                        }
                        className="w-full p-1 border rounded"
                        placeholder="Wattage"
                        min="1"
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        type="number"
                        value={row.no_of_panels}
                        onChange={(e) => 
                          handleNewRowChange(index, "no_of_panels", e.target.value)
                        }
                        className="w-full p-1 border rounded"
                        placeholder="Count"
                        min="1"
                      />
                    </td>
                    <td className="p-2 border text-center">
                      <button
                        onClick={() => handleDeleteRow(row.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        &times;
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap gap-3 justify-between">
          <button
            onClick={addNewEmptyRow}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Panel Row
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || newPanelRows.length === 0}
              className={`px-4 py-2 rounded ${
                isSubmitting || newPanelRows.length === 0
                  ? "bg-green-300 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSolarPanelDetails;