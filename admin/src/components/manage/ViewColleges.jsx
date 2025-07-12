// components/manage/ViewColleges.jsx
import { Building2, Users, Edit, Trash2 } from "lucide-react";
import React from 'react'; // Import React

const ViewColleges = ({ colleges, onViewAdmins, onEditCollege, onDeleteCollege }) => (
  <div>
    <h2 className="text-3xl font-bold text-purple-700 mb-6 flex items-center">
      <Building2 className="w-7 h-7 mr-3 text-purple-600" /> All Colleges
    </h2>
    {colleges.length === 0 ? (
      <p className="text-center text-gray-500 py-10">No colleges added yet.</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {colleges.map((college) => (
          <div key={college._id} className="bg-blue-50 p-6 rounded-xl shadow-md border border-blue-200 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">{college.name}</h3>
              <p className="text-gray-700">Code: <span className="font-medium">{college.code}</span></p>
              <p className="text-gray-700">Active Uniadmins: <span className="font-medium">{college.uniAdminCount} / 2</span></p>
              <p className={`mt-2 text-sm font-medium ${college.isActive ? "text-green-600" : "text-red-600"}`}>
                Status: {college.isActive ? "Active" : "Inactive"}
              </p>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <button
                className="bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-purple-800 transition"
                onClick={() => onViewAdmins(college)}
              >
                <Users className="w-5 h-5" /> View Admins
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEditCollege(college)}
                  className="p-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-200 shadow-md"
                  title="Edit College"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDeleteCollege(college._id)}
                  className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 shadow-md"
                  title="Delete College"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default ViewColleges;