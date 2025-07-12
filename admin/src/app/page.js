// app/page.js
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext'; // Use admin auth context

const LandingPage = () => {
  const router = useRouter();
  const { isAdminAuthenticated, loading: authLoading } = useAdminAuth();

  useEffect(() => {
    // If authentication check is complete and admin is authenticated, redirect to dashboard
    if (!authLoading && isAdminAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAdminAuthenticated, authLoading, router]);

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-50">
        <p className="text-xl text-gray-700">Loading admin panel...</p>
      </div>
    );
  }

  // Content for unauthenticated users
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-blue-50 p-4 text-gray-800">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full text-center transform transition-all duration-300 hover:scale-[1.01]">
        {/* UniUpdates Logo */}
        <img
          src="/logo.png" // Ensure you have a logo.png in your public directory
          alt="UniUpdates Logo"
          className="mx-auto mb-8 w-32 h-32 object-contain"
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/128x128/cccccc/333333?text=Logo"; }}
        />

        <h1 className="text-4xl font-extrabold text-blue-800 mb-4">Welcome to UniUpdates Admin</h1>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          This is the administrative portal for UniUpdates. If you are a student or a regular user, please visit our main website for the latest university updates, notes, and internships.
        </p>

        <div className="space-y-4">
          <a
            href="https://www.unipdates.com" // Replace with your actual public website URL
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 text-lg"
          >
            Go to UniUpdates.com
          </a>
          <button
            onClick={() => router.push('/login')}
            className="inline-block w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 text-lg"
          >
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;