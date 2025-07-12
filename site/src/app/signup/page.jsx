// app/signup/page.js
'use client'; // This is a client component
import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // For navigation between pages
import { motion, AnimatePresence } from 'framer-motion'; // Import motion for animations
import { useTheme } from "next-themes"; // Import useTheme for theme toggling
import { Sun, Moon, User, Calendar, Briefcase, Mail, Lock, AlertCircle, Loader, Key } from 'lucide-react'; // Import Lucide icons


const SignupPage = () => {
  const [name, setName] = useState('');
  const [passoutYear, setPassoutYear] = useState('');
  const [college, setCollege] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');

  const handleManualSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          passoutYear: parseInt(passoutYear),
          college,
          username,
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed. Please try again.');
      }

      const data = await response.json();
      setMessage('Signup successful! Please check your email for a verification OTP.');
      setSignupEmail(email);
      setShowOtpVerification(true);
      console.log('Signup successful:', data);

    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationOtp = async (targetEmail) => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, type: 'verification' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send OTP.');
      }
      setMessage('OTP sent to your email.');
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupEmail, otp }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'OTP verification failed. Please try again.');
      }

      const data = await response.json();
      setMessage('Email verified successfully! You can now log in.');
      console.log('Email verified:', data);
      setShowOtpVerification(false);
      window.location.href = '/login';
    } catch (err) {
      console.error('OTP verification error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = '/api/auth/google-oauth/init';
  };

  return (
    <div className="mt-20 min-h-screen flex items-center justify-center bg-gradient-to-br from-unilight-bg to-unilight-bg-gradient-to dark:from-unidark-bg dark:to-unidark-bg-gradient-to p-4 sm:p-6 lg:p-8 font-sans transition-colors duration-500 relative">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-unilight-card dark:bg-unidark-card p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-[1.01] border border-unilight-border-gray-200 dark:border-unidark-border-gold-10"
      >
        <h2 className="text-3xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-unilight-accent-red to-unilight-accent-amber dark:from-unidark-accent-red dark:to-unidark-accent-gold mb-6">
          Join UNIPDATES
        </h2>

        {!showOtpVerification ? (
          <form onSubmit={handleManualSignup} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-unilight-text-700 dark:text-unidark-text-300 text-sm font-semibold mb-2">
                <User className="inline-block w-4 h-4 mr-1 text-unilight-accent-amber dark:text-unidark-accent-gold" />
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 border border-unilight-border-gray-200 rounded-lg focus:ring-unilight-accent-amber focus:border-unilight-accent-amber transition duration-200 bg-unilight-card dark:bg-unidark-card dark:border-unidark-border-gold-10 dark:text-unidark-text-200"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="passoutYear" className="block text-unilight-text-700 dark:text-unidark-text-300 text-sm font-semibold mb-2">
                <Calendar className="inline-block w-4 h-4 mr-1 text-unilight-accent-amber dark:text-unidark-accent-gold" />
                Passout Year
              </label>
              <input
                type="number"
                id="passoutYear"
                className="w-full px-4 py-2 border border-unilight-border-gray-200 rounded-lg focus:ring-unilight-accent-amber focus:border-unilight-accent-amber transition duration-200 bg-unilight-card dark:bg-unidark-card dark:border-unidark-border-gold-10 dark:text-unidark-text-200"
                placeholder="e.g., 2025"
                value={passoutYear}
                onChange={(e) => setPassoutYear(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="college" className="block text-unilight-text-700 dark:text-unidark-text-300 text-sm font-semibold mb-2">
                <Briefcase className="inline-block w-4 h-4 mr-1 text-unilight-accent-amber dark:text-unidark-accent-gold" />
                College
              </label>
              <input
                type="text"
                id="college"
                className="w-full px-4 py-2 border border-unilight-border-gray-200 rounded-lg focus:ring-unilight-accent-amber focus:border-unilight-accent-amber transition duration-200 bg-unilight-card dark:bg-unidark-card dark:border-unidark-border-gold-10 dark:text-unidark-text-200"
                placeholder="Your College Name"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-unilight-text-700 dark:text-unidark-text-300 text-sm font-semibold mb-2">
                <User className="inline-block w-4 h-4 mr-1 text-unilight-accent-amber dark:text-unidark-accent-gold" />
                Unique Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full px-4 py-2 border border-unilight-border-gray-200 rounded-lg focus:ring-unilight-accent-amber focus:border-unilight-accent-amber transition duration-200 bg-unilight-card dark:bg-unidark-card dark:border-unidark-border-gold-10 dark:text-unidark-text-200"
                placeholder="Choose a unique username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-unilight-text-700 dark:text-unidark-text-300 text-sm font-semibold mb-2">
                <Mail className="inline-block w-4 h-4 mr-1 text-unilight-accent-amber dark:text-unidark-accent-gold" />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-unilight-border-gray-200 rounded-lg focus:ring-unilight-accent-amber focus:border-unilight-accent-amber transition duration-200 bg-unilight-card dark:bg-unidark-card dark:border-unidark-border-gold-10 dark:text-unidark-text-200"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-unilight-text-700 dark:text-unidark-text-300 text-sm font-semibold mb-2">
                <Lock className="inline-block w-4 h-4 mr-1 text-unilight-accent-amber dark:text-unidark-accent-gold" />
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border border-unilight-border-gray-200 rounded-lg focus:ring-unilight-accent-amber focus:border-unilight-accent-amber transition duration-200 bg-unilight-card dark:bg-unidark-card dark:border-unidark-border-gold-10 dark:text-unidark-text-200"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-unilight-accent-red dark:text-unidark-accent-red text-sm text-center flex items-center justify-center space-x-1"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </motion.p>
            )}
            {message && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-unilight-accent-amber dark:text-unidark-accent-gold text-sm text-center flex items-center justify-center space-x-1"
              >
                <Mail className="w-4 h-4" />
                <span>{message}</span>
              </motion.p>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-unilight-accent-amber text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-unilight-accent-amber-400 transition-colors duration-200 disabled:opacity-50 dark:bg-unidark-accent-gold dark:hover:bg-unidark-accent-gold-30"
              disabled={loading}
            >
              {loading ? <Loader className="animate-spin h-5 w-5 mx-auto" /> : 'Sign Up'}
            </motion.button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <p className="text-center text-unilight-text-700 dark:text-unidark-text-200">An OTP has been sent to <span className="font-semibold">{signupEmail}</span>. Please enter it below to verify your email.</p>
            <div>
              <label htmlFor="otp" className="block text-unilight-text-700 dark:text-unidark-text-300 text-sm font-semibold mb-2">
                <Key className="inline-block w-4 h-4 mr-1 text-unilight-accent-amber dark:text-unidark-accent-gold" />
                Verification OTP
              </label>
              <input
                type="text"
                id="otp"
                className="w-full px-4 py-2 border border-unilight-border-gray-200 rounded-lg focus:ring-unilight-accent-amber focus:border-unilight-accent-amber transition duration-200 bg-unilight-card dark:bg-unidark-card dark:border-unidark-border-gold-10 dark:text-unidark-text-200"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength="6"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-unilight-accent-red dark:text-unidark-accent-red text-sm text-center flex items-center justify-center space-x-1"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </motion.p>
            )}
            {message && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-unilight-accent-amber dark:text-unidark-accent-gold text-sm text-center flex items-center justify-center space-x-1"
              >
                <Mail className="w-4 h-4" />
                <span>{message}</span>
              </motion.p>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-unilight-accent-amber text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-unilight-accent-amber-400 transition-colors duration-200 disabled:opacity-50 dark:bg-unidark-accent-gold dark:hover:bg-unidark-accent-gold-30"
              disabled={loading}
            >
              {loading ? <Loader className="animate-spin h-5 w-5 mx-auto" /> : 'Verify Email'}
            </motion.button>
            <button
              type="button"
              onClick={() => sendVerificationOtp(signupEmail)}
              className="w-full mt-2 bg-unilight-border-gray-200 text-unilight-text-700 font-bold py-3 px-4 rounded-lg shadow-md hover:bg-unilight-border-gray-100 transition-colors duration-200 disabled:opacity-50 dark:bg-unidark-card-alt dark:text-unidark-text-200 dark:hover:bg-unidark-card-deep"
              disabled={loading}
            >
              Resend OTP
            </button>
          </form>
        )}

        <div className="mt-6 text-center pt-6 border-t border-unilight-border-gray-200 dark:border-unidark-border-gold-10">
          <p className="text-unilight-text-600 dark:text-unidark-text-400 mb-4">Or sign up with:</p>
          <Link
            href="/api/auth/google-oauth/init"
            className="w-full flex items-center justify-center bg-unilight-accent-red text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-unilight-accent-red-bright transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.285V11.285H12.985C16.24 11.285 18.397 8.938 18.397 5.76C18.397 5.347 18.358 4.938 18.285 4.538H12.24V10.285Z" fill="#EA4335"/>
              <path d="M12.24 18.813C15.485 18.813 17.632 16.466 17.632 13.29C17.632 12.877 17.593 12.468 17.52 12.068H12.24V18.813Z" fill="#34A853"/>
              <path d="M5.76 13.29C5.76 12.877 5.799 12.468 5.872 12.068H11.152V18.813H5.872C5.872 18.4 5.833 17.991 5.76 17.581C5.76 17.171 5.76 16.762 5.76 16.352C5.76 15.942 5.76 15.533 5.76 15.123C5.76 14.713 5.76 14.304 5.76 13.894C5.76 13.689 5.76 13.49 5.76 13.29Z" fill="#FBBC05"/>
              <path d="M12.24 5.76C12.24 5.347 12.201 4.938 12.128 4.538H5.872V11.285H12.128C12.128 10.875 12.128 10.466 12.128 10.056C12.128 9.646 12.128 9.237 12.128 8.827C12.128 8.417 12.128 8.008 12.128 7.598C12.128 7.188 12.128 6.779 12.128 6.369C12.128 6.164 12.128 5.965 12.128 5.76Z" fill="#4285F4"/>
            </svg>
            Sign Up with Google
          </Link>
        </div>

        <p className="mt-8 text-center text-unilight-text-600 dark:text-unidark-text-400">
          Already have an account?{' '}
          <Link href="/login" className="text-unilight-accent-amber dark:text-unidark-accent-gold hover:underline font-semibold">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignupPage;
