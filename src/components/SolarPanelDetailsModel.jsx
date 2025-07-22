import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
// import ChangingPanelsModal from './ChangingPanelsModal'; // If you re-introduce a separate modal

const SolarPanelDetailsModel = ({
  show,
  onClose,
  projectId,
  panelCapacity,
  noOfPanels, // Total panels allowed for the project
}) => {
  if (!show) {
    return null;
  }

  const { token } = useAuth();
  const [loadingData, setLoadingData] = useState(true);
  const [solarPanelData, setSolarPanelData] = useState([]);
  const [error, setError] = useState(null);

  // Controls which UI section is active:
  // null: initial "Changes on panels" button
  // 'show_action_buttons': display the "Changing", "Expanding", "Add New" buttons
  // 'editing_table': inline table editing for adding/expanding/changing panels
  const [status, setStatus] = useState(null);

  // This will now store which action button was clicked to transition to 'editing_table'
  const [selectedActionType, setSelectedActionType] = useState("");

  const [newPanelRows, setNewPanelRows] = useState([]);
  const [totalPanelsInput, setTotalPanelsInput] = useState(""); // This will now represent the total panels being *added/expanded*
  const [inlineEditError, setInlineEditError] = useState("");
  const [inlineEditSuccess, setInlineEditSuccess] = useState("");

  // New state for 'Changing Exit Panels' functionality
  const [selectedPanelIds, setSelectedPanelIds] = useState([]); // IDs of panels to change
  const [changingPanelQuantities, setChangingPanelQuantities] = useState({}); // { panelId: numberOfPanelsToChange }
  const [totalPanelsToChangeInput, setTotalPanelsToChangeInput] =
    useState(""); // Input for total panels to change

  const fetchSolarPanelData = useCallback(async () => {
    setLoadingData(true);
    setError(null);
    setInlineEditError("");
    setInlineEditSuccess("");
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/get-solar-panel",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            project_id: projectId,
          },
        }
      );
      if (response.status === 200) {
        const responseData = response.data.data.solar_panels;
        setSolarPanelData(responseData);
        setLoadingData(false);
      } else {
        console.error(
          "Failed to fetch solar panel data:",
          response.data.message
        );
        setError(response.data.message || "Failed to fetch solar panel data.");
        setLoadingData(false);
      }
    } catch (error) {
      console.error("Error fetching solar panel data:", error);
      if (error.response && error.response.status === 404) {
        setError("No panel data added to this project.");
        setSolarPanelData([]);
      } else {
        setError("An error occurred while fetching solar panel data.");
      }
      setLoadingData(false);
    }
  }, [token, projectId]);

  useEffect(() => {
    if (show) {
      fetchSolarPanelData();
    }
  }, [show, fetchSolarPanelData]);

  const getSolarPanelCount = useCallback(() => {
    return solarPanelData.reduce(
      (total, panel) => total + parseInt(panel.no_of_panels, 10),
      0
    );
  }, [solarPanelData]);

  // Determine if more panels can be added based on project's total capacity
  const canAddMorePanelDetails = getSolarPanelCount() < noOfPanels;

  const handleActionSelect = (actionType) => {
    setSelectedActionType(actionType);
    setNewPanelRows([]);
    setTotalPanelsInput("");
    setInlineEditError("");
    setInlineEditSuccess("");
    setSelectedPanelIds([]); // Clear selection
    setChangingPanelQuantities({}); // Clear quantities
    setTotalPanelsToChangeInput(""); // Clear total panels to change

    setStatus("editing_table"); // Now all three actions will lead to the editing table
    if (actionType !== "changing") {
      addNewEmptyRow(); // For expanding or adding, start with one empty row
    }
  };

  const handleModalCloseAndRefresh = () => {
    fetchSolarPanelData();
    setStatus(null);
    setSelectedActionType("");
    setTotalPanelsInput("");
    setNewPanelRows([]);
    setSelectedPanelIds([]);
    setChangingPanelQuantities({});
    setTotalPanelsToChangeInput("");
  };

  const addNewEmptyRow = () => {
    const newRow = {
      id: `new-${Date.now()}-${newPanelRows.length}`,
      solar_panel_model: "",
      panel_model_code: "",
      panel_type: "",
      wattage_of_pannel: "",
      no_of_panels: "",
      isNew: true,
    };
    setNewPanelRows((prev) => [...prev, newRow]);
    setInlineEditError("");
  };

  const handleNewRowChange = (index, field, value) => {
    const updatedRows = [...newPanelRows];
    updatedRows[index] = { ...updatedRows[index], [field]: value };
    setNewPanelRows(updatedRows);
    setInlineEditError("");
  };

  const handleDeleteNewRow = (id) => {
    setNewPanelRows((prev) => prev.filter((row) => row.id !== id));
    setInlineEditError("");
  };

  // Handlers for 'Changing Exit Panels' selection
  const handlePanelSelection = (panelId) => {
    setSelectedPanelIds((prev) =>
      prev.includes(panelId)
        ? prev.filter((id) => id !== panelId)
        : [...prev, panelId]
    );
    // When a panel is deselected, remove its quantity entry
    if (selectedPanelIds.includes(panelId)) {
      setChangingPanelQuantities((prev) => {
        const newQuantities = { ...prev };
        delete newQuantities[panelId];
        return newQuantities;
      });
    }
    setInlineEditError(""); // Clear errors on selection change
  };

  const handleChangingPanelQuantityChange = (panelId, value) => {
    const originalPanel = solarPanelData.find((p) => p.id === panelId);
    if (!originalPanel) return;

    const numValue = parseInt(value, 10);

    if (isNaN(numValue) || numValue <= 0) {
      setInlineEditError(
        `Quantity for ${originalPanel.solar_panel_model} must be a positive number.`
      );
      setChangingPanelQuantities((prev) => ({ ...prev, [panelId]: "" })); // Clear the invalid input
      return;
    }

    if (numValue > parseInt(originalPanel.no_of_panels, 10)) {
      setInlineEditError(
        `Quantity for ${originalPanel.solar_panel_model} cannot exceed its current count of ${originalPanel.no_of_panels}.`
      );
      setChangingPanelQuantities((prev) => ({ ...prev, [panelId]: "" })); // Clear the invalid input
      return;
    }

    setChangingPanelQuantities((prev) => ({
      ...prev,
      [panelId]: numValue,
    }));
    setInlineEditError("");
  };

  const handleSaveNewPanels = async () => {
    setInlineEditError("");
    setInlineEditSuccess("");

    let payload = {};

    // --- Validation for Changing Panels ---
    if (selectedActionType === "changing") {
      if (selectedPanelIds.length === 0) {
        setInlineEditError("Please select at least one existing panel to change.");
        return;
      }

      let totalPanelsBeingChanged = 0;
      const panelsToModify = [];

      for (const panelId of selectedPanelIds) {
        const quantity = changingPanelQuantities[panelId];
        if (!quantity || isNaN(quantity) || quantity <= 0) {
          setInlineEditError(
            `Please specify a valid positive number for all selected existing panels.`
          );
          return;
        }
        totalPanelsBeingChanged += quantity;

        const originalPanel = solarPanelData.find((p) => p.id === panelId);
        if (quantity > parseInt(originalPanel.no_of_panels, 10)) {
            setInlineEditError(
                `Quantity for ${originalPanel.solar_panel_model} cannot exceed its current count of ${originalPanel.no_of_panels}.`
            );
            return;
        }
        panelsToModify.push({ id: panelId, numPanels: quantity });
      }

      const parsedTotalPanelsToChangeInput = parseInt(totalPanelsToChangeInput, 10);
      if (isNaN(parsedTotalPanelsToChangeInput) || parsedTotalPanelsToChangeInput <= 0) {
        setInlineEditError("Please specify a valid total number of panels being changed (greater than 0).");
        return;
      }

      if (totalPanelsBeingChanged !== parsedTotalPanelsToChangeInput) {
        setInlineEditError(
          `Total selected panels to change (${totalPanelsBeingChanged}) does not match the specified total (${parsedTotalPanelsToChangeInput}).`
        );
        return;
      }

      // if (newPanelRows.length === 0) {
      //   setInlineEditError("When changing panels, you must add new panel details to replace them.");
      //   return;
      // }
      
      let panelsToAddSum = 0;
      const payloadPanels = newPanelRows.map((row) => {
        if (
          !row.solar_panel_model ||
          !row.panel_model_code ||
          !row.panel_type ||
          !row.no_of_panels ||
          !row.wattage_of_pannel
        ) {
          throw new Error("Please fill all fields for each new panel set."); // Will be caught below
        }
        const num = parseInt(row.no_of_panels, 10);
        const wattage = parseFloat(row.wattage_of_pannel);

        if (isNaN(num) || num <= 0) {
          throw new Error('Please enter a valid number (greater than 0) for "No of Panels" in all new sets.');
        }
        if (isNaN(wattage) || wattage <= 0) {
          throw new Error('Please enter a valid wattage (greater than 0) for "Wattage of Panel" in all new sets.');
        }
        panelsToAddSum += num;
        return {
          model: row.solar_panel_model,
          modelCode: row.panel_model_code,
          type: row.panel_type,
          wattage: wattage,
          numPanels: num,
        };
      });

      if (selectedActionType !='changing' && panelsToAddSum !== totalPanelsBeingChanged) {
        setInlineEditError(
          `Total new panels to add (${panelsToAddSum}) must exactly match the total panels being changed (${totalPanelsBeingChanged}).`
        );
        return;
      }

      payload = {
        project_id: projectId,
        option: selectedActionType, // "changing"
        panels_to_remove: panelsToModify, // Array of { id, numPanels }
        panels_to_add: payloadPanels, // Array of new panel objects
        total_panels_to_change: totalPanelsBeingChanged, // Overall total panels to change/replace
      };

    } else {
      // --- Validation for Expanding/Adding New Panels ---
      const parsedTotalPanels = parseInt(totalPanelsInput, 10);
      if (isNaN(parsedTotalPanels) || parsedTotalPanels <= 0) {
        setInlineEditError(
          "Please specify a valid total number of panels to add/expand (greater than 0)."
        );
        return;
      }

      if (newPanelRows.length === 0) {
        setInlineEditError("No new panels to add. Please add at least one row.");
        return;
      }

      let panelsSum = 0;
      const payloadPanels = [];
      try {
        for (const panelSet of newPanelRows) {
          if (
            !panelSet.solar_panel_model ||
            !panelSet.panel_model_code ||
            !panelSet.panel_type ||
            !panelSet.no_of_panels ||
            !panelSet.wattage_of_pannel
          ) {
            throw new Error("Please fill all fields for each new panel set.");
          }

          const num = parseInt(panelSet.no_of_panels, 10);
          const wattage = parseFloat(panelSet.wattage_of_pannel);

          if (isNaN(num) || num <= 0) {
            throw new Error(
              'Please enter a valid number (greater than 0) for "No of Panels" in all sets.'
            );
          }
          if (isNaN(wattage) || wattage <= 0) {
            throw new Error(
              'Please enter a valid wattage (greater than 0) for "Wattage of Panel" in all sets.'
            );
          }
          panelsSum += num;
          payloadPanels.push({
            model: panelSet.solar_panel_model,
            modelCode: panelSet.panel_model_code,
            type: panelSet.panel_type,
            wattage: wattage,
            numPanels: num,
          });
        }
      } catch (validationError) {
        setInlineEditError(validationError.message);
        return;
      }

      if (panelsSum !== parsedTotalPanels) {
        setInlineEditError(
          `Total number of panels entered (${panelsSum}) does not match the specified total (${parsedTotalPanels}). Please check your entries.`
        );
        return;
      }

      const currentTotalPanelsInProject = getSolarPanelCount();
      const combinedTotalPanelsAfterAdd = currentTotalPanelsInProject + panelsSum;

      if (combinedTotalPanelsAfterAdd > noOfPanels) {
        setInlineEditError(
          `Adding these panels would exceed the project's total allowed capacity of ${noOfPanels}. Current project panels: ${currentTotalPanelsInProject}. You are trying to add ${panelsSum}.`
        );
        return;
      }

      payload = {
        project_id: projectId,
        total_panels: parsedTotalPanels,
        panel_sets: payloadPanels,
        option: selectedActionType, // "expanding" or "add"
      };
    }

    // --- API Call ---
    try {
      const apiUrl = selectedActionType === "changing"
        ? "http://127.0.0.1:8000/api/change-solar-panels" // New endpoint for changing
        : "http://127.0.0.1:8000/api/add-new-solar-panels"; // Existing endpoint for adding/expanding

      const response = await axios.post(
        apiUrl,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response);
      if (
        response.status === 200 &&
        response.data.status === "Request was successful."
      ) {
        setInlineEditSuccess(`${selectedActionType === "changing" ? "Panels changed" : "New panels added/expanded"} successfully!`);
        handleModalCloseAndRefresh(); // Reset state and refresh data
      } else {
        setInlineEditError(
          response.data.message ||
            `Failed to ${selectedActionType}. Please try again.`
        );
      }
    } catch (error) {
      console.error("Error in handleSaveNewPanels:", error);
      if (error.response) {
        if (error.response.status === 422) {
          setInlineEditError(
            "Please enter valid data. " + (error.response.data.message || "")
          );
        } else if (error.response.status === 401) {
          setInlineEditError("Unauthorized access. Please log in again.");
        } else if (error.response.status === 400) {
          setInlineEditError(
            error.response.data.message ||
              "An error occurred with your panel request."
          );
        } else {
          setInlineEditError("An unexpected error occurred. Please try again.");
        }
      } else {
        setInlineEditError("Network error. Please check your connection.");
      }
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999] p-5 box-border"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white p-5 rounded-xl w-[90%] max-w-[1000px] max-h-[80vh] overflow-y-auto shadow-lg flex flex-col gap-4 box-border
                         md:w-4/5 lg:w-3/5"
      >
        <span
          className="absolute top-2.5 right-4 text-2xl cursor-pointer"
          onClick={onClose}
        >
          &times;
        </span>

        <h2 className="mb-2 text-xl font-semibold">
          Solar Panel Details -{" "}
          {selectedActionType === "add"
            ? "Add New Panels"
            : selectedActionType === "expanding"
            ? "Expand Panels"
            : selectedActionType === "changing"
            ? "Change Existing Panels"
            : "View Details"}
        </h2>

        {loadingData ? (
          <p className="py-4 text-center">Loading solar panel data...</p>
        ) : error ? (
          <p className="py-4 text-center text-red-500">{error}</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-black border-collapse mt-1.5 mb-1.5">
                <thead>
                  <tr>
                    {selectedActionType === "changing" && (
                      <th className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">
                        Select
                      </th>
                    )}
                    <th className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">
                      Panel Model
                    </th>
                    <th className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">
                      Panel Model Code
                    </th>
                    <th className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">
                      Panel Type
                    </th>
                    <th className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">
                      Wattage of Panel
                    </th>
                    <th className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">
                      No of Panels (Current)
                    </th>
                    {selectedActionType === "changing" && (
                      <th className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">
                        No of Panels (Change)
                      </th>
                    )}
                    {selectedActionType !== "changing" && status === "editing_table" && (
                      <th className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {solarPanelData.length === 0 &&
                  newPanelRows.length === 0 &&
                  status !== "editing_table" ? (
                    <tr>
                      <td
                        colSpan={
                          selectedActionType === "changing" ? 7 : 5
                        }
                        className="border border-gray-300 p-2.5 text-center text-gray-500"
                      >
                        No solar panel data available.
                      </td>
                    </tr>
                  ) : (
                    solarPanelData.map((panel, index) => (
                      <tr key={panel.id || `existing-${index}`}>
                        {selectedActionType === "changing" && (
                          <td className="border border-gray-300 p-2.5 text-center">
                            <input
                              type="checkbox"
                              checked={selectedPanelIds.includes(panel.id)}
                              onChange={() => handlePanelSelection(panel.id)}
                              className="scale-125"
                            />
                          </td>
                        )}
                        <td className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">
                          {panel.solar_panel_model}
                        </td>
                        <td className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">
                          {panel.panel_model_code}
                        </td>
                        <td className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">
                          {panel.panel_type}
                        </td>
                        <td className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">
                          {panel.wattage_of_pannel}
                        </td>
                        <td className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">
                          {panel.no_of_panels}
                        </td>
                        {selectedActionType === "changing" && (
                          <td className="border border-gray-300 p-2.5">
                            {selectedPanelIds.includes(panel.id) && (
                              <input
                                type="number"
                                value={changingPanelQuantities[panel.id] || ""}
                                onChange={(e) =>
                                  handleChangingPanelQuantityChange(
                                    panel.id,
                                    e.target.value
                                  )
                                }
                                className="w-full p-1 border rounded"
                                placeholder="Count"
                                min="1"
                                max={panel.no_of_panels} // Cannot change more than existing
                              />
                            )}
                          </td>
                        )}
                        {selectedActionType !== "changing" && status === "editing_table" && (
                          <td className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm"></td>
                        )}
                      </tr>
                    ))
                  )}

                  {/* New rows section for Add New / Expanding / Changing */}
                  {status === "editing_table" && (selectedActionType === "expanding" || selectedActionType === "add" || selectedActionType === "changing") && (
                    <>
                      {newPanelRows.length > 0 && (
                        <tr>
                            <td colSpan={selectedActionType === "changing" ? 7 : 6} className="p-2 font-bold text-center bg-gray-100">
                                {selectedActionType === "changing" ? "New Panels to Add (Replacement)" : "New Panels to Add/Expand"}
                            </td>
                        </tr>
                      )}
                      {newPanelRows.map((row, index) => (
                        <tr key={row.id}>
                          {selectedActionType === "changing" && (
                            <td className="border border-gray-300 p-2.5"></td> // Empty cell for checkbox column
                          )}
                          <td className="border border-gray-300 p-2.5">
                            <input
                              type="text"
                              value={row.solar_panel_model}
                              onChange={(e) =>
                                handleNewRowChange(
                                  index,
                                  "solar_panel_model",
                                  e.target.value
                                )
                              }
                              className="w-full p-1 border rounded"
                              placeholder="Model"
                            />
                          </td>
                          <td className="border border-gray-300 p-2.5">
                            <input
                              type="text"
                              value={row.panel_model_code}
                              onChange={(e) =>
                                handleNewRowChange(
                                  index,
                                  "panel_model_code",
                                  e.target.value
                                )
                              }
                              className="w-full p-1 border rounded"
                              placeholder="Code"
                            />
                          </td>
                          <td className="border border-gray-300 p-2.5">
                            <input
                              type="text"
                              value={row.panel_type}
                              onChange={(e) =>
                                handleNewRowChange(
                                  index,
                                  "panel_type",
                                  e.target.value
                                )
                              }
                              className="w-full p-1 border rounded"
                              placeholder="Type"
                            />
                          </td>
                          <td className="border border-gray-300 p-2.5">
                            <input
                              type="number"
                              value={row.wattage_of_pannel}
                              onChange={(e) =>
                                handleNewRowChange(
                                  index,
                                  "wattage_of_pannel",
                                  e.target.value
                                )
                              }
                              className="w-full p-1 border rounded"
                              placeholder="Wattage"
                              min="1"
                            />
                          </td>
                          <td className="border border-gray-300 p-2.5">
                            <input
                              type="number"
                              value={row.no_of_panels}
                              onChange={(e) =>
                                handleNewRowChange(
                                  index,
                                  "no_of_panels",
                                  e.target.value
                                )
                              }
                              className="w-full p-1 border rounded"
                              placeholder="Count"
                              min="1"
                            />
                          </td>
                          <td className="border border-gray-300 p-2.5 text-center">
                            <button
                              onClick={() => handleDeleteNewRow(row.id)}
                              className="text-lg text-red-500 hover:text-red-700"
                            >
                              &times;
                            </button>
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
              {status === "editing_table" && (
                <div className="flex flex-col items-center justify-between gap-3 p-2 md:flex-row">
                  {selectedActionType === "changing" ? (
                    <div className="w-full p-2 md:w-1/2">
                      <input
                        type="number"
                        placeholder="Total No. of Panels to Change"
                        value={totalPanelsToChangeInput}
                        onChange={(e) => {
                          setTotalPanelsToChangeInput(e.target.value);
                          setInlineEditError("");
                        }}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                      />
                    </div>
                  ) : (
                    <div className="w-full p-2 md:w-1/2">
                      <input
                        type="number"
                        placeholder="Total No. of Panels to Add"
                        value={totalPanelsInput}
                        onChange={(e) => {
                          setTotalPanelsInput(e.target.value);
                          setInlineEditError("");
                        }}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                      />
                    </div>
                  )}
                  <button
                    onClick={addNewEmptyRow}
                    className="self-center w-full px-4 py-2 text-white transition-colors duration-300 bg-green-600 rounded-lg md:w-1/4 hover:bg-green-700"
                  >
                    Add New Panel Set
                  </button>
                </div>
              )}
            </div>

            <p className="text-base">Capacity - {panelCapacity}kw</p>
            {/* <p className="text-base">Current Total Panels in Project - {getSolarPanelCount()}</p>
            <p className="text-base">Allowed Total Panels for Project - {noOfPanels}</p> */}
          </>
        )}

        <div className="flex flex-col gap-3 p-2 mt-1 ">
          {inlineEditSuccess && (
            <p className="mb-2 text-sm text-center text-green-600">
              {inlineEditSuccess}
            </p>
          )}
          {inlineEditError && (
            <p className="mb-2 text-sm text-center text-red-600">
              {inlineEditError}
            </p>
          )}

          {status === null && (
            <button
              className="bg-[#00a68b] text-white border-none px-1 py-1 rounded-xl cursor-pointer transition-colors duration-300 hover:bg-[#007b6b]
                                   w-auto self-center sm:w-1/4 sm:px-1 sm:py-1.5"
              onClick={() => setStatus("show_action_buttons")}
            >
              Changes on panels
            </button>
          )}

          {status === "show_action_buttons" && (
            <>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  onClick={() => handleActionSelect("changing")}
                  className="w-full px-4 py-2 text-white transition-colors duration-300 bg-purple-600 rounded-lg sm:w-1/3 hover:bg-purple-700"
                >
                  Changing Exit Panels
                </button>
                <button
                  onClick={() => handleActionSelect("expanding")}
                  className="w-full px-4 py-2 text-white transition-colors duration-300 bg-orange-600 rounded-lg sm:w-1/3 hover:bg-orange-700"
                >
                  Expanding the Panels
                </button>
                {canAddMorePanelDetails && (
                  <button
                    onClick={() => handleActionSelect("add")}
                    className="w-full px-4 py-2 text-white transition-colors duration-300 bg-indigo-600 rounded-lg sm:w-1/3 hover:bg-indigo-700"
                  >
                    Add New Panel Details
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  setStatus(null);
                  setSelectedActionType("");
                  setNewPanelRows([]);
                  setTotalPanelsInput("");
                  setInlineEditError("");
                  setInlineEditSuccess("");
                  setSelectedPanelIds([]);
                  setChangingPanelQuantities({});
                  setTotalPanelsToChangeInput("");
                }}
                className="self-center w-full px-4 py-2 text-gray-800 transition-colors duration-300 bg-gray-300 rounded-lg sm:w-1/4 hover:bg-gray-400"
              >
                Cancel
              </button>
            </>
          )}

          {status === "editing_table" && (
            <div className="flex flex-col gap-3 mt-4 sm:flex-row">
              <button
                onClick={handleSaveNewPanels}
                className="self-center w-full px-4 py-2 text-white transition-colors duration-300 bg-blue-600 rounded-lg sm:w-1/3 hover:bg-blue-700"
              >
                Submit Changes
              </button>
              <button
                onClick={() => {
                  setStatus("show_action_buttons"); // Go back to the individual action buttons
                  setNewPanelRows([]);
                  setTotalPanelsInput("");
                  setInlineEditError("");
                  setInlineEditSuccess("");
                  setSelectedPanelIds([]);
                  setChangingPanelQuantities({});
                  setTotalPanelsToChangeInput("");
                }}
                className="self-center w-full px-4 py-2 text-gray-800 transition-colors duration-300 bg-gray-300 rounded-lg sm:w-1/3 hover:bg-gray-400"
              >
                Back to Options
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SolarPanelDetailsModel;