import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const AddModel = ({ show, onClose }) => {
  const navigate = useNavigate();
  const modalRef = useRef(null);

  const handleDetailsClick = () => {
    navigate("/CustomerDetails",{state:{customerType:'new'}});
  };

  const handleDetailsClick1 = () => {
    navigate("/CustomerDetails",{state:{customerType:'existing'}});
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      ref={modalRef}
      className="absolute right-0 z-50 w-auto mt-2 bg-white border border-gray-200 rounded-md shadow-md top-full md:w-max"
    >
      <div className="flex flex-col items-center justify-center p-2">
        <p className="w-full px-4 py-2 text-center text-black cursor-pointer hover:bg-gray-100 rounded-t-md" onClick={handleDetailsClick}>
          New Customer
        </p>
        <hr className="w-4/5 my-1 border-t border-black" />
        <p className="w-full px-4 py-2 text-center text-black cursor-pointer hover:bg-gray-100 rounded-b-md" onClick={handleDetailsClick1}>
          Existing Customer
        </p>
      </div>
    </div>
  );
};

export default AddModel;