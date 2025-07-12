// app/profile/settings/page.js
"use client"; // This is a client component

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/authContext'; // Import useAuth hook
import { useRouter } from 'next/navigation'; // Using Next.js router for redirection
import { motion, AnimatePresence } from 'framer-motion'; // Import motion for animations
import { useTheme } from "next-themes"; // Import useTheme for theme toggling
import { Sun, Moon, XCircle, AlertCircle } from 'lucide-react'; // Import Lucide icons for ThemeToggler and custom modal

// Custom Modal Component for Confirm/Alert
const CustomModal = ({ message, onConfirm, onCancel, type = 'alert' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-unilight-card dark:bg-unidark-card rounded-lg shadow-xl p-6 w-full max-w-sm text-center border border-unilight-border-gray-200 dark:border-unidark-border-gold-10"
      >
        <div className="flex justify-center mb-4">
          <AlertCircle className="w-12 h-12 text-unilight-accent-amber dark:text-unidark-accent-gold" />
        </div>
        <p className="text-unilight-text-700 dark:text-unidark-text-200 mb-6">{message}</p>
        <div className="flex justify-center space-x-4">
          {type === 'confirm' && (
            <button
              onClick={onCancel}
              className="px-5 py-2 bg-unilight-border-gray-200 text-unilight-text-700 rounded-md hover:bg-unilight-border-gray-100 dark:bg-unidark-card-alt dark:text-unidark-text-200 dark:hover:bg-unidark-card-deep transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`px-5 py-2 rounded-md font-semibold transition-colors ${
              type === 'alert' 
                ? 'bg-unilight-accent-amber hover:bg-unilight-accent-amber-400 dark:bg-unidark-accent-gold dark:hover:bg-unidark-accent-gold-30 text-white'
                : 'bg-unilight-accent-red hover:bg-unilight-accent-red-bright dark:bg-unidark-accent-red dark:hover:bg-unidark-accent-red-bright text-white'
            }`}
          >
            {type === 'alert' ? 'OK' : 'Confirm'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ProfileSettingsPage = () => {
  const router = useRouter();
  const { user, accessToken, loading: authLoading, isAuthenticated, logout, login } = useAuth();

  const [loadingUserData, setLoadingUserData] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [editableName, setEditableName] = useState('');
  const [editablePassoutYear, setEditablePassoutYear] = useState('');
  const [editableCollege, setEditableCollege] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [collegeList, setCollegeList] = useState([]);
  const [collegeLoading, setCollegeLoading] = useState(true);

  // State for custom modal
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ message: '', type: 'alert', onConfirm: () => {}, onCancel: () => {} });

  // Fetch college list on mount
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await fetch('/api/colleges');
        if (!response.ok) {
          throw new Error('Failed to load college list.');
        }
        const data = await response.json();
        setCollegeList(data);
      } catch (err) {
        console.error('Error fetching colleges:', err);
      } finally {
        setCollegeLoading(false);
      }
    };

    fetchColleges();
  }, []);





  // Effect to redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Effect to fetch user data if authenticated
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated || !user || !user._id || !accessToken) {
        setLoadingUserData(false);
        return;
      }
      setLoadingUserData(true);
      setError(null);
      try {
        const response = await fetch(`/api/users/${user._id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.statusText}`);
        }
        const userData = await response.json();
        setCurrentUserData(userData);
        setEditableName(userData.name || '');
        setEditablePassoutYear(userData.passoutYear || '');
        setEditableCollege(userData.college || ''); // Initialize college
        setImagePreview(userData.profilePicture || null);
      } catch (err) {
        console.error("Error fetching current user:", err);
        setError("Failed to load user profile. Please try logging in again.");
        logout();
      } finally {
        setLoadingUserData(false);
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated, user, accessToken, logout]);

  // Handle file selection for profile picture
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setImagePreview(currentUserData?.profilePicture || null);
    }
  };

  // Handle profile picture upload
  const handleProfilePictureUpload = async () => {
    if (!selectedFile) {
      setError("Please select an image to upload.");
      return;
    }

    setUploadingImage(true);
    setError(null);
    setMessage(null);

    const formData = new FormData();
    formData.append('profilePicture', selectedFile);

    try {
      const response = await fetch(`/api/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload profile picture.');
      }

      const data = await response.json();
      setMessage('Profile picture updated successfully!');
      setCurrentUserData(data.user);
      login(accessToken, { ...user, profilePicture: data.user.profilePicture });
      setSelectedFile(null);
    } catch (err) {
      console.error('Error uploading profile picture:', err);
      setError(err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle general profile settings update
  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`/api/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: editableName,
          passoutYear: parseInt(editablePassoutYear),
          college: editableCollege,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile settings.');
      }

      const data = await response.json();
      setMessage('Profile settings updated successfully!');
      setCurrentUserData(data.user);
      login(accessToken, { ...user, name: data.user.name, passoutYear: data.user.passoutYear, college: data.user.college }); // Update college in AuthContext
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving profile settings:', err);
      setError(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    setModalContent({
      message: "Are you sure you want to log out from all other devices? This will also log you out from this device.",
      type: 'confirm',
      onConfirm: async () => {
        setShowModal(false);
        setLoadingUserData(true);
        setError(null);
        setMessage(null);

        try {
          if (!user || !user._id) {
            throw new Error("User not logged in or ID not available.");
          }

          const response = await fetch('/api/auth/logout-all-devices', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ userId: user._id }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to log out from all devices.');
          }

          const data = await response.json();
          setModalContent({
            message: data.message + " You will now be redirected to the login page.",
            type: 'alert',
            onConfirm: () => {
              setShowModal(false);
              logout();
            }
          });
          setShowModal(true);
        } catch (err) {
          console.error('Error logging out from all devices:', err);
          setError(err.message);
          setModalContent({
            message: err.message + " Logging out from this device only.",
            type: 'alert',
            onConfirm: () => {
              setShowModal(false);
              logout();
            }
          });
          setShowModal(true);
        } finally {
          setLoadingUserData(false);
        }
      },
      onCancel: () => setShowModal(false)
    });
    setShowModal(true);
  };

  const handleLogoutCurrentDevice = async () => {
    setModalContent({
      message: "Are you sure you want to log out from this device?",
      type: 'confirm',
      onConfirm: async () => {
        setShowModal(false);
        setLoadingUserData(true);
        setError(null);
        setMessage(null);

        try {
          const response = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to log out from this device.');
          }

          const data = await response.json();
          setModalContent({
            message: data.message + " You will now be redirected to the login page.",
            type: 'alert',
            onConfirm: () => {
              setShowModal(false);
              logout();
            }
          });
          setShowModal(true);
        } catch (err) {
          console.error('Error logging out from current device:', err);
          setError(err.message);
          setModalContent({
            message: err.message + " Logging out from this device only.",
            type: 'alert',
            onConfirm: () => {
              setShowModal(false);
              logout();
            }
          });
          setShowModal(true);
        } finally {
          setLoadingUserData(false);
        }
      },
      onCancel: () => setShowModal(false)
    });
    setShowModal(true);
  };

  // Loading state UI
  if (authLoading || loadingUserData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-unilight-bg to-unilight-bg-gradient-to dark:from-unidark-bg dark:to-unidark-bg-gradient-to flex items-center justify-center transition-colors duration-500">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-unilight-accent-amber dark:border-unidark-accent-gold border-t-transparent rounded-full mx-auto"
          ></motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-xl font-medium text-unilight-text-700 dark:text-unidark-text-200"
          >
            Loading profile settings...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Redirect handled by useEffect, so if not authenticated, this won't render
  if (!isAuthenticated) return null; 

  return (
    <div className="mt-20 min-h-screen bg-gradient-to-br from-unilight-bg to-unilight-bg-gradient-to dark:from-unidark-bg dark:to-unidark-bg-gradient-to font-sans transition-colors duration-500 p-4 sm:p-6 lg:p-8 relative">

      <main className="max-w-6xl mx-auto bg-unilight-card dark:bg-unidark-card p-8 rounded-xl shadow-2xl w-full transform transition-all duration-300 hover:scale-[1.01] border border-unilight-border-gray-200 dark:border-unidark-border-gold-10">
        <h2 className="text-3xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-unilight-accent-red to-unilight-accent-amber dark:from-unidark-accent-red dark:to-unidark-accent-gold mb-6">Profile Settings</h2>

        {message && <p className="text-unilight-accent-amber dark:text-unidark-accent-gold text-sm text-center mb-4">{message}</p>}
        {error && <p className="text-unilight-accent-red dark:text-unidark-accent-red text-sm text-center mb-4">{error}</p>}

        {currentUserData && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Profile Picture and Actions */}
            <div className="lg:w-1/3 flex flex-col">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center mb-6">
                <img
                  src={imagePreview || "https://placehold.co/128x128/FFF8F0/D32F2F?text=No+Pic"}
                  alt="Profile Picture"
                  className="w-32 h-32 rounded-full object-cover border-4 border-unilight-accent-amber dark:border-unidark-accent-gold shadow-md mb-4"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-unilight-text-700 dark:text-unidark-text-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-unilight-accent-amber-100 file:text-unilight-accent-amber hover:file:bg-unilight-accent-amber-50 dark:file:bg-unidark-accent-gold-10 dark:file:text-unidark-accent-gold dark:hover:file:bg-unidark-accent-gold-20 cursor-pointer"
                />
                {selectedFile && (
                  <button
                    onClick={handleProfilePictureUpload}
                    className="mt-4 w-full bg-unilight-accent-amber text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-unilight-accent-amber-400 transition-colors duration-200 disabled:opacity-50 dark:bg-unidark-accent-gold dark:hover:bg-unidark-accent-gold-30"
                    disabled={uploadingImage}
                  >
                    {uploadingImage ? 'Uploading...' : 'Upload New Picture'}
                  </button>
                )}
              </div>

              {/* Logout Buttons */}
              <div className="mt-auto space-y-3">
                <button
                  onClick={handleLogoutAllDevices}
                  className="w-full bg-unilight-accent-red text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-unilight-accent-red-bright transition-colors duration-200 disabled:opacity-50 dark:bg-unidark-accent-red dark:hover:bg-unidark-accent-red-bright"
                  disabled={loadingUserData || uploadingImage || savingProfile}
                >
                  {loadingUserData || uploadingImage || savingProfile ? 'Processing...' : 'Log Out From All Devices'}
                </button>

                <button
                  onClick={handleLogoutCurrentDevice}
                  className="w-full bg-unilight-text-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-unilight-text-700 transition-colors duration-200 disabled:opacity-50 dark:bg-unidark-text-400 dark:hover:bg-unidark-text-300"
                  disabled={loadingUserData || uploadingImage || savingProfile}
                >
                  {loadingUserData || uploadingImage || savingProfile ? 'Processing...' : 'Log Out From This Device Only'}
                </button>
              </div>

              <p className="mt-3 text-center text-unilight-text-600 dark:text-unidark-text-400 text-sm">
                (Note: "Log Out From All Devices" will invalidate all your active sessions, including this one. "Log Out From This Device Only" will only log out the current session.)
              </p>
            </div>

            {/* Right Column - Profile Details */}
            <div className="lg:w-2/3 space-y-6">
              {/* Editable Profile Details */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-unilight-text-800 dark:text-unidark-text-100">Personal Information</h3>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-unilight-accent-amber hover:underline text-sm font-semibold dark:text-unidark-accent-gold"
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                {isEditing ? (
                  <>
                    <div>
                      <label htmlFor="name" className="block text-unilight-text-700 dark:text-unidark-text-300 text-sm font-semibold mb-1">Name</label>
                      <input
                        type="text"
                        id="name"
                        value={editableName}
                        onChange={(e) => setEditableName(e.target.value)}
                        className="w-full px-4 py-2 border border-unilight-border-gray-200 rounded-lg focus:ring-unilight-accent-amber focus:border-unilight-accent-amber transition duration-200 bg-unilight-card dark:bg-unidark-card dark:border-unidark-border-gold-10 dark:text-unidark-text-200 dark:focus:ring-unidark-accent-gold dark:focus:border-unidark-accent-gold"
                      />
                    </div>
                    <p className="text-unilight-text-700 dark:text-unidark-text-200"><strong>Username:</strong> {currentUserData.username}</p>
                    <div>
                      <label htmlFor="passoutYear" className="block text-unilight-text-700 dark:text-unidark-text-300 text-sm font-semibold mb-1">Passout Year</label>
                      <input
                        type="number"
                        id="passoutYear"
                        value={editablePassoutYear}
                        onChange={(e) => setEditablePassoutYear(e.target.value)}
                        className="w-full px-4 py-2 border border-unilight-border-gray-200 rounded-lg focus:ring-unilight-accent-amber focus:border-unilight-accent-amber transition duration-200 bg-unilight-card dark:bg-unidark-card dark:border-unidark-border-gold-10 dark:text-unidark-text-200 dark:focus:ring-unidark-accent-gold dark:focus:border-unidark-accent-gold"
                      />
                    </div>
                    {collegeLoading ? (
                        <p className="text-sm text-gray-500">Loading colleges...</p>
                      ) : (
                        <select
                          id="college"
                          value={editableCollege}
                          onChange={(e) => setEditableCollege(e.target.value)}
                          className="w-full px-4 py-2 border border-unilight-border-gray-200 rounded-lg focus:ring-unilight-accent-amber focus:border-unilight-accent-amber transition duration-200 bg-unilight-card dark:bg-unidark-card dark:border-unidark-border-gold-10 dark:text-unidark-text-200 dark:focus:ring-unidark-accent-gold dark:focus:border-unidark-accent-gold"
                        >
                          <option value="">-- Select College --</option>
                          {collegeList.map((col) => (
                            <option key={col._id} value={col.name}>
                              {col.name}
                            </option>
                          ))}
                        </select>
                      )}
                    <button
                      onClick={handleSaveProfile}
                      className="w-full bg-unilight-accent-amber text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-unilight-accent-amber-400 transition-colors duration-200 disabled:opacity-50 dark:bg-unidark-accent-gold dark:hover:bg-unidark-accent-gold-30"
                      disabled={savingProfile}
                    >
                      {savingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-unilight-text-700 dark:text-unidark-text-200"><strong>Name:</strong> {currentUserData.name}</p>
                    <p className="text-unilight-text-700 dark:text-unidark-text-200"><strong>Username:</strong> {currentUserData.username}</p>
                    <p className="text-unilight-text-700 dark:text-unidark-text-200"><strong>Email:</strong> {currentUserData.email}</p>
                    <p className="text-unilight-text-700 dark:text-unidark-text-200"><strong>Passout Year:</strong> {currentUserData.passoutYear}</p>
                    <p className="text-unilight-text-700 dark:text-unidark-text-200"><strong>College:</strong> {currentUserData.college || 'N/A'}</p>
                  </>
                )}
              </div>

              {/* Other Read-Only Details */}
              <div className="space-y-4 border-t border-unilight-border-gray-200 dark:border-unidark-border-gold-10 pt-4 mt-4">
                <h3 className="text-xl font-semibold text-unilight-text-800 dark:text-unidark-text-100">Account Status</h3>
                <p className="text-unilight-text-700 dark:text-unidark-text-200"><strong>Email Verified:</strong> {currentUserData.isverified ? 'Yes' : 'No'}</p>
                <p className="text-unilight-text-700 dark:text-unidark-text-200"><strong>Last Login Date:</strong> {currentUserData.lastlogindate ? new Date(currentUserData.lastlogindate).toLocaleString() : 'N/A'}</p>
                <p className="text-unilight-text-700 dark:text-unidark-text-200"><strong>Last Login IP:</strong> {currentUserData.lastloginip || 'N/A'}</p>
                <p className="text-unilight-text-700 dark:text-unidark-text-200"><strong>Session Version:</strong> {currentUserData.sessionVersion}</p>
                <p className="text-unilight-text-700 dark:text-unidark-text-200"><strong>Active Refresh Tokens:</strong> {currentUserData.refreshTokens ? currentUserData.refreshTokens.length : 0}</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Custom Modal Render */}
      <AnimatePresence>
        {showModal && (
          <CustomModal
            message={modalContent.message}
            onConfirm={modalContent.onConfirm}
            onCancel={modalContent.onCancel}
            type={modalContent.type}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileSettingsPage;