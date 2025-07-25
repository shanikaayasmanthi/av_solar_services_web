import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

const Users = () => {
  const [groupedUsers, setGroupedUsers] = useState({});
  const [selectedType, setSelectedType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const usersPerPage = 9; 

  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/users', {
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

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="relative mx-auto">
    
     <h1 className="text-3xl font-bold text-gray-800 mb-0">User Status Overview</h1>

    <div className="flex flex-col md:flex-row justify-end items-start md:items-center gap-4  mb-6">


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
            className="w-80 px-4 py-2 pl-10 text-gray-700 bg-gray-100 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <SearchIcon />
          </div>
        </div>

        <div
          className="rounded-md p-2 bg-teal-500 text-white cursor-pointer shadow-md hover:bg-teal-600 transition hover:scale-110"
          onClick={() => navigate('/add-user')}
        >
          <AddIcon fontSize="medium" />
        </div>
      </div>
    </div>

      {selectedType && groupedUsers[selectedType] && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 capitalize mb-4">{selectedType}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {currentUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white shadow-md rounded-xl p-5 border border-gray-200 relative transition hover:shadow-lg"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-1">{user.name}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Status:</span>{' '}
                  <span
                    className={
                      user.is_active
                        ? 'text-green-600 font-semibold'
                        : 'text-red-600 font-semibold'
                    }
                  >
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </p>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-end mt-6 ">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 mx-1 bg-teal-500 text-white rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-2 py-2 font-semibold">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 mx-1 bg-teal-500 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Users;