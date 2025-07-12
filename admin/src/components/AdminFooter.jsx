// components/AdminFooter.jsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Copyright, // Copyright icon
  Mail, // Email icon
  FileText, // Document/Policy icon
  Info, // Info icon for version
  Clock, // Clock for timestamp
} from 'lucide-react';

const AdminFooter = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Update current time every second for a dynamic feel
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }));
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  return (
    <footer className="bg-gradient-to-r from-blue-700 to-indigo-800 text-blue-100 py-8 px-6 md:px-8 mt-auto shadow-inner border-t border-blue-600">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        {/* Section 1: Copyright and Platform Information */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-bold text-white mb-3">UNIPDATES</h3>
          <p className="flex items-center justify-center md:justify-start text-blue-200">
            <Copyright className="w-4 h-4 mr-2" />2025 Unipdates. All Rights Reserved.
          </p>
          <p className="mt-2 text-blue-300">
            This is the official administrative panel for managing Unipdates operations.
          </p>
        </div>

        {/* Section 2: Quick Links / Legal */}
        <div className="text-center md:text-center">
          <h3 className="text-lg font-bold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/admin/privacy-policy" className="flex items-center justify-center md:justify-center text-blue-200 hover:text-white transition-colors duration-200">
                <FileText className="w-4 h-4 mr-2" /> Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/admin/terms-of-service" className="flex items-center justify-center md:justify-center text-blue-200 hover:text-white transition-colors duration-200">
                <FileText className="w-4 h-4 mr-2" /> Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/admin/support" className="flex items-center justify-center md:justify-center text-blue-200 hover:text-white transition-colors duration-200">
                <Mail className="w-4 h-4 mr-2" /> Contact Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Section 3: System Status and Version */}
        <div className="text-center md:text-right">
          <h3 className="text-lg font-bold text-white mb-3">System Status</h3>
          <p className="flex items-center justify-center md:justify-end text-blue-200">
            <Info className="w-4 h-4 mr-2" /> Version: 1.0.0-beta
          </p>
          <p className="mt-2 flex items-center justify-center md:justify-end text-blue-300">
            <Clock className="w-4 h-4 mr-2" /> Current Server Time: {currentTime}
          </p>
          <p className="mt-1 text-blue-300">
            For technical assistance, please refer to our internal documentation.
          </p>
        </div>
      </div>

      {/* Bottom Bar for additional formal text */}
      <div className="border-t border-blue-600 mt-8 pt-6 text-center text-xs text-blue-400">
        <p>
          Strictly for authorized personnel only. Unauthorized access or use is prohibited and may lead to legal action.
        </p>
      </div>
    </footer>
  );
};

export default AdminFooter;
