import React, { useState, useEffect } from "react";
import { Edit, Loader2, XCircle } from "lucide-react";

const UpdateUniAdminForm = ({ uniAdmins, colleges, showMessage, refreshData }) => {
  const [selectedAdminId, setSelectedAdminId] = useState('');
  const [formData, setFormData] = useState({
    name: '', username: '', email: '', pno: '', passoutyear: '', 
    college: '', role: 'uniadmin', terminate: false, terminationreason: '',
    img_url: 'https://placehold.co/100x100/cccccc/333333?text=UA'
  });
  const [formLoading, setFormLoading] = useState(false);

  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('adminAccessToken') : null;

  useEffect(() => {
    if (selectedAdminId) {
      const admin = uniAdmins.find(a => a._id === selectedAdminId);
      if (admin) {
        setFormData({
          name: admin.name,
          username: admin.username,
          email: admin.email,
          pno: admin.pno,
          passoutyear: admin.passoutyear,
          college: admin.college?._id || '',
          role: admin.role,
          terminate: admin.terminate || false,
          terminationreason: admin.terminationreason || '',
          img_url: admin.img_url || 'https://placehold.co/100x100/cccccc/333333?text=UA'
        });
      }
    }
  }, [selectedAdminId, uniAdmins]);

  const handleTerminateAdmin = async () => {
    setFormLoading(true);
    try {
      const admin = uniAdmins.find(a => a._id === selectedAdminId);
      if (!admin) throw new Error('Admin not found');
      const collegeId = admin.college?._id;
      if (!collegeId) throw new Error('College not assigned');

      await fetch('/api/admin/utils/send-custom-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          to: admin.email,
          subject: 'Account Termination Notice',
          html: `<p>Your admin account has been terminated. Reason: ${formData.terminationreason}</p>`
        })
      });

      const [deleteRes, collegeRes] = await Promise.all([
        fetch(`/api/admin/data/admin-users/${selectedAdminId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }),
        fetch(`/api/admin/data/colleges/${collegeId}/decrement-admin`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${accessToken}` }
        })
      ]);

      if (!deleteRes.ok || !collegeRes.ok) {
        throw new Error('Failed to terminate admin');
      }

      showMessage('Admin terminated successfully');
      setSelectedAdminId('');
      refreshData();
    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (formData.terminate) {
      await handleTerminateAdmin();
      return;
    }

    setFormLoading(true);
    try {
      const payload = { ...formData };
      delete payload.role;
      delete payload.terminate;
      delete payload.terminationreason;

      const res = await fetch(`/api/admin/data/admin-users/${selectedAdminId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Update failed');
      
      showMessage('Admin updated successfully');
      refreshData();
    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-3xl font-bold text-purple-700 mb-6 flex items-center">
        <Edit className="w-7 h-7 mr-3 text-purple-600" /> Update / Terminate Uniadmin
      </h2>
      <div className="mb-6">
        <label htmlFor="selectUniadmin" className="block text-lg font-semibold text-gray-700 mb-2">
          Select Uniadmin to Update
        </label>
        <select
          id="selectUniadmin"
          value={selectedAdminId}
          onChange={(e) => setSelectedAdminId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">-- Select Uniadmin --</option>
          {uniAdmins.map(admin => (
            <option key={admin._id} value={admin._id}>{admin.name} ({admin.email})</option>
          ))}
        </select>
      </div>

      {selectedAdminId && (
        <form onSubmit={handleUpdate} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Profile Image URL
              </label>
              <input
                type="text"
                name="img_url"
                value={formData.img_url}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">Username</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">Phone Number</label>
              <input type="tel" name="pno" value={formData.pno} onChange={handleChange} pattern="\d{10}" maxLength="10" className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">Passout Year</label>
              <input type="number" name="passoutyear" value={formData.passoutyear} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">College</label>
              <select
                name="college"
                value={formData.college}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select College</option>
                {colleges.map(college => (
                  <option key={college._id} value={college._id}>{college.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-3 mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
            <input
              type="checkbox"
              id="terminateAdmin"
              checked={formData.terminate}
              onChange={handleChange}
              className="h-5 w-5 text-red-600 rounded focus:ring-red-500"
              name="terminate"
            />
            <label htmlFor="terminateAdmin" className="text-lg font-semibold text-red-800">
              Terminate This Uniadmin
            </label>
          </div>

          {formData.terminate && (
            <div className="mt-4">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Termination Reason
              </label>
              <textarea
                name="terminationreason"
                value={formData.terminationreason}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          )}
          <button
            type="submit"
            className={`w-full font-bold py-3 px-6 rounded-lg shadow-lg transition-colors duration-300 disabled:opacity-50 flex items-center justify-center ${
              formData.terminate 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
            disabled={formLoading}
          >
            {formLoading ? (
              <Loader2 className="animate-spin mr-2" size={20} />
            ) : formData.terminate ? (
              <XCircle className="mr-2" size={20} />
            ) : (
              <Edit className="mr-2" size={20} />
            )}
            {formLoading 
              ? 'Processing...' 
              : formData.terminate 
                ? 'Confirm Termination' 
                : 'Update Admin'}
          </button>
        </form>
      )}
    </div>
  );
};

export default UpdateUniAdminForm;
