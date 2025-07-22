import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const BatteryDetailsModel = ({ show, onClose, offgridProjectId }) => {
    if (!show) {
        return null;
    }

    const { token } = useAuth();
    const [loadingData, setLoadingData] = useState(true);
    const [batteryData, setBatteryData] = useState([]); // Existing batteries
    const [error, setError] = useState(null);

    const [status, setStatus] = useState(null); // null, 'changing_batteries_mode'
    const [inlineEditError, setInlineEditError] = useState('');
    const [inlineEditSuccess, setInlineEditSuccess] = useState('');

    // For changing batteries
    const [selectedBatteryIdsToRemove, setSelectedBatteryIdsToRemove] = useState([]); // IDs of existing batteries to delete
    const [newBatteryRows, setNewBatteryRows] = useState([]); // Details of new batteries to add

    const fetchBatteryData = useCallback(async () => {
        setLoadingData(true);
        setError(null);
        setInlineEditError('');
        setInlineEditSuccess('');
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/get-batteries', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    off_grid_hybrid_project_id: offgridProjectId
                }
            });
            if (response.status === 200) {
                const responseData = response.data.data.batteries;
                setBatteryData(responseData);
                setLoadingData(false);
            } else {
                console.error("Failed to fetch battery data:", response.data.message);
                setError(response.data.message || "Failed to fetch battery data.");
                setLoadingData(false);
            }
        } catch (error) {
            console.error("Error fetching battery data:", error);
            if (error.response && error.response.status === 404) {
                setError("No battery data added to this project.");
                setBatteryData([]);
            } else {
                setError("An error occurred while fetching battery data.");
            }
            setLoadingData(false);
        }
    }, [token, offgridProjectId]);

    useEffect(() => {
        if (show) {
            fetchBatteryData();
        }
    }, [show, fetchBatteryData]);

    const handleEnterChangeMode = () => {
        setStatus('changing_batteries_mode');
        setSelectedBatteryIdsToRemove([]);
        setNewBatteryRows([]);
        setInlineEditError('');
        setInlineEditSuccess('');
    };

    const handleExitChangeMode = () => {
        setStatus(null);
        setSelectedBatteryIdsToRemove([]);
        setNewBatteryRows([]);
        setInlineEditError('');
        setInlineEditSuccess('');
        fetchBatteryData(); // Re-fetch data to show current state
    };

    const handleBatterySelectionToRemove = (batteryId) => {
        setSelectedBatteryIdsToRemove((prev) =>
            prev.includes(batteryId)
                ? prev.filter((id) => id !== batteryId)
                : [...prev, batteryId]
        );
        setInlineEditError(""); // Clear error on selection change
    };

    const addNewEmptyBatteryRow = () => {
        const newRow = {
            id: `new-${Date.now()}-${newBatteryRows.length}`, // Unique ID for React key
            battery_brand: "",
            battery_model: "",
            battery_serial_no: "",
            battery_capacity: "",
            isNew: true, // Marker for new rows
        };
        setNewBatteryRows((prev) => [...prev, newRow]);
        setInlineEditError("");
    };

    const handleNewRowChange = (index, field, value) => {
        const updatedRows = [...newBatteryRows];
        updatedRows[index] = { ...updatedRows[index], [field]: value };
        setNewBatteryRows(updatedRows);
        setInlineEditError("");
    };

    const handleDeleteNewRow = (id) => {
        setNewBatteryRows((prev) => prev.filter((row) => row.id !== id));
        setInlineEditError("");
    };

    const handleSaveBatteryChanges = async () => {
        setInlineEditError("");
        setInlineEditSuccess("");

        if (selectedBatteryIdsToRemove.length === 0 && newBatteryRows.length === 0) {
            setInlineEditError("Please select batteries to remove or add new batteries.");
            return;
        }

        const payloadNewBatteries = [];
        try {
            for (const row of newBatteryRows) {
                if (
                    !row.battery_brand || !row.battery_model || !row.battery_serial_no || !row.battery_capacity
                ) {
                    throw new Error("Please fill all fields for each new battery entry.");
                }
                const capacity = parseFloat(row.battery_capacity);
                if (isNaN(capacity) || capacity <= 0) {
                    throw new Error('Please enter a valid capacity (greater than 0) for all new batteries.');
                }
                payloadNewBatteries.push({
                    battery_brand: row.battery_brand,
                    battery_model: row.battery_model,
                    battery_serial_no: row.battery_serial_no,
                    battery_capacity: capacity,
                });
            }
        } catch (validationError) {
            setInlineEditError(validationError.message);
            return;
        }

        // Construct payload
        const payload = {
            off_grid_hybrid_project_id: offgridProjectId,
            battery_ids_to_remove: selectedBatteryIdsToRemove,
            batteries_to_add: payloadNewBatteries,
        };

        try {
            const apiUrl = "http://127.0.0.1:8000/api/change-batteries"; // **NEW API ENDPOINT**

            const response = await axios.post(apiUrl, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200 && response.data.status === "Request was successful.") {
                setInlineEditSuccess("Batteries updated successfully!");
                handleExitChangeMode(); // Re-fetch data and exit edit mode
            } else {
                setInlineEditError(
                    response.data.message || `Failed to update batteries. Please try again.`
                );
            }
        } catch (error) {
            console.error("Error in handleSaveBatteryChanges:", error);
            if (error.response) {
                if (error.response.status === 422) {
                    const errors = error.response.data.errors;
                    let errorMessage = "Please enter valid data: ";
                    if (errors) {
                        for (const key in errors) {
                            errorMessage += errors[key].join(", ") + " ";
                        }
                    } else if (error.response.data.message) {
                        errorMessage = error.response.data.message;
                    }
                    setInlineEditError(errorMessage);
                } else if (error.response.status === 401) {
                    setInlineEditError("Unauthorized access. Please log in again.");
                } else if (error.response.status === 400) {
                    setInlineEditError(
                        error.response.data.message ||
                        "An error occurred with your battery request."
                    );
                } else {
                    setInlineEditError("An unexpected error occurred. Please try again.");
                }
            } else {
                setInlineEditError("Network error. Please check your connection.");
            }
        }
    };

    const currentTotalBatteries = batteryData.length - selectedBatteryIdsToRemove.length + newBatteryRows.length;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999] p-5 box-border"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative bg-white p-5 rounded-xl w-[740px] max-w-[800px] max-h-[70vh] overflow-y-auto shadow-lg flex flex-col gap-4 box-border
                           sm:p-4 md:p-5"
            >
                <span
                    className="absolute top-2.5 right-4 text-2xl cursor-pointer"
                    onClick={onClose}
                >
                    &times;
                </span>

                <h2 className="mb-2 text-xl font-semibold">
                    Battery Details
                    {status === 'changing_batteries_mode' && " - Change Mode"}
                </h2>

                {loadingData ? (
                    <p className="py-4 text-center">Loading battery data...</p>
                ) : error ? (
                    <p className="py-4 text-center text-red-500">{error}</p>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-black border-collapse mt-1.5 mb-1.5">
                                <thead>
                                    <tr>
                                        {status === "changing_batteries_mode" && (
                                            <th className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">
                                                Remove?
                                            </th>
                                        )}
                                        <th className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">Brand</th>
                                        <th className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">Battery model code</th>
                                        <th className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">Battery Serial No</th>
                                        <th className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">Battery Capacity</th>
                                        {status === "changing_batteries_mode" && (
                                            <th className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm"></th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {batteryData.length === 0 && newBatteryRows.length === 0 && status !== 'changing_batteries_mode' ? (
                                        <tr>
                                            <td colSpan={status === "changing_batteries_mode" ? 6 : 4} className="border border-gray-300 p-2.5 text-center text-gray-500">
                                                No battery data available.
                                            </td>
                                        </tr>
                                    ) : (
                                        batteryData.map((battery) => (
                                            <tr key={battery.id}>
                                                {status === "changing_batteries_mode" && (
                                                    <td className="border border-gray-300 p-2.5 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedBatteryIdsToRemove.includes(battery.id)}
                                                            onChange={() => handleBatterySelectionToRemove(battery.id)}
                                                            className="scale-125"
                                                        />
                                                    </td>
                                                )}
                                                <td className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">{battery.battery_brand}</td>
                                                <td className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">{battery.battery_model}</td>
                                                <td className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">{battery.battery_serial_no}</td>
                                                <td className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">{battery.battery_capacity}</td>
                                                {status === "changing_batteries_mode" && (
                                                    <td className="border border-gray-300 p-2.5"></td> // Empty cell for new row delete button alignment
                                                )}
                                            </tr>
                                        ))
                                    )}

                                    {/* New Battery Rows section */}
                                    {status === "changing_batteries_mode" && (
                                        <>
                                            {selectedBatteryIdsToRemove.length > 0 && ( // Only show "New Batteries to Add" if something is selected for removal
                                                <tr>
                                                    <td colSpan={6} className="p-2 font-bold text-center bg-gray-100">
                                                        New Batteries to Add (Replacement)
                                                    </td>
                                                </tr>
                                            )}
                                            {newBatteryRows.map((row, index) => (
                                                <tr key={row.id}>
                                                    <td className="border border-gray-300 p-2.5"></td> {/* Empty cell for checkbox column */}
                                                    <td className="border border-gray-300 p-2.5">
                                                        <input type="text" value={row.battery_brand} onChange={(e) => handleNewRowChange(index, "battery_brand", e.target.value)} className="w-full p-1 border rounded" placeholder="Brand" />
                                                    </td>
                                                    <td className="border border-gray-300 p-2.5">
                                                        <input type="text" value={row.battery_model} onChange={(e) => handleNewRowChange(index, "battery_model", e.target.value)} className="w-full p-1 border rounded" placeholder="Model Code" />
                                                    </td>
                                                    <td className="border border-gray-300 p-2.5">
                                                        <input type="text" value={row.battery_serial_no} onChange={(e) => handleNewRowChange(index, "battery_serial_no", e.target.value)} className="w-full p-1 border rounded" placeholder="Serial No" />
                                                    </td>
                                                    <td className="border border-gray-300 p-2.5">
                                                        <input type="number" value={row.battery_capacity} onChange={(e) => handleNewRowChange(index, "battery_capacity", e.target.value)} className="w-full p-1 border rounded" placeholder="Capacity" min="1" step="0.01" />
                                                    </td>
                                                    <td className="border border-gray-300 p-2.5 text-center">
                                                        <button onClick={() => handleDeleteNewRow(row.id)} className="text-lg text-red-500 hover:text-red-700">
                                                            &times;
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {status === "changing_batteries_mode" && (
                                                <tr>
                                                    <td colSpan={6} className="p-2 text-center">
                                                        <button onClick={addNewEmptyBatteryRow} className="px-3 py-1 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                                                            + Add New Battery Entry
                                                        </button>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-2 font-semibold text-right text-gray-700">
                            Current Batteries in Project: {batteryData.length}
                            {status === 'changing_batteries_mode' && (
                                <span className="ml-4">
                                    (Selected for removal: {selectedBatteryIdsToRemove.length}, New to add: {newBatteryRows.length})
                                    <br />
                                    Estimated total after change: {currentTotalBatteries}
                                </span>
                            )}
                        </div>
                        {inlineEditError && (
                            <p className="py-2 text-center text-red-500">{inlineEditError}</p>
                        )}
                        {inlineEditSuccess && (
                            <p className="py-2 text-center text-green-500">{inlineEditSuccess}</p>
                        )}
                    </>
                )}

                {/* Button Wrapper */}
                <div className="flex justify-end gap-3 mt-4 sm:justify-center">
                    {status === 'changing_batteries_mode' ? (
                        <>
                            <button
                                className="self-center w-full px-4 py-2 text-gray-800 transition-colors duration-300 bg-gray-300 rounded-lg sm:w-1/4 hover:bg-gray-400"
                                onClick={handleExitChangeMode}
                            >
                                Cancel
                            </button>
                            <button
                                className="self-center w-full px-4 py-2 text-white transition-colors duration-300 bg-blue-600 rounded-lg sm:w-1/3 hover:bg-blue-700"
                                onClick={handleSaveBatteryChanges}
                            >
                                Apply Changes
                            </button>
                        </>
                    ) : (
                        <button
                            className="bg-[#00a68b] text-white border-none px-1 py-1 rounded-xl cursor-pointer transition-colors duration-300 hover:bg-[#007b6b]
                                       w-auto self-center sm:w-1/4 sm:px-1 sm:py-1.5"
                            onClick={handleEnterChangeMode}
                        >
                            Change Batteries
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BatteryDetailsModel;