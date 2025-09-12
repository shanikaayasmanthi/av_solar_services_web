import React, { useEffect, useState } from 'react';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { BASE_URL } from "../constants/BaseUrl.jsx";

const Adduser = () => {
  const [userTypes, setUserTypes] = useState([]);
  const { token, user: currentUser } = useAuth();
  const [formData, setFormData] = useState({
  name: '',
  email: '',
  nic: '',
  phone: '',
  user_type_id: '',
});
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

    // Filter user types based on current user role
  const filteredUserTypes = userTypes.filter((type) => {
    if (currentUser?.user_type === 'admin') {
      // Admin can only add supervisors (assuming supervisor has id 2)
      return type.id === 2;
    } else if (currentUser?.user_type === 'super admin') {
      // Super admin can add all user types except customer (id 3)
      return type.id !== 3;
    }
    return false;
  });

  useEffect(() => {
    const fetchUserTypes = async () => {
      try {
        const response = await axios.get(`${BASE_URL}api/user-types`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserTypes(response.data.data.user_types); 
      } catch (error) {
        console.error('Failed to fetch user types:', error);
      }
    };

    fetchUserTypes();
  }, [token]);

  const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};



 const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post(
        `${BASE_URL}api/users`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('User added successfully!');

  setFormData({
    name: '',
    email: '',
    nic: '',
    phone: '',
    user_type_id: '',
  });
}  catch (err) {
  if (err.response && err.response.status === 422) {
    const errors = err.response.data.errors;

    if (errors?.email?.[0]?.toLowerCase().includes('taken')) {
      toast.error('This email is already registered.');
    } else if (errors?.nic?.[0]?.toLowerCase().includes('unique')) {
      toast.error('NIC number must be unique.');
    } else {
      toast.error('Validation failed. Please check all fields.');
    }
  } else {
    toast.error('Something went wrong. Please try again.');
  }
}


  };
  

  return (
    <div className="origin-top-left scale-[0.75] w-[133.33%]">
    <div className="relative mx-auto ">
                <div className='flex gap-1 align-middle contents-center'>
            <div className=' text-black cursor-pointer bg-transparent px-2 py-2 hover:bg-teal-100 rounded-md transition-colors duration-200 mb-10' onClick={() => navigate(-1)}>
              <ArrowBackIcon fontSize='medium' />
            </div>
               <h1 className="text-3xl font-bold text-gray-800 ">User Management</h1>

            </div>
 
      <div className="w-full  max-w-5xl bg-white shadow-lg rounded-xl p-8 border border-gray-200 mt-15 mb-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Add New User</h2>

        {/* Success or Error Messages */}
        {message && <p className="text-teal-600 text-center font-medium mb-4">{message}</p>}
        {error && <p className="text-red-800 text-center font-medium mb-4">{error}</p>}
        <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-md font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
                className="border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-md font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          {/* Address & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-md font-medium text-gray-700 mb-2">NIC Number</label>
              <input
                type="text"
                name="nic"
                value={formData.nic}
                onChange={handleChange}
                placeholder="Enter NIC number"
                className="border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-md font-medium text-gray-700 mb-2">Tel. No</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          {/* Role Dropdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-md font-medium text-gray-700 mb-2">Role</label>
              {/* <select
                name="user_type_id"
                value={formData.user_type_id}
                onChange={handleChange}
                className="width-md border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              >
                <option value="" disabled>Select User Role</option>
                {userTypes
                  .filter((type) => type.id !== 3)
                  .map((type) => (
                    <option
                      key={type.id}
                      value={type.id}
                      className="text-sm"
                    >
                      {type.name}
                    </option>

                ))}
              </select> */}
                <select
      name="user_type_id"
      value={formData.user_type_id}
      onChange={handleChange}
      className="width-md border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
      required
    >
      <option value="" disabled>Select User Role</option>
      {filteredUserTypes.map((type) => (
        <option
          key={type.id}
          value={type.id}
          className="text-sm"
        >
          {type.name}
        </option>
      ))}
    </select>

            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-teal-600 text-white font-semibold mt-5 mb-10 px-6 py-2 rounded-md hover:bg-teal-700 transition"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default Adduser;
