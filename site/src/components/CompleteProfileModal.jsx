"use client";

import { useEffect, useState } from 'react';

export default function CompleteProfileModal({ user, accessToken, onClose }) {
  const [passoutYear, setPassoutYear] = useState('');
  const [college, setCollege] = useState('');
  const [collegeList, setCollegeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [collegeLoading, setCollegeLoading] = useState(true);

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
        setError(err.message);
      } finally {
        setCollegeLoading(false);
      }
    };

    fetchColleges();
  }, []);

  const handleSubmit = async () => {
    if (!passoutYear || !college) {
      setError('Please fill out all fields to continue.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ passoutYear, college })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Update failed.');
      }

      const data = await response.json();
      onClose(data.user); // callback with updated user
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Complete Your Profile</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="mb-4">
          <label className="block font-medium mb-1">Passout Year</label>
          <input
            type="number"
            value={passoutYear}
            onChange={(e) => setPassoutYear(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="e.g. 2025"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Select College</label>
          {collegeLoading ? (
            <p className="text-sm text-gray-500">Loading colleges...</p>
          ) : (
            <select
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">-- Select College --</option>
              {collegeList.map((col) => (
                <option key={col._id} value={col.name}>
                  {col.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save & Continue'}
        </button>
      </div>
    </div>
  );
}
