// app/internships/page.jsx
"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import {
  Briefcase,
  PlusCircle,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
  Eye,
  Calendar,
  Link as LinkIcon,
  Image as ImageIcon, // Renamed to avoid conflict with HTML <img>
  FileText,
  XCircle,
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Ensure this is imported in layout.js or globals.css

const InternshipsPage = () => {
  const router = useRouter();
  const { isAdminAuthenticated, loading: authLoading, isSuperadmin } = useAdminAuth();

  const [activeTab, setActiveTab] = useState('view-internships'); // 'view-internships', 'add-internship', 'update-internship'
  const [internships, setInternships] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null); // For update form
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

  const fetchInternships = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const headers = { 'Authorization': `Bearer ${accessToken}` };
      const response = await fetch('/api/admin/data/internships', { headers });
      if (!response.ok) throw new Error('Failed to fetch internships.');
      const data = await response.json();
      setInternships(data);
    } catch (err) {
      console.error('Error fetching internships:', err);
      setError(err.message || 'Failed to load internships.');
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (isAdminAuthenticated && isSuperadmin) {
      fetchInternships();
    }
  }, [isAdminAuthenticated, isSuperadmin, fetchInternships]);

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

  const handleEditClick = (internship) => {
    setSelectedInternship(internship);
    setActiveTab('update-internship');
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this internship?')) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/data/internships/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete internship.');
      }
      showMessage('Internship deleted successfully!');
      fetchInternships(); // Refresh list
    } catch (err) {
      console.error('Delete Internship error:', err);
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
        Internship Management
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
        <TabButton active={activeTab === 'view-internships'} onClick={() => setActiveTab('view-internships')}>
          <Eye className="w-5 h-5 mr-2" /> View Internships
        </TabButton>
        <TabButton active={activeTab === 'add-internship'} onClick={() => { setActiveTab('add-internship'); setSelectedInternship(null); }}>
          <PlusCircle className="w-5 h-5 mr-2" /> Add New Internship
        </TabButton>
        {activeTab === 'update-internship' && (
          <TabButton active={true} onClick={() => {}}>
            <Edit className="w-5 h-5 mr-2" /> Update Internship
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
          {activeTab === 'view-internships' && (
            <ViewInternships
              internships={internships}
              handleEditClick={handleEditClick}
              handleDelete={handleDelete}
            />
          )}
          {activeTab === 'add-internship' && (
            <InternshipForm
              type="add"
              showMessage={showMessage}
              refreshData={fetchInternships}
            />
          )}
          {activeTab === 'update-internship' && selectedInternship && (
            <InternshipForm
              type="update"
              internship={selectedInternship}
              showMessage={showMessage}
              refreshData={fetchInternships}
              onCancel={() => setActiveTab('view-internships')}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default InternshipsPage;

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

const ViewInternships = ({ internships, handleEditClick, handleDelete }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-purple-700 mb-6 flex items-center">
        <Briefcase className="w-7 h-7 mr-3 text-purple-600" /> All Internships
      </h2>
      {internships.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No internships found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.map(internship => (
            <div key={internship._id} className="bg-blue-50 p-6 rounded-xl shadow-md border border-blue-200 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-blue-800 mb-2">{internship.mainHeading}</h3>
                <p className="text-gray-700 text-sm mb-2">{internship.shortDescription}</p>
                {internship.mainImg && (
                  <img
                    src={internship.mainImg}
                    alt={internship.mainHeading}
                    className="w-full h-32 object-contain rounded-lg mb-3 border border-gray-200"
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/128x128/cccccc/333333?text=No+Image"; }}
                  />
                )}
                {internship.otherImgs && internship.otherImgs.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {internship.otherImgs.map((imgUrl, index) => (
                      <img
                        key={index}
                        src={imgUrl}
                        alt={`Other image ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-md border border-gray-200"
                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/64x64/cccccc/333333?text=IMG"; }}
                      />
                    ))}
                  </div>
                )}
                <p className="text-sm text-gray-600 flex items-center mt-2">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" /> Deadline: {internship.deadline ? new Date(internship.deadline).toLocaleDateString() : 'N/A'}
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <LinkIcon className="w-4 h-4 mr-2 text-gray-500" /> Apply: <a href={internship.applicationLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate ml-1">{internship.applicationLink || 'N/A'}</a>
                </p>
                <p className="text-xs text-gray-500 mt-1">Posted: {new Date(internship.postedAt).toLocaleDateString()}</p>
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => handleEditClick(internship)}
                  className="p-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-200 shadow-md"
                  title="Edit Internship"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(internship._id)}
                  className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 shadow-md"
                  title="Delete Internship"
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

const InternshipForm = ({ type, internship, showMessage, refreshData, onCancel }) => {
  const [formData, setFormData] = useState({
    mainHeading: '',
    shortDescription: '',
    content: '',
    mainImg: '', // URL
    otherImgs: [], // Array of URLs
    deadline: null, // Date object
    applicationLink: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [mainImgFile, setMainImgFile] = useState(null);
  const [otherImgsFiles, setOtherImgsFiles] = useState([]);

  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('adminAccessToken') : null;

  useEffect(() => {
    if (type === 'update' && internship) {
      setFormData({
        mainHeading: internship.mainHeading || '',
        shortDescription: internship.shortDescription || '',
        content: internship.content || '',
        mainImg: internship.mainImg || '',
        otherImgs: internship.otherImgs || [],
        deadline: internship.deadline ? new Date(internship.deadline) : null,
        applicationLink: internship.applicationLink || '',
      });
      setMainImgFile(null); // Clear file input when loading existing data
      setOtherImgsFiles([]); // Clear file input when loading existing data
    } else if (type === 'add') {
      setFormData({
        mainHeading: '',
        shortDescription: '',
        content: '',
        mainImg: '',
        otherImgs: [],
        deadline: null,
        applicationLink: '',
      });
      setMainImgFile(null);
      setOtherImgsFiles([]);
    }
  }, [type, internship]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMainImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImgFile(file);
      // Optional: Display a local preview immediately
      setFormData(prev => ({ ...prev, mainImg: URL.createObjectURL(file) }));
    } else {
      setMainImgFile(null);
      if (type === 'add') { // Only clear preview if adding
        setFormData(prev => ({ ...prev, mainImg: '' }));
      }
    }
  };

  const handleOtherImgsChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setOtherImgsFiles(files);
      // Optional: Display local previews immediately
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, otherImgs: [...prev.otherImgs, ...newPreviews] }));
    } else {
      setOtherImgsFiles([]);
    }
  };

  const removeOtherImg = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      otherImgs: prev.otherImgs.filter((_, index) => index !== indexToRemove)
    }));
  };

  const uploadFileToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'internship-images'); // Specific folder for internships
    formData.append('resourceType', 'image');

    const response = await fetch('/api/admin/upload-file', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Failed to upload ${file.name}.`);
    }
    return data.imageUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const payload = { ...formData };

      // Handle main image upload
      if (mainImgFile) {
        payload.mainImg = await uploadFileToCloudinary(mainImgFile);
      } else if (type === 'add' && !payload.mainImg) {
        // If adding and no main image provided, ensure it's not a local URL preview
        payload.mainImg = '';
      }

      // Handle other images upload
      const uploadedOtherImgUrls = [];
      for (const file of otherImgsFiles) {
        uploadedOtherImgUrls.push(await uploadFileToCloudinary(file));
      }
      // Combine existing and newly uploaded other images
      payload.otherImgs = [...(internship?.otherImgs || []).filter(url => formData.otherImgs.includes(url)), ...uploadedOtherImgUrls];

      // Convert deadline to ISO string if it's a Date object
      if (payload.deadline instanceof Date) {
        payload.deadline = payload.deadline.toISOString();
      }

      let response;
      if (type === 'add') {
        response = await fetch('/api/admin/data/internships', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        });
      } else { // type === 'update'
        response = await fetch(`/api/admin/data/internships/${internship._id}`, {
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
        throw new Error(data.message || `Failed to ${type} internship.`);
      }

      showMessage(`Internship ${type === 'add' ? 'added' : 'updated'} successfully!`);
      refreshData(); // Refresh list of internships
      if (type === 'add') {
        setFormData({ // Reset form for add
          mainHeading: '', shortDescription: '', content: '', mainImg: '', otherImgs: [], deadline: null, applicationLink: '',
        });
        setMainImgFile(null);
        setOtherImgsFiles([]);
      } else {
        onCancel(); // Go back to view page after update
      }
    } catch (err) {
      console.error(`${type === 'add' ? 'Add' : 'Update'} Internship error:`, err);
      showMessage(err.message || 'An error occurred.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-3xl font-bold text-purple-700 mb-6 flex items-center">
        {type === 'add' ? <PlusCircle className="w-7 h-7 mr-3 text-purple-600" /> : <Edit className="w-7 h-7 mr-3 text-purple-600" />}
        {type === 'add' ? 'Add New Internship' : `Update Internship: ${internship?.mainHeading}`}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="mainHeading" className="block text-lg font-semibold text-gray-700 mb-2">Main Heading (Job Title / Company)</label>
          <input type="text" id="mainHeading" name="mainHeading" value={formData.mainHeading} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
        </div>
        <div>
          <label htmlFor="shortDescription" className="block text-lg font-semibold text-gray-700 mb-2">Short Description</label>
          <textarea id="shortDescription" name="shortDescription" value={formData.shortDescription} onChange={handleChange} rows="2" className="w-full px-4 py-2 border border-gray-300 rounded-lg" required></textarea>
        </div>
        <div>
          <label htmlFor="content" className="block text-lg font-semibold text-gray-700 mb-2">Detailed Content</label>
          <textarea id="content" name="content" value={formData.content} onChange={handleChange} rows="6" className="w-full px-4 py-2 border border-gray-300 rounded-lg" required></textarea>
        </div>

        {/* Main Image Upload */}
        <div>
          <label htmlFor="mainImg" className="block text-lg font-semibold text-gray-700 mb-2">Main Image</label>
          <input type="file" id="mainImg" name="mainImgFile" accept="image/*" onChange={handleMainImgChange} className="w-full text-base text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          {formData.mainImg && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Current/New Main Image Preview:</p>
              <img src={formData.mainImg} alt="Main Image Preview" className="w-48 h-32 object-contain rounded-lg border border-gray-200 shadow-sm" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/192x128/cccccc/333333?text=Image+Error"; }} />
            </div>
          )}
        </div>

        {/* Other Images Upload */}
        <div>
          <label htmlFor="otherImgs" className="block text-lg font-semibold text-gray-700 mb-2">Other Images (Multiple)</label>
          <input type="file" id="otherImgs" name="otherImgsFiles" accept="image/*" multiple onChange={handleOtherImgsChange} className="w-full text-base text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          {formData.otherImgs && formData.otherImgs.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Other Images Previews:</p>
              <div className="flex flex-wrap gap-3">
                {formData.otherImgs.map((imgUrl, index) => (
                  <div key={index} className="relative">
                    <img src={imgUrl} alt={`Other Image ${index + 1}`} className="w-24 h-24 object-cover rounded-md border border-gray-200 shadow-sm" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/96x96/cccccc/333333?text=IMG"; }} />
                    <button
                      type="button"
                      onClick={() => removeOtherImg(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                      title="Remove image"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Deadline */}
        <div>
          <label htmlFor="deadline" className="block text-lg font-semibold text-gray-700 mb-2">Application Deadline</label>
          <DatePicker
            id="deadline"
            selected={formData.deadline}
            onChange={(date) => setFormData(prev => ({ ...prev, deadline: date }))}
            dateFormat="MM/dd/yyyy"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholderText="Select deadline"
            required
          />
        </div>

        {/* Application Link */}
        <div>
          <label htmlFor="applicationLink" className="block text-lg font-semibold text-gray-700 mb-2">Application Link</label>
          <input type="url" id="applicationLink" name="applicationLink" value={formData.applicationLink} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="https://example.com/apply" required />
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          {type === 'update' && (
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
            {formLoading ? (type === 'add' ? 'Adding...' : 'Updating...') : (type === 'add' ? 'Add Internship' : 'Update Internship')}
          </button>
        </div>
      </form>
    </div>
  );
};