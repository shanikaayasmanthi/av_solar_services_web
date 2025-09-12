import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BASE_URL } from "../constants/BaseUrl.jsx";

const InverterDetailsModel = ({ show, onClose, projectId, noOfInvertersAllowed }) => { // Renamed prop for clarity
    if (!show) {
        return null;
    }

    const { token } = useAuth();
    const [loadingData, setLoadingData] = useState(true);
    const [inverterData, setInverterData] = useState([]); // Existing inverters
    const [error, setError] = useState(null);

    const [status, setStatus] = useState(null); // null, 'changing_inverters_mode'
    const [inlineEditError, setInlineEditError] = useState('');
    const [inlineEditSuccess, setInlineEditSuccess] = useState('');

    // For changing inverters
    const [selectedInverterIdsToRemove, setSelectedInverterIdsToRemove] = useState([]); // IDs of existing inverters to delete
    const [newInverterRows, setNewInverterRows] = useState([]); // Details of new inverters to add

    const fetchInverterData = useCallback(async () => {
        setLoadingData(true);
        setError(null);
        setInlineEditError('');
        setInlineEditSuccess('');
        try {
            const response = await axios.get(`${BASE_URL}api/get-inverters`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    project_id: projectId
                }
            });
            if (response.status === 200) {
                const responseData = response.data.data.inverters;
                setInverterData(responseData);
                setLoadingData(false);
            } else {
                console.error("Failed to fetch inverter data:", response.data.message);
                setError(response.data.message || "Failed to fetch inverter data.");
                setLoadingData(false);
            }
        } catch (error) {
            console.error("Error fetching inverter data:", error);
            if (error.response && error.response.status === 404) {
                setError("No inverter data added to this project.");
                setInverterData([]);
            } else {
                setError("An error occurred while fetching inverter data.");
            }
            setLoadingData(false);
        }
    }, [token, projectId]);

    useEffect(() => {
        if (show) {
            fetchInverterData();
        }
    }, [show, fetchInverterData]);

    const handleEnterChangeMode = () => {
        setStatus('changing_inverters_mode');
        setSelectedInverterIdsToRemove([]);
        setNewInverterRows([]);
        setInlineEditError('');
        setInlineEditSuccess('');
    };

    const handleExitChangeMode = () => {
        setStatus(null);
        setSelectedInverterIdsToRemove([]);
        setNewInverterRows([]);
        setInlineEditError('');
        setInlineEditSuccess('');
        fetchInverterData(); // Re-fetch data to show current state
    };

    const handleInverterSelectionToRemove = (inverterId) => {
        setSelectedInverterIdsToRemove((prev) =>
            prev.includes(inverterId)
                ? prev.filter((id) => id !== inverterId)
                : [...prev, inverterId]
        );
        setInlineEditError(""); // Clear error on selection change
    };

    const addNewEmptyInverterRow = () => {
        const newRow = {
            id: `new-${Date.now()}-${newInverterRows.length}`, // Unique ID for React key
            brand: "",
            model_no: "",
            check_code: "",
            serial_no: "",
            capacity: "",
            isNew: true, // Marker for new rows
        };
        setNewInverterRows((prev) => [...prev, newRow]);
        setInlineEditError("");
    };

    const handleNewRowChange = (index, field, value) => {
        const updatedRows = [...newInverterRows];
        updatedRows[index] = { ...updatedRows[index], [field]: value };
        setNewInverterRows(updatedRows);
        setInlineEditError("");
    };

    const handleDeleteNewRow = (id) => {
        setNewInverterRows((prev) => prev.filter((row) => row.id !== id));
        setInlineEditError("");
    };

    const handleSaveInverterChanges = async () => {
        setInlineEditError("");
        setInlineEditSuccess("");

        if (selectedInverterIdsToRemove.length === 0 && newInverterRows.length === 0) {
            setInlineEditError("Please select inverters to remove or add new inverters.");
            return;
        }
        
        // Validation: If new inverters are added, ensure all fields are filled
        const payloadNewInverters = [];
        try {
            for (const row of newInverterRows) {
                if (
                    !row.brand || !row.model_no || !row.check_code || !row.serial_no || !row.capacity
                ) {
                    throw new Error("Please fill all fields for each new inverter entry.");
                }
                const capacity = parseFloat(row.capacity);
                if (isNaN(capacity) || capacity <= 0) {
                    throw new Error('Please enter a valid capacity (greater than 0) for all new inverters.');
                }
                payloadNewInverters.push({
                    brand: row.brand,
                    model_no: row.model_no,
                    check_code: row.check_code,
                    serial_no: row.serial_no,
                    capacity: capacity,
                });
            }
        } catch (validationError) {
            setInlineEditError(validationError.message);
            return;
        }

        // Optional: If you want to enforce a 1-to-1 replacement:
        // if (selectedInverterIdsToRemove.length !== payloadNewInverters.length) {
        //     setInlineEditError("The number of new inverters must match the number of inverters being removed for a direct replacement.");
        //     return;
        // }

        // Optional: Check if total inverters after change exceed project's allowed
        const currentInverterCount = inverterData.length;
        const netChange = payloadNewInverters.length - selectedInverterIdsToRemove.length;
        if (noOfInvertersAllowed !== undefined && (currentInverterCount + netChange) > noOfInvertersAllowed) {
            setInlineEditError(`Adding these inverters would exceed the project's total allowed inverter capacity of ${noOfInvertersAllowed}. Current: ${currentInverterCount}, Change: ${netChange}.`);
            return;
        }
        
        // Construct payload
        const payload = {
            project_id: projectId,
            inverter_ids_to_remove: selectedInverterIdsToRemove,
            inverters_to_add: payloadNewInverters,
        };

        try {
            const apiUrl = `${BASE_URL}api/change-inverters`;

            const response = await axios.post(apiUrl, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200 && response.data.status === "Request was successful.") {
                setInlineEditSuccess("Inverters updated successfully!");
                handleExitChangeMode(); // Re-fetch data and exit edit mode
            } else {
                setInlineEditError(
                    response.data.message || `Failed to update inverters. Please try again.`
                );
            }
        } catch (error) {
            console.error("Error in handleSaveInverterChanges:", error);
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
                        "An error occurred with your inverter request."
                    );
                } else {
                    setInlineEditError("An unexpected error occurred. Please try again.");
                }
            } else {
                setInlineEditError("Network error. Please check your connection.");
            }
        }
    };

    const currentTotalInverters = inverterData.length - selectedInverterIdsToRemove.length + newInverterRows.length;

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
                    Inverter Details
                    {status === 'changing_inverters_mode' && " - Change Mode"}
                </h2>

                {loadingData ? (
                    <p className="py-4 text-center">Loading inverter data...</p>
                ) : error ? (
                    <p className="py-4 text-center text-red-500">{error}</p>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-black border-collapse mt-1.5 mb-1.5">
                                <thead>
                                    <tr>
                                        {status === "changing_inverters_mode" && (
                                            <th className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">
                                                Remove?
                                            </th>
                                        )}
                                        <th className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">Brand</th>
                                        <th className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">Inv. model code</th>
                                        <th className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">Inv. Check Code</th>
                                        <th className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">Inv. Serial No</th>
                                        <th className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">Inv. Capacity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inverterData.length === 0 && newInverterRows.length === 0 && status !== 'changing_inverters_mode' ? (
                                        <tr>
                                            <td colSpan={status === "changing_inverters_mode" ? 6 : 5} className="border border-gray-300 p-2.5 text-center text-gray-500">
                                                No inverter data available.
                                            </td>
                                        </tr>
                                    ) : (
                                        inverterData.map((inverter) => (
                                            <tr key={inverter.id}>
                                                {status === "changing_inverters_mode" && (
                                                    <td className="border border-gray-300 p-2.5 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedInverterIdsToRemove.includes(inverter.id)}
                                                            onChange={() => handleInverterSelectionToRemove(inverter.id)}
                                                            className="scale-125"
                                                        />
                                                    </td>
                                                )}
                                                <td className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">{inverter.brand}</td>
                                                <td className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">{inverter.invertor_model_no}</td>
                                                <td className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">{inverter.invertor_check_code}</td>
                                                <td className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">{inverter.invertor_serial_no}</td>
                                                <td className="border border-gray-300 p-2.5 text-center break-words text-base sm:text-sm">{inverter.invertor_capacity}</td>
                                            </tr>
                                        ))
                                    )}

                                    {/* New Inverter Rows section */}
                                    {status === "changing_inverters_mode" && (
                                        <>
                                            {selectedInverterIdsToRemove.length > 0 && ( // Only show "New Inverters to Add" if something is selected for removal
                                                <tr>
                                                    <td colSpan={6} className="p-2 font-bold text-center bg-gray-100">
                                                        New Inverters to Add (Replacement)
                                                    </td>
                                                </tr>
                                            )}
                                            {newInverterRows.map((row, index) => (
                                                <tr key={row.id}>
                                                    <td className="border border-gray-300 p-2.5"></td> {/* Empty cell for checkbox column */}
                                                    <td className="border border-gray-300 p-2.5">
                                                        <input type="text" value={row.brand} onChange={(e) => handleNewRowChange(index, "brand", e.target.value)} className="w-full p-1 border rounded" placeholder="Brand" />
                                                    </td>
                                                    <td className="border border-gray-300 p-2.5">
                                                        <input type="text" value={row.model_no} onChange={(e) => handleNewRowChange(index, "model_no", e.target.value)} className="w-full p-1 border rounded" placeholder="Model No" />
                                                    </td>
                                                    <td className="border border-gray-300 p-2.5">
                                                        <input type="text" value={row.check_code} onChange={(e) => handleNewRowChange(index, "check_code", e.target.value)} className="w-full p-1 border rounded" placeholder="Check Code" />
                                                    </td>
                                                    <td className="border border-gray-300 p-2.5">
                                                        <input type="text" value={row.serial_no} onChange={(e) => handleNewRowChange(index, "serial_no", e.target.value)} className="w-full p-1 border rounded" placeholder="Serial No" />
                                                    </td>
                                                    <td className="border border-gray-300 p-2.5">
                                                        <input type="number" value={row.capacity} onChange={(e) => handleNewRowChange(index, "capacity", e.target.value)} className="w-full p-1 border rounded" placeholder="Capacity" min="1" step="0.01" />
                                                    </td>
                                                    <td className="border border-gray-300 p-2.5 text-center">
                                                        <button onClick={() => handleDeleteNewRow(row.id)} className="text-lg text-red-500 hover:text-red-700">
                                                            &times;
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {status === "changing_inverters_mode" && (
                                                <tr>
                                                    <td colSpan={6} className="p-2 text-center">
                                                        <button onClick={addNewEmptyInverterRow} className="px-3 py-1 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                                                            + Add New Inverter Entry
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
                            Current Inverters in Project: {inverterData.length}
                            {status === 'changing_inverters_mode' && (
                                <span className="ml-4">
                                    (Selected for removal: {selectedInverterIdsToRemove.length}, New to add: {newInverterRows.length})
                                    <br />
                                    Estimated total after change: {currentTotalInverters}
                                    {noOfInvertersAllowed !== undefined && `, Allowed: ${noOfInvertersAllowed}`}
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

                <div className="flex justify-end gap-3 mt-4 sm:justify-center">
                    {status === 'changing_inverters_mode' ? (
                        <>
                            <button
                                className="self-center w-full px-4 py-2 text-gray-800 transition-colors duration-300 bg-gray-300 rounded-lg sm:w-1/4 hover:bg-gray-400"
                                onClick={handleExitChangeMode}
                            >
                                Cancel
                            </button>
                            <button
                                className="self-center w-full px-4 py-2 text-white transition-colors duration-300 bg-blue-600 rounded-lg sm:w-1/3 hover:bg-blue-700"
                                onClick={handleSaveInverterChanges}
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
                            Change Inverters
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InverterDetailsModel;