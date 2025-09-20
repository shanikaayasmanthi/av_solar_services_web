import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { BASE_URL } from '../constants/BaseUrl';
import { useNavigate } from 'react-router-dom';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  Security as SecurityIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';

const Profile = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState('');

    // Password change states
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [user, token]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get(
        `${BASE_URL}api/profile/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 'success') {
        const profileData = response.data.data?.profile;
        if (profileData) {
          setProfileData(profileData);
          setEditData(profileData);
        } else {
          setError('Profile data format unexpected');
        }
      } else {
        setError(response.data.message || 'Failed to load profile');
      }
    } catch (err) {
      setError('An error occurred while loading profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSaveError('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(profileData);
    setSaveError('');
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      setSaveError('');

      const response = await axios.put(
        `${BASE_URL}api/profile/${user.id}`,
        editData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status === 'success') {
        setProfileData(response.data.data.profile);
        setIsEditing(false);
        // Show success message
        alert('Profile updated successfully!');
      } else {
        setSaveError(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = Object.values(err.response.data.errors).flat();
        setSaveError(errorMessages.join(', '));
      } else {
        setSaveError(err.response?.data?.message || 'An error occurred while updating profile');
      }
    } finally {
      setSaveLoading(false);
    }
  };

    // Password change functions
  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear errors when user starts typing
    if (passwordError) setPasswordError('');
    if (passwordSuccess) setPasswordSuccess('');
  };

  const handleChangePassword = async () => {
    try {
      setPasswordLoading(true);
      setPasswordError('');

      const response = await axios.post(
        `${BASE_URL}api/change-password`,
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status === 'success') {
        setPasswordSuccess('Password changed successfully!');
        setPasswordData({
          current_password: '',
          new_password: '',
          new_password_confirmation: ''
        });
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setPasswordSuccess('');
          setShowPasswordChange(false);
        }, 3000);
      } else {
        setPasswordError(response.data.message || 'Failed to change password');
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat();
        setPasswordError(errorMessages.join(', '));
      } else {
        setPasswordError(err.response?.data?.message || 'An error occurred while changing password');
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const cancelPasswordChange = () => {
    setShowPasswordChange(false);
    setPasswordData({
      current_password: '',
      new_password: '',
      new_password_confirmation: ''
    });
    setPasswordError('');
    setPasswordSuccess('');
  };

  return (
    <div className="realtive mx-auto p-1">
      <div className='flex gap-2 items-center mb-4'>
        <h1 className="text-2xl font-bold text-gray-800">User Profile</h1>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Profile Card - First Column */}
        <div className="w-full">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-xl">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Loading profile...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="bg-red-50 border border-red-200 rounded-xl shadow p-6 text-center h-64 flex flex-col justify-center">
              <h2 className="text-red-700 text-xl font-semibold mb-2">Error</h2>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchProfile}
                className="px-5 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors mx-auto"
              >
                Try Again
              </button>
            </div>
          )}

          {/* No Data State */}
          {!loading && !error && !profileData && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl shadow p-6 text-center h-64 flex items-center justify-center">
              <p className="text-yellow-700">No profile data available</p>
            </div>
          )}

          {/* Success State */}
          {!loading && !error && profileData && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 h-full relative">
              {/* Edit Icon - Top Right Corner */}
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="absolute top-4 right-4 bg-teal-600 text-white p-1.5 rounded-md hover:bg-teal-700 transition-colors hover:transform hover:scale-105"
                  title="Edit Profile"
                >
                  <EditIcon fontSize="small" />
                </button>
              )}

              <div className="text-center mb-5">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-teal-600 to-teal-400 rounded-full flex items-center justify-center shadow-md mb-4">
                  <PersonIcon className="text-white text-3xl" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-1">{profileData?.name}</h1>
                <p className="text-gray-500 text-sm font-semibold capitalize">{profileData?.user_type}</p>
              </div>

              {saveError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-red-700 text-sm">{saveError}</p>
                </div>
              )}

              <div className="space-y-4">
                {/* Name */}
                <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                  <PersonIcon className="text-teal-600 mr-3 text-xl" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Name</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    ) : (
                      <p className="font-semibold text-gray-800 text-sm">{profileData?.name}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                  <EmailIcon className="text-teal-600 mr-3 text-xl" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editData.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    ) : (
                      <p className="font-semibold text-gray-800 text-sm">{profileData?.email}</p>
                    )}
                  </div>
                </div>

                {/* Role - Not Editable */}
                <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                  <SecurityIcon className="text-teal-600 mr-3 text-xl" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Role</p>
                    <p className="font-semibold text-gray-800 text-sm capitalize">{profileData?.user_type}</p>
                  </div>
                </div>

                {/* Phone - Only for admin/super admin */}
                {profileData?.phone && (
                  <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                    <PhoneIcon className="text-teal-600 mr-3 text-xl" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editData.phone || ''}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                      ) : (
                        <p className="font-semibold text-gray-800 text-sm">{profileData.phone}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* NIC - Only for admin/super admin */}
                {profileData?.nic && (
                  <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                    <BadgeIcon className="text-teal-600 mr-3 text-xl" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">NIC</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.nic || ''}
                          onChange={(e) => handleInputChange('nic', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                      ) : (
                        <p className="font-semibold text-gray-800 text-sm">{profileData.nic}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={handleCancel}
                    className="px-2 py-1 text-sm bg-red-400 text-white rounded-md hover:bg-red-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saveLoading}
                    className="px-2 py-1 text-sm bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors disabled:opacity-50"
                  >
                    {saveLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/*  Change Password Card */}
        <div className="w-full">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 h-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Change Password</h3>
              
              {!showPasswordChange && (
                <button
                  onClick={() => setShowPasswordChange(true)}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm"
                >
                  Change Password
                </button>
              )}
            </div>

            {showPasswordChange && (
              <div className="space-y-4">
                {passwordSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-700 text-sm">{passwordSuccess}</p>
                  </div>
                )}

                {passwordError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-700 text-sm">{passwordError}</p>
                  </div>
                )}

                {/* Current Password */}
                <div className="space-y-2">
                  <label className="text-xs text-gray-600 font-medium">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.current_password}
                      onChange={(e) => handlePasswordChange('current_password', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <label className="text-xs text-gray-600 font-medium">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.new_password}
                      onChange={(e) => handlePasswordChange('new_password', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
                      placeholder="Enter new password (min. 8 characters)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-2">
                  <label className="text-xs text-gray-600 font-medium">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.new_password_confirmation}
                      onChange={(e) => handlePasswordChange('new_password_confirmation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </button>
                  </div>
                </div>

                {/* Buttons in same row */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={cancelPasswordChange}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleChangePassword}
                    disabled={passwordLoading}
                    className="flex-1 px-2 py-1 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
                  >
                    {passwordLoading ? 'Changing...' : 'Update Password'}
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center mt-2">
                  Password must be at least 8 characters long
                </p>
              </div>
            )}

            {!showPasswordChange && (
              <p className="text-sm text-gray-500 text-center mt-4">
                Click the button above to change your password
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;