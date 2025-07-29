import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const NewInverterDetails = ({ show, onClose, projectId }) => {
  const { token } = useAuth();
  const [inverterRows, setInverterRows] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addNewEmptyRow = () => {
    const newRow = {
      id: `new-${Date.now()}-${inverterRows.length}`,
      brand: "",
      model_code: "",
      check_code: "",
      serial_no: "",
      capacity: "",
    };
    setInverterRows([...inverterRows, newRow]);
    setError("");
  };

  const handleRowChange = (index, field, value) => {
    const updatedRows = [...inverterRows];
    updatedRows[index] = { ...updatedRows[index], [field]: value };
    setInverterRows(updatedRows);
    setError("");
  };

  const handleDeleteRow = (id) => {
    setInverterRows(inverterRows.filter(row => row.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const payloadInverters = inverterRows.map(row => {
        if (!row.brand || !row.model_code || !row.check_code || 
            !row.serial_no || !row.capacity) {
          throw new Error("Please fill all fields for each inverter");
        }

        const capacity = parseFloat(row.capacity);

        if (isNaN(capacity)) {
          throw new Error("Please enter a valid capacity");
        }

        return {
          brand: row.brand,
          model_no: row.model_code,
          check_code: row.check_code,
          serial_no: row.serial_no,
          capacity: capacity,
        };
      });

      const response = await axios.post(
        "http://127.0.0.1:8000/api/change-inverters",
        {
          project_id: projectId,
          inverters_to_add: payloadInverters,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "Request was successful.") {
        setSuccess("Inverters added successfully!");
        setInverterRows([]);
        setTimeout(() => onClose(), 1500);
      } else {
        throw new Error(response.data.message || "Failed to add inverters");
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
          <h2 className="text-xl font-semibold">Add New Inverter Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

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

        <div className="overflow-x-auto mb-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Brand</th>
                <th className="p-2 border">Inv. Model Code</th>
                <th className="p-2 border">Inv. Check Code</th>
                <th className="p-2 border">Inv. Serial No</th>
                <th className="p-2 border">Inv. Capacity (kW)</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inverterRows.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No inverters added yet
                  </td>
                </tr>
              ) : (
                inverterRows.map((row, index) => (
                  <tr key={row.id}>
                    <td className="p-2 border">
                      <input
                        type="text"
                        value={row.brand}
                        onChange={(e) => 
                          handleRowChange(index, "brand", e.target.value)
                        }
                        className="w-full p-1 border rounded"
                        placeholder="Brand"
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        type="text"
                        value={row.model_code}
                        onChange={(e) => 
                          handleRowChange(index, "model_code", e.target.value)
                        }
                        className="w-full p-1 border rounded"
                        placeholder="Model Code"
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        type="text"
                        value={row.check_code}
                        onChange={(e) => 
                          handleRowChange(index, "check_code", e.target.value)
                        }
                        className="w-full p-1 border rounded"
                        placeholder="Check Code"
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        type="text"
                        value={row.serial_no}
                        onChange={(e) => 
                          handleRowChange(index, "serial_no", e.target.value)
                        }
                        className="w-full p-1 border rounded"
                        placeholder="Serial No"
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        type="number"
                        value={row.capacity}
                        onChange={(e) => 
                          handleRowChange(index, "capacity", e.target.value)
                        }
                        className="w-full p-1 border rounded"
                        placeholder="Capacity"
                        min="0.1"
                        step="0.1"
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
            Add Inverter Row
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
              disabled={isSubmitting || inverterRows.length === 0}
              className={`px-4 py-2 rounded ${
                isSubmitting || inverterRows.length === 0
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

export default NewInverterDetails;