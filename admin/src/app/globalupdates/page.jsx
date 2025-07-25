// app/global-updates/page.jsx
"use client";

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import {
  Megaphone, // Main icon for global updates
  PlusCircle,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
  Eye,
  Search,
  Calendar, // For date inputs
  Image as ImageIcon, // For image inputs
  Plus,
  MinusCircle,
} from 'lucide-react';

const GlobalUpdatesPage = () => {
  const router = useRouter();
  const { isAdminAuthenticated, loading: authLoading, isSuperadmin } = useAdminAuth();

  const [activeTab, setActiveTab] = useState('view-updates'); // 'view-updates', 'add-update', 'edit-update'
  const [globalUpdates, setGlobalUpdates] = useState([]);
  const [selectedUpdate, setSelectedUpdate] = useState(null); // For edit form

  const [searchQuery, setSearchQuery] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('adminAccessToken') : null;

  // Redirect if not authenticated or not superadmin
  useEffect(() => {
    if (!authLoading && (!isAdminAuthenticated || !isSuperadmin)) {
      router.push('/login');
    }
  }, [isAdminAuthenticated, authLoading, isSuperadmin, router]);

  const fetchGlobalUpdates = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const headers = { 'Authorization': `Bearer ${accessToken}` };
      const response = await fetch('/api/admin/data/global-updates', { headers });
      if (!response.ok) throw new Error('Failed to fetch global updates.');
      const data = await response.json();
      setGlobalUpdates(data);
    } catch (err) {
      console.error('Error fetching global updates:', err);
      setError(err.message || 'Failed to load global updates.');
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (isAdminAuthenticated && isSuperadmin) {
      fetchGlobalUpdates();
    }
  }, [isAdminAuthenticated, isSuperadmin, fetchGlobalUpdates]);

  // Filter updates based on search query
  const filteredUpdates = useMemo(() => {
    let currentUpdates = globalUpdates;

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      currentUpdates = currentUpdates.filter(update =>
        update.mainHeading.toLowerCase().includes(lowercasedQuery) ||
        update.shortDescription.toLowerCase().includes(lowercasedQuery) ||
        update.content.toLowerCase().includes(lowercasedQuery)
      );
    }
    return currentUpdates;
  }, [globalUpdates, searchQuery]);


  const showMessage = (msg, type = 'success') => {
    if (type === 'success') {
      setSuccessMessage(msg);
      setError(null);
    } else {
      setError(msg);
      setSuccessMessage(null);
    }
    setTimeout(() => {
      setSuccessMessage(null);
      setError(null);
    }, 5000); // Clear message after 5 seconds
  };

  const handleEditUpdate = (update) => {
    setSelectedUpdate(update);
    setActiveTab('edit-update');
  };

  const handleDeleteUpdate = async (id) => {
    if (!confirm('Are you sure you want to delete this global update?')) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/data/global-updates/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete global update.');
      }
      showMessage('Global update deleted successfully!');
      fetchGlobalUpdates(); // Refresh list
    } catch (err) {
      console.error('Delete Global Update error:', err);
      showMessage(err.message || 'An error occurred during deletion.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !isAdminAuthenticated || !isSuperadmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="ml-4 text-xl text-gray-700">Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8 text-gray-800">
      <h1 className="text-5xl font-extrabold text-blue-800 mb-10 text-center drop-shadow-lg">
        Global Updates Management
      </h1>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg mb-8 text-center shadow-md">
          <CheckCircle className="inline-block w-6 h-6 mr-2" />
          <span className="font-semibold">Success:</span> {successMessage}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-8 text-center shadow-md">
          <AlertCircle className="inline-block w-6 h-6 mr-2" />
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}

      <div className="flex justify-center mb-8 space-x-4">
        <TabButton active={activeTab === 'view-updates'} onClick={() => setActiveTab('view-updates')}>
          <Eye className="w-5 h-5 mr-2" /> View Updates
        </TabButton>
        <TabButton active={activeTab === 'add-update'} onClick={() => { setActiveTab('add-update'); setSelectedUpdate(null); }}>
          <PlusCircle className="w-5 h-5 mr-2" /> Add New Update
        </TabButton>
        {activeTab === 'edit-update' && (
          <TabButton active={true} onClick={() => {}}>
            <Edit className="w-5 h-5 mr-2" /> Edit Update
          </TabButton>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="ml-3 text-lg text-gray-600">Loading data...</p>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-xl shadow-lg">
          {activeTab === 'view-updates' && (
            <ViewGlobalUpdates
              updates={filteredUpdates}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleEditUpdate={handleEditUpdate}
              handleDeleteUpdate={handleDeleteUpdate}
            />
          )}
          {activeTab === 'add-update' && (
            <GlobalUpdateForm
              type="add"
              showMessage={showMessage}
              refreshData={fetchGlobalUpdates}
            />
          )}
          {activeTab === 'edit-update' && selectedUpdate && (
            <GlobalUpdateForm
              type="edit"
              update={selectedUpdate}
              showMessage={showMessage}
              refreshData={fetchGlobalUpdates}
              onCancel={() => setActiveTab('view-updates')}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalUpdatesPage;

// --- Helper Components ---

const TabButton = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-6 py-3 rounded-full font-semibold text-lg transition-all duration-300 shadow-md
      ${active ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-800'}`}
  >
    {children}
  </button>
);

// --- ViewGlobalUpdates Component ---
const ViewGlobalUpdates = ({
  updates,
  searchQuery,
  setSearchQuery,
  handleEditUpdate,
  handleDeleteUpdate
}) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-purple-700 mb-6 flex items-center">
        <Megaphone className="w-7 h-7 mr-3 text-purple-600" /> All Global Updates
      </h2>

      {/* Search Input */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by heading, description, or content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-base"
        />
      </div>

      {updates.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          {searchQuery ? `No updates found matching your criteria.` : 'No global updates added yet.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {updates.map(update => (
            <div key={update._id} className="bg-blue-50 p-6 rounded-xl shadow-md border border-blue-200 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-blue-800 mb-2 truncate">{update.mainHeading}</h3>
                <p className="text-sm text-gray-700 mb-3 line-clamp-2">{update.shortDescription}</p>
                {update.mainImg && (
                  <img
                    src={update.mainImg}
                    alt={update.mainHeading}
                    className="w-full h-40 object-cover rounded-md mb-3"
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x160/cccccc/333333?text=No+Main+Image"; }}
                  />
                )}
                {update.otherImgs && update.otherImgs.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {update.otherImgs.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Additional image ${idx + 1}`}
                        className="w-16 h-16 object-cover rounded-md"
                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/64x64/cccccc/333333?text=Img"; }}
                      />
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">Published: {new Date(update.publishedAt).toLocaleDateString()}</p>
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => handleEditUpdate(update)}
                  className="p-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-200 shadow-md"
                  title="Edit Update"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteUpdate(update._id)}
                  className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 shadow-md"
                  title="Delete Update"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- GlobalUpdateForm Component (for Add/Edit) ---
const GlobalUpdateForm = ({ type, update, showMessage, refreshData, onCancel }) => {
  const [formData, setFormData] = useState({
    mainHeading: '',
    shortDescription: '',
    content: '',
    mainImg: '', // URL
    otherImgs: [], // Array of URLs
    publishedAt: '',
    // Temporary file objects for new uploads
    mainImgFile: null,
    otherImgFiles: [],
  });
  const [formLoading, setFormLoading] = useState(false);

  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('adminAccessToken') : null;

  useEffect(() => {
    if (type === 'edit' && update) {
      setFormData({
        mainHeading: update.mainHeading || '',
        shortDescription: update.shortDescription || '',
        content: update.content || '',
        mainImg: update.mainImg || '',
        otherImgs: update.otherImgs || [],
        publishedAt: update.publishedAt ? new Date(update.publishedAt).toISOString().split('T')[0] : '',
        mainImgFile: null, // Reset file inputs on edit load
        otherImgFiles: [], // Reset file inputs on edit load
      });
    } else if (type === 'add') {
      setFormData({
        mainHeading: '',
        shortDescription: '',
        content: '',
        mainImg: '',
        otherImgs: [],
        publishedAt: new Date().toISOString().split('T')[0], // Default to today for new
        mainImgFile: null,
        otherImgFiles: [],
      });
    }
  }, [type, update]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, fieldName) => {
    if (fieldName === 'mainImgFile') {
      setFormData(prev => ({ ...prev, mainImgFile: e.target.files[0] }));
    } else if (fieldName === 'otherImgFiles') {
      setFormData(prev => ({ ...prev, otherImgFiles: Array.from(e.target.files) }));
    }
  };

  const handleRemoveExistingOtherImg = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      otherImgs: prev.otherImgs.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Reusing the uploadFileToCloudinary logic from notes/page.jsx
  const uploadFileToCloudinary = async (file, folder, resourceType) => {
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('folder', folder);
    uploadFormData.append('resourceType', resourceType);

    const response = await fetch('/api/admin/upload-file', { // Assuming this is your single upload endpoint
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: uploadFormData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Failed to upload ${file.name}.`);
    }
    return data.imageUrl; // Assuming it returns imageUrl
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const payload = { ...formData };

      // Handle main image upload
      if (formData.mainImgFile) {
        payload.mainImg = await uploadFileToCloudinary(formData.mainImgFile, 'global-updates-main', 'image');
      } else if (!formData.mainImg) {
        // If no new file and no existing URL, ensure it's explicitly null/empty string
        payload.mainImg = '';
      }

      // Handle other images upload
      let uploadedOtherImgUrls = [...formData.otherImgs]; // Start with existing URLs
      for (const file of formData.otherImgFiles) {
        const url = await uploadFileToCloudinary(file, 'global-updates-others', 'image');
        uploadedOtherImgUrls.push(url);
      }
      payload.otherImgs = uploadedOtherImgUrls;

      // Ensure publishedAt is a Date object or ISO string if required by backend
      if (payload.publishedAt) {
        payload.publishedAt = new Date(payload.publishedAt).toISOString();
      } else {
        payload.publishedAt = new Date().toISOString(); // Default to now if not set
      }

      // Remove temporary file objects before sending to backend
      delete payload.mainImgFile;
      delete payload.otherImgFiles;

      let response;
      if (type === 'add') {
        response = await fetch('/api/admin/data/global-updates', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        });
      } else { // type === 'edit'
        response = await fetch(`/api/admin/data/global-updates/${update._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        });
      }

      const data = await response.json();
      if (!response.ok) {
        // Check for validation errors from backend
        if (data.errors && Array.isArray(data.errors)) {
          throw new Error(data.errors.join(', ') || `Failed to ${type} update.`);
        }
        throw new Error(data.message || `Failed to ${type} update.`);
      }

      showMessage(`Global update ${type === 'add' ? 'added' : 'updated'} successfully!`);
      refreshData(); // Refresh list
      if (type === 'add') {
        setFormData({
          mainHeading: '',
          shortDescription: '',
          content: '',
          mainImg: '',
          otherImgs: [],
          publishedAt: new Date().toISOString().split('T')[0],
          mainImgFile: null,
          otherImgFiles: [],
        });
      } else {
        onCancel(); // Go back to view page after update
      }
    } catch (err) {
      console.error(`${type === 'add' ? 'Add' : 'Edit'} Global Update error:`, err);
      showMessage(err.message || 'An error occurred.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-3xl font-bold text-purple-700 mb-6 flex items-center">
        {type === 'add' ? <PlusCircle className="w-7 h-7 mr-3 text-purple-600" /> : <Edit className="w-7 h-7 mr-3 text-purple-600" />}
        {type === 'add' ? 'Add New Global Update' : `Edit Global Update: ${update?.mainHeading}`}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Heading */}
        <div>
          <label htmlFor="mainHeading" className="block text-lg font-semibold text-gray-700 mb-2">Main Heading</label>
          <input
            type="text"
            id="mainHeading"
            name="mainHeading"
            value={formData.mainHeading}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="e.g., Exciting New Feature Launched!"
            required
            maxLength={200}
          />
        </div>

        {/* Short Description */}
        <div>
          <label htmlFor="shortDescription" className="block text-lg font-semibold text-gray-700 mb-2">Short Description</label>
          <textarea
            id="shortDescription"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg h-24 resize-y"
            placeholder="A brief summary of the update..."
            required
            maxLength={500}
          ></textarea>
        </div>

        {/* Content (Rich Text Editor Placeholder) */}
        <div>
          <label htmlFor="content" className="block text-lg font-semibold text-gray-700 mb-2">Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg h-48 resize-y"
            placeholder="Write the full details of the update here. You can use Markdown for formatting (e.g., **bold**, *italic*, # Heading, - list item)."
            required
            maxLength={5000}
          ></textarea>
          <p className="text-sm text-gray-500 mt-1">
            Tip: For more advanced formatting, consider using Markdown syntax.
            For a full rich text editor, you would integrate a library like TinyMCE or Quill here.
          </p>
        </div>

        {/* Main Image */}
        <div className="border border-gray-200 p-4 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><ImageIcon className="w-5 h-5 mr-2" /> Main Image</h3>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'mainImgFile')}
            className="w-full text-sm text-gray-700 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {formData.mainImgFile && (
            <p className="text-xs text-gray-500 mt-1">New file selected: {formData.mainImgFile.name}</p>
          )}
          {formData.mainImg && !formData.mainImgFile && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-1">Current Main Image:</p>
              <img
                src={formData.mainImg}
                alt="Current Main Image"
                className="w-48 h-32 object-cover rounded-md border border-gray-200"
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/192x128/cccccc/333333?text=Error"; }}
              />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, mainImg: '', mainImgFile: null }))}
                className="mt-1 text-red-600 hover:underline text-sm"
              >
                Remove Current Image
              </button>
            </div>
          )}
        </div>

        {/* Other Images */}
        <div className="border border-gray-200 p-4 rounded-lg shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><ImageIcon className="w-5 h-5 mr-2" /> Additional Images</h3>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileChange(e, 'otherImgFiles')}
            className="w-full text-sm text-gray-700 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {formData.otherImgFiles.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">New files selected: {formData.otherImgFiles.map(f => f.name).join(', ')}</p>
          )}
          {formData.otherImgs.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-1">Current Additional Images:</p>
              <div className="flex flex-wrap gap-2">
                {formData.otherImgs.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img}
                      alt={`Additional image ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-md border border-gray-200"
                      onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/80x80/cccccc/333333?text=Img"; }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingOtherImg(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600 transition"
                      title="Remove image"
                    >
                      <MinusCircle className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Published At */}
        <div>
          <label htmlFor="publishedAt" className="block text-lg font-semibold text-gray-700 mb-2">Published Date</label>
          <input
            type="date"
            id="publishedAt"
            name="publishedAt"
            value={formData.publishedAt}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 mt-6">
          {type === 'edit' && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-300 text-gray-800 font-bold rounded-lg shadow-md hover:bg-gray-400 transition-colors duration-300"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-8 py-3 bg-blue-700 text-white font-bold rounded-lg shadow-lg hover:bg-blue-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={formLoading}
          >
            {formLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : (type === 'add' ? <PlusCircle className="mr-2" size={20} /> : <Edit className="mr-2" size={20} />)}
            {formLoading ? (type === 'add' ? 'Creating...' : 'Updating...') : (type === 'add' ? 'Add Update' : 'Update Update')}
          </button>
        </div>
      </form>
    </div>
  );
};