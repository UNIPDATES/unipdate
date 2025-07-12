// components/manage/CollegeForm.jsx
import { PlusCircle, Edit, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";

const CollegeForm = ({ type, college, showMessage, refreshData, onCancel }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [isActive, setIsActive] = useState(true); // New field for status
  const [formLoading, setFormLoading] = useState(false);

  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('adminAccessToken') : null;

  useEffect(() => {
    if (type === 'update' && college) {
      setName(college.name || '');
      setCode(college.code || '');
      setIsActive(college.isActive !== undefined ? college.isActive : true);
    } else {
      // Reset for 'add' type or when no college is selected for update
      setName('');
      setCode('');
      setIsActive(true);
    }
  }, [type, college]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const payload = { name, code: code.toUpperCase(), isActive }; // Ensure code is uppercase

      let response;
      if (type === 'add') {
        response = await fetch('/api/admin/data/colleges', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        });
      } else { // type === 'update'
        response = await fetch(`/api/admin/data/colleges/${college._id}`, {
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
        throw new Error(data.message || `Failed to ${type} college.`);
      }

      showMessage(`College ${type === 'add' ? 'added' : 'updated'} successfully!`);
      refreshData(); // Refresh list of colleges
      if (type === 'add') {
        setName('');
        setCode('');
        setIsActive(true);
      } else {
        onCancel(); // Go back to view page after update
      }
    } catch (err) {
      console.error(`${type === 'add' ? 'Add' : 'Update'} College error:`, err);
      showMessage(err.message || 'An error occurred.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-3xl font-bold text-purple-700 mb-6 flex items-center">
        {type === 'add' ? <PlusCircle className="w-7 h-7 mr-3 text-purple-600" /> : <Edit className="w-7 h-7 mr-3 text-purple-600" />}
        {type === 'add' ? 'Add New College' : `Update College: ${college?.name}`}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="collegeName" className="block text-lg font-semibold text-gray-700 mb-2">
            College Name
          </label>
          <input
            type="text"
            id="collegeName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-base"
            required
          />
        </div>
        <div>
          <label htmlFor="collegeCode" className="block text-lg font-semibold text-gray-700 mb-2">
            College Code (e.g., IITD, DU)
          </label>
          <input
            type="text"
            id="collegeCode"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())} // Ensure uppercase
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-base"
            required
          />
        </div>
        {type === 'update' && (
          <div>
            <label htmlFor="collegeStatus" className="block text-lg font-semibold text-gray-700 mb-2">
              Status
            </label>
            <select
              id="collegeStatus"
              value={isActive.toString()} // Convert boolean to string for select value
              onChange={(e) => setIsActive(e.target.value === 'true')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-base"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        )}
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
            {formLoading ? (type === 'add' ? 'Adding College...' : 'Updating College...') : (type === 'add' ? 'Add College' : 'Update College')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CollegeForm;