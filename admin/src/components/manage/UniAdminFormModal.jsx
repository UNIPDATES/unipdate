import React, { useState } from "react";

const UniAdminFormModal = ({ colleges, initial, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(
    initial || {
      img_url: "",
      name: "",
      username: "",
      email: "",
      pno: "",
      passoutyear: "",
      college: "",
    }
  );
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit({ ...formData, _id: initial?._id }, !!initial);
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 shadow-lg w-full max-w-lg relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-red-600" onClick={onClose}>
          <span className="text-2xl">&times;</span>
        </button>
        <h2 className="text-2xl font-bold mb-4">{initial ? "Edit UniAdmin" : "Add UniAdmin"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Profile Image URL</label>
            <input type="url" name="img_url" value={formData.img_url} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Phone Number</label>
            <input type="tel" name="pno" value={formData.pno} onChange={handleChange} pattern="\d{10}" maxLength="10" required className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Passout Year</label>
            <input type="number" name="passoutyear" value={formData.passoutyear} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Assign College</label>
            <select name="college" value={formData.college} onChange={handleChange} required className="w-full px-3 py-2 border rounded">
              <option value="">Select a College</option>
              {colleges.map((college) => (
                <option key={college._id} value={college._id}>{college.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={submitting} className="w-full bg-blue-700 text-white py-2 rounded font-bold mt-2">
            {submitting ? "Saving..." : initial ? "Update" : "Add"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UniAdminFormModal;
