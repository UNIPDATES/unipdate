// app/login/page.js
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext'; // Use admin auth context

const AdminLoginPage = () => {
  const router = useRouter();
  const { adminLogin, isAdminAuthenticated, loading: authLoading } = useAdminAuth();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If admin is already authenticated, redirect to dashboard
    if (!authLoading && isAdminAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAdminAuthenticated, authLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed.');
      }

      adminLogin(data.accessToken, data.admin); // Update context with admin data
      router.push('/dashboard'); // Redirect to dashboard on successful login
    } catch (err) {
      console.error('Admin login error:', err);
      setError(err.message || 'An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || isAdminAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-50">
        <p className="text-xl text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-50 p-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md text-gray-800 transform transition-all duration-300 hover:scale-[1.01]">
        <h2 className="text-4xl font-extrabold text-center text-blue-800 mb-8">Admin Login</h2>

        {error && (
          <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6 text-sm text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="usernameOrEmail" className="block text-lg font-semibold text-gray-700 mb-2">
              Username or Email
            </label>
            <input
              type="text"
              id="usernameOrEmail"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-lg"
              placeholder="Enter username or email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-lg font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-lg"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-800 transition-colors duration-300 transform hover:scale-105 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-600 text-md">
          This portal is for administrators only.
          <br/>
          <a href="/forgot-password" className="text-blue-600 hover:underline font-semibold">Forgot Password?</a>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;