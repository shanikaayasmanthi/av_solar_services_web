import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { BASE_URL } from "../constants/BaseUrl.jsx";

const Users = () => {
  const [groupedUsers, setGroupedUsers] = useState({});
  const [selectedType, setSelectedType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const usersPerPage = 9; 

  const { token, user: currentUser } = useAuth(); // Get current logged-in user
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}api/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const usersData = res.data.data.users;

        const grouped = usersData.reduce((acc, user) => {
          const type = user.user_type;
          if (!acc[type]) acc[type] = [];
          acc[type].push(user);
          return acc;
        }, {});
        setGroupedUsers(grouped);

        const firstType = Object.keys(grouped)[0] || '';
        setSelectedType(firstType);
        setCurrentPage(1); // reset page
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, [token]);

  const userTypes = Object.keys(groupedUsers);

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setCurrentPage(1); // reset page when changing type
  };

  // Filter users based on search term
  const filteredUsers = (groupedUsers[selectedType] || []).filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  });

  // Check if activate/deactivate button should be shown for a specific user
  const shouldShowToggleButton = (user) => {
    if (!currentUser) return false;
    
    // Super admin can toggle all users except customers
    if (currentUser.user_type === 'super admin' && user.user_type !== 'customer') {
      return true;
    }
    
    // Admin cannot toggle any users
    if (currentUser.user_type === 'admin') {
      return false;
    }
    
    // Default: don't show button
    return false;
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  useEffect(() => {
    console.log("Logged in userType:", currentUser?.user_type);
  }, [currentUser]);

  return (
    <div className="origin-top-left scale-[0.75] w-[133.33%] max-h-[70vh]">
      <div className="relative mx-auto">
        <h1 className="mb-0 text-3xl font-bold text-gray-800">User Status Overview</h1>

        <div className="flex flex-col items-start justify-end gap-4 mb-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="flex flex-wrap gap-3">
              {userTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeChange(type)}
                  className={`px-1 py-1 rounded-md text-lg font-medium transition ${
                    selectedType === type
                      ? 'text-teal-400'
                      : 'text-teal-600 hover:text-teal-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or email..."
                className="px-4 py-2 pl-10 text-gray-700 bg-gray-100 border border-transparent rounded-md w-80 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute text-gray-500 transform -translate-y-1/2 left-3 top-1/2">
                <SearchIcon />
              </div>
            </div>

            <div className="relative inline-block group">
  {/* The Icon Container */}
  <div
    className="flex items-center justify-center p-2 text-white transition-all bg-teal-500 rounded-md shadow-md cursor-pointer hover:bg-teal-600 hover:scale-110"
    onClick={() => navigate('/add-user')}
  >
    <AddIcon fontSize="medium" />
  </div>

  {/* Tooltip Label */}
  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-[9999]">
    <span className="bg-gray-800 text-white text-[11px] px-2 py-1 rounded shadow-xl whitespace-nowrap">
      Add New User
    </span>
    {/* Tooltip Arrow */}
    <div className="w-2 h-2 -mt-1 rotate-45 bg-gray-800"></div>
  </div>
</div>
          </div>
        </div>

        {selectedType && groupedUsers[selectedType] && (
          <div className="mb-10">
            <div className="flex space-between col-2">
              <h2 className="mb-4 text-2xl font-semibold text-gray-700 capitalize">{selectedType}</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {currentUsers.map((user) => (
                <div
                  key={user.id}
                  className="relative p-5 bg-white border border-gray-200 shadow-md rounded-xl"
                >
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="mb-1 text-lg font-bold text-gray-800">{user.name}</h3>
                    <span
                      className={
                        user.is_active
                          ? 'text-green-700 font-bold'
                          : 'text-red-700 font-bold'
                      }
                    >
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="mb-1 text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {user.email}
                  </p>
                  {user.phones && user.phones.length > 0 && (
                    <p className="mb-1 text-sm text-gray-600">
                      <span className="font-medium">Phone:</span> {user.phones.join(', ')}
                    </p>
                  )}
                  
                  {shouldShowToggleButton(user) && (
                    <div className="absolute bottom-3 right-3">
                      <button
                        onClick={async () => {
                          try {
                            await axios.patch(
                              `${BASE_URL}api/users/${user.id}/toggle-status`,
                              {},
                              { headers: { Authorization: `Bearer ${token}` } }
                            );
                            // Refresh users after toggle
                            const res = await axios.get(`${BASE_URL}api/users`, {
                              headers: { Authorization: `Bearer ${token}` },
                            });
                            const usersData = res.data.data.users;
                            const grouped = usersData.reduce((acc, u) => {
                              const type = u.user_type;
                              if (!acc[type]) acc[type] = [];
                              acc[type].push(u);
                              return acc;
                            }, {});
                            setGroupedUsers(grouped);
                          } catch (err) {
                            console.error('Failed to update status:', err);
                          }
                        }}
                        className={`px-3 py-1 rounded-md text-white text-sm shadow-md transition hover:scale-105 ${
                          user.is_active ? 'bg-blue-400 hover:bg-blue-500' : 'bg-green-500 hover:bg-green-600'
                        }`}
                      >
                        {user.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-end mt-6 mb-5">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 mx-1 text-white bg-teal-500 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-2 py-2 font-semibold">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 mx-1 text-white bg-teal-500 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;