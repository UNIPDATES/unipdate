import React, { useState } from "react";
import { Send, Loader2 } from "lucide-react";

const GiveOrderForm = ({ colleges, uniAdmins, showMessage }) => {
  const [selectedCollegeId, setSelectedCollegeId] = useState('');
  const [orderMessage, setOrderMessage] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('adminAccessToken') : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (!selectedCollegeId) throw new Error("Please select a college.");
      if (!orderMessage.trim()) throw new Error("Order message cannot be empty.");

      const targetUniAdmins = uniAdmins.filter(admin => admin.college?._id === selectedCollegeId);
      if (targetUniAdmins.length === 0) {
        showMessage('No uniadmins found for the selected college to send the order to.', 'error');
        setFormLoading(false);
        return;
      }

      const collegeName = colleges.find(c => c._id === selectedCollegeId)?.name || 'Unknown College';

      const updatePromises = targetUniAdmins.map(async (admin) => {
        const currentAdminRes = await fetch(`/api/admin/data/admin-users/${admin._id}`, {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        if (!currentAdminRes.ok) throw new Error(`Failed to fetch current admin data for ${admin.name}`);
        const currentAdminData = await currentAdminRes.json();
        const existingOrders = currentAdminData.ordersfromsuperadmin || [];

        await fetch(`/api/admin/data/admin-users/${admin._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            ordersfromsuperadmin: [...existingOrders, { message: orderMessage, sentAt: new Date() }],
          }),
        });

        await fetch('/api/admin/utils/send-custom-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            to: admin.email,
            subject: `New Order from Superadmin for ${collegeName}`,
            html: `
              <p>Dear ${admin.name},</p>
              <p>You have received a new order from the Superadmin for your college, ${collegeName}:</p>
              <p><strong>Order:</strong> ${orderMessage}</p>
              <p>Regards,<br>Superadmin Team</p>
            `,
          }),
        });
        return true;
      });

      await Promise.all(updatePromises);
      showMessage(`Order sent to uniadmins of ${collegeName} successfully!`);
      setSelectedCollegeId('');
      setOrderMessage('');
    } catch (err) {
      showMessage(err.message || 'An error occurred while sending the order.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-3xl font-bold text-purple-700 mb-6 flex items-center">
        <Send className="w-7 h-7 mr-3 text-purple-600" /> Give Order to Uniadmin
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Select College
          </label>
          <select
            value={selectedCollegeId}
            onChange={(e) => setSelectedCollegeId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="">-- Select a College --</option>
            {colleges.map(college => (
              <option key={college._id} value={college._id}>{college.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Order Message
          </label>
          <textarea
            value={orderMessage}
            onChange={(e) => setOrderMessage(e.target.value)}
            rows="5"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
            placeholder="Enter the order/message for the uniadmin(s) of the selected college."
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={formLoading}
        >
          {formLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Send className="mr-2" size={20} />}
          {formLoading ? 'Sending Order...' : 'Send Order'}
        </button>
      </form>
    </div>
  );
};

export default GiveOrderForm;
