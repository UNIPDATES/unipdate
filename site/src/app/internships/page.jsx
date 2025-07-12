// app/internships/page.js (or wherever you want your public internships page)
'use client'; // This is a client component
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { motion, AnimatePresence } from 'framer-motion'; // Import motion for animations
import { useTheme } from "next-themes"; // Import useTheme for theme toggling
import { Sun, Moon } from 'lucide-react'; // Import Lucide icons for ThemeToggler


const PublicInternshipsPage = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInternships = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/internships');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setInternships(data);
      } catch (err) {
        console.error("Error fetching internships:", err);
        setError("Failed to load internships. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
  }, []);

  // Loading state UI
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-unilight-bg to-unilight-bg-gradient-to dark:from-unidark-bg dark:to-unidark-bg-gradient-to flex items-center justify-center transition-colors duration-500">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-unilight-accent-amber dark:border-unidark-accent-gold border-t-transparent rounded-full mx-auto"
          ></motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-xl font-medium text-unilight-text-700 dark:text-unidark-text-200"
          >
            Loading internships...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-unilight-bg to-unilight-bg-gradient-to dark:from-unidark-bg dark:to-unidark-bg-gradient-to flex items-center justify-center transition-colors duration-500">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-unilight-card dark:bg-unidark-card p-8 rounded-2xl shadow-xl max-w-md border border-unilight-border-gray-200 dark:border-unidark-border-gold-30"
        >
          <h2 className="text-2xl font-bold text-unilight-accent-red dark:text-unidark-accent-red mb-4">Error Loading Content</h2>
          <p className="text-unilight-text-700 dark:text-unidark-text-300 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { /* Add retry logic if applicable, or just refresh */ window.location.reload(); }}
            className="px-6 py-2 bg-unilight-accent-amber dark:bg-unidark-accent-gold hover:bg-unilight-accent-amber-400 dark:hover:bg-unidark-accent-gold-30 rounded-lg text-white font-medium shadow-md"
          >
            Retry
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="mt-20 min-h-screen bg-gradient-to-br from-unilight-bg to-unilight-bg-gradient-to dark:from-unidark-bg dark:to-unidark-bg-gradient-to font-sans transition-colors duration-500 p-4 sm:p-6 lg:p-8 relative">
        {/* Theme Toggler */}
        <div className="absolute top-4 right-4 z-50">
        </div>

        <header className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-unilight-accent-red to-unilight-accent-amber dark:from-unidark-accent-red dark:to-unidark-accent-gold mb-4 rounded-lg p-2">
            UniUpdates Internships
          </h1>
        </header>

        <main className="max-w-7xl mx-auto bg-unilight-card dark:bg-unidark-card shadow-xl rounded-lg p-6 sm:p-8 lg:p-10 border border-unilight-border-gray-200 dark:border-unidark-border-gold-10">
          <h2 className="text-3xl font-bold text-unilight-text-800 dark:text-unidark-text-100 mb-6 text-center">Available Internships</h2>

          {internships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {internships.map((internship, index) => (
                <motion.div 
                  key={internship._id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ y: -5, boxShadow: '0 8px 20px rgba(255, 179, 0, 0.3)' }} // Amber glow on hover
                  className="bg-unilight-card-amber-50 dark:bg-unidark-card p-6 rounded-lg shadow-md border border-unilight-border-gray-200 dark:border-unidark-border-gold-10 flex flex-col"
                >
                  {internship.mainImg && (
                    <img
                      src={internship.mainImg}
                      alt={internship.mainHeading}
                      className="w-full h-40 object-cover rounded-md mb-4"
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x200/FFF8F0/D32F2F?text=No+Image"; }}
                    />
                  )}
                  <h3 className="text-xl font-bold text-unilight-text-800 dark:text-unidark-text-100 mb-2">{internship.mainHeading}</h3>
                  <p className="text-unilight-text-700 dark:text-unidark-text-300 mb-3 flex-grow">{internship.shortDescription}</p>
                  <div className="text-sm text-unilight-text-600 dark:text-unidark-text-400 mb-4">
                    {internship.deadline && (
                      <p><strong>Deadline:</strong> {new Date(internship.deadline).toLocaleDateString()}</p>
                    )}
                    <p><strong>Posted:</strong> {new Date(internship.postedAt).toLocaleDateString()}</p>
                  </div>
                  <details className="mb-4">
                    <summary className="text-unilight-accent-amber dark:text-unidark-accent-gold cursor-pointer font-semibold hover:underline">Read More</summary>
                    <div className="mt-2 text-unilight-text-700 dark:text-unidark-text-300 text-sm leading-relaxed">
                      {internship.content}
                      {internship.otherImgs && internship.otherImgs.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          {internship.otherImgs.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`Additional image ${idx + 1}`}
                              className="w-full h-24 object-cover rounded-md"
                              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/200x100/FFF8F0/D32F2F?text=No+Image"; }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </details>
                  {internship.applicationLink && (
                    <a
                      href={internship.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto block text-center bg-unilight-accent-amber hover:bg-unilight-accent-amber-400 dark:bg-unidark-accent-gold dark:hover:bg-unidark-accent-gold-30 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
                    >
                      Apply Now
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-unilight-text-500 dark:text-unidark-text-400">No internships currently available.</p>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default PublicInternshipsPage;
