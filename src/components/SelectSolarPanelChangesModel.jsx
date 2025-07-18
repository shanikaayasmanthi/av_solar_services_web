import { useState } from 'react';
// import ChangingPanelsModal from './changingPanelModal.jsx';
// import ExpandingPanelsModal from './expandingPanelModal.jsx';
import React from 'react';
import ExpandPanelsModel from './ExpandPanelsModel';

const SelectSolarPanelChangesModel = ({ show, onClose,projectId, onPanelsUpdated, solarPanels }) => {
    const [selectedOption, setSelectedOption] = useState("");

    if (!show) return null;

    const handleChange = (e) => {
        setSelectedOption(e.target.value);
        
    };

    // Close the sub-modal and reset selection when the parent modal is closed
    const handleCloseParent = () => {
        setSelectedOption(""); // Reset selected option when parent modal closes
        onClose();
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999]"
            onClick={handleCloseParent}
        >
            <div
                className="bg-white rounded-xl shadow-lg w-[300px] max-w-[600px] h-[220px] relative p-4 flex flex-col items-center justify-center
                           sm:w-[400px] md:w-[500px]" // Responsive widths
                onClick={e => e.stopPropagation()}
            >
                {/* Close Button */}
                <span
          className="absolute top-2.5 right-4 text-2xl cursor-pointer" 
          onClick={onClose}
        >
          &times;
        </span>

                {/* Select Container */}
                <div className="flex items-center justify-center mt-8 h-40vh"> {/* Added margin-top to adjust for close button */}
                    <select
                        className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" // Tailwind form styles
                        value={selectedOption}
                        onChange={handleChange}
                    >
                        <option value="">Select Changes</option>
                        <option value="changing">Changing Exit Panels</option>
                        <option value="expanding">Expanding the Panels</option>
                        {solarPanels===true&&(<option value="add">Add Panel Details</option>)}
                    </select>
                </div>

                {/* Conditional Modals */}
                {selectedOption === "changing" && (
                    <ChangingPanelsModal onClose={() => setSelectedOption("")} />
                )}
                {(selectedOption === "expanding"||selectedOption==="add" )&& (
                    <ExpandPanelsModel onClose={() => setSelectedOption("")} projectId={projectId} onPanelsUpdated={onPanelsUpdated} option={selectedOption}/>
                )}
            </div>
        </div>
    );
}

export default SelectSolarPanelChangesModel;