import React, { useState } from "react";

const HoldConfirmationModal = ({ show, onClose, onConfirm, actionType }) => {
  const [remarks, setRemarks] = useState("");

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">
          {actionType === "hold" ? "Hold this Project?" : "Release this Project?"}
        </h2>
        <textarea
          placeholder="Enter remarks..."
          className="w-full border rounded-md p-2 mb-4"
          rows="3"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
            onClick={() => onConfirm(remarks)}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default HoldConfirmationModal;

