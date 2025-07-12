import React, { useState, useEffect } from "react";
import { University, Edit, Trash2, XCircle } from "lucide-react";
import UniAdminFormModal from "./UniAdminFormModal";

const UniAdminsModal = ({
  college,
  uniAdmins,
  onClose,
  onEdit,
  onTerminate,
  editUniAdmin,
  onSubmitEdit,
  terminateUniAdmin,
  onSubmitTerminate,
  colleges,
}) => {
  const [showEdit, setShowEdit] = useState(false);
  const [terminationReason, setTerminationReason] = useState("");

  useEffect(() => {
    setShowEdit(!!editUniAdmin);
  }, [editUniAdmin]);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 shadow-lg w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-red-600" onClick={onClose}>
          <span className="text-2xl">&times;</span>
        </button>
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <University className="w-6 h-6 mr-2" /> UniAdmins for {college.name}
        </h2>
        {showEdit && editUniAdmin ? (
          <UniAdminFormModal
            colleges={colleges}
            initial={editUniAdmin}
            onClose={() => onEdit(null)}
            onSubmit={onSubmitEdit}
          />
        ) : terminateUniAdmin ? (
          <form
            onSubmit={e => {
              e.preventDefault();
              if (!terminationReason) return;
              onSubmitTerminate(terminateUniAdmin, terminationReason);
            }}
            className="max-w-md mx-auto bg-red-50 p-6 rounded-xl border border-red-200"
          >
            <h3 className="text-xl font-bold text-red-700 mb-4 flex items-center">
              <XCircle className="w-6 h-6 mr-2" /> Terminate UniAdmin: {terminateUniAdmin.name}
            </h3>
            <label className="block font-semibold mb-2">Termination Reason</label>
            <textarea
              className="w-full px-3 py-2 border rounded mb-4"
              value={terminationReason}
              onChange={e => setTerminationReason(e.target.value)}
              required
              rows={3}
              placeholder="Enter reason to be mailed..."
            />
            <div className="flex gap-4">
              <button
                type="button"
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded font-semibold"
                onClick={() => {
                  setTerminationReason("");
                  onTerminate(null);
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-red-600 text-white px-4 py-2 rounded font-semibold"
                disabled={!terminationReason}
              >
                Confirm Termination
              </button>
            </div>
          </form>
        ) : (
          <ul className="divide-y">
            {uniAdmins.length === 0 ? (
              <p className="text-gray-500">No UniAdmins for this college.</p>
            ) : (
              uniAdmins.map((admin) => (
                <li key={admin._id} className="flex items-center py-3">
                  <img src={admin.img_url} alt={admin.name} className="w-10 h-10 rounded-full mr-4" />
                  <div className="flex-1">
                    <div className="font-semibold">{admin.name} <span className="text-xs text-gray-400">({admin.username})</span></div>
                    <div className="text-sm text-gray-600">{admin.email} | {admin.pno} | Passout: {admin.passoutyear}</div>
                  </div>
                  <div className="flex gap-3">
                    <button title="Edit" className="p-2 rounded hover:bg-blue-100" onClick={() => onEdit(admin)}>
                      <Edit className="w-5 h-5 text-blue-700" />
                    </button>
                    <button title="Terminate" className="p-2 rounded hover:bg-red-100" onClick={() => onTerminate(admin)}>
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UniAdminsModal;
