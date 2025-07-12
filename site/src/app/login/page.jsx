// app/login/page.js
"use client"; // This is a client component

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext'; // Import useAuth hook
import { motion, AnimatePresence } from 'framer-motion'; // Import motion for animations
import { useTheme } from "next-themes"; // Import useTheme for theme toggling
import { Sun, Moon, Mail, Lock, AlertCircle, Loader, Key } from 'lucide-react'; // Import Lucide icons

const LoginPage = () => {
  // const router = useRouter(); // Uncomment if you want to use Next.js router for redirection
  const { login } = useAuth(); // Get login function from AuthContext

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordOtp, setForgotPasswordOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [otpVerifiedForPasswordReset, setOtpVerifiedForPasswordReset] = useState(false);

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed. Please check your credentials.');
      }

      const data = await response.json();
      setMessage('Login successful! Redirecting...');
      console.log('Login successful:', data);

      // Call the login function from AuthContext to store token and user data
      login(data.accessToken, data.user);

      // router.push('/dashboard'); // Uncomment and replace with your actual dashboard route
      window.location.href = '/'; // Simple redirect to homepage for demonstration
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to your backend Google OAuth initiation endpoint
    window.location.href = '/api/auth/google-oauth/init';
  };

  const sendForgotPasswordOtp = async (targetEmail) => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, type: 'forgot-password' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send OTP for password reset.');
      }
      setMessage('Password reset OTP sent to your email.');
    } catch (err) {
      console.error('Error sending forgot password OTP:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyForgotPasswordOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotPasswordEmail, otp: forgotPasswordOtp }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'OTP verification failed. Please try again.');
      }

      setMessage('OTP verified. You can now set your new password.');
      setOtpVerifiedForPasswordReset(true); // Allow setting new password
    } catch (err) {
      console.error('Forgot password OTP verification error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSetNewPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotPasswordEmail,
          newPassword,
          otpVerified: otpVerifiedForPasswordReset, // Pass verification status
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to set new password.');
      }

      setMessage('Password has been successfully reset! You can now log in with your new password.');
      setShowForgotPassword(false); // Hide forgot password flow
      setOtpVerifiedForPasswordReset(false); // Reset state
      setForgotPasswordEmail('');
      setForgotPasswordOtp('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      console.error('Error setting new password:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 min-h-screen flex items-center justify-center bg-gradient-to-br from-unilight-bg to-unilight-bg-gradient-to dark:from-unidark-bg dark:to-unidark-bg-gradient-to p-4 sm:p-6 lg:p-8 font-sans transition-colors duration-500 relative">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-unilight-card dark:bg-unidark-card p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-[1.01] border border-unilight-border-gray-200 dark:border-unidark-border-gold-10"
      >
        <h2 className="text-3xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-unilight-accent-red to-unilight-accent-amber dark:from-unidark-accent-red dark:to-unidark-accent-gold mb-6">
          {showForgotPassword ? 'Forgot Password' : 'Login to UNIPDATES'}
        </h2>

        {!showForgotPassword ? (
          // Login Form
          <form onSubmit={handleManualLogin} className="space-y-5">
            <div>
              <label htmlFor="emailOrUsername" className="block text-unilight-text-700 dark:text-unidark-text-300 text-sm font-semibold mb-2">
                <Mail className="inline-block w-4 h-4 mr-1 text-unilight-accent-amber dark:text-unidark-accent-gold" />
                Email or Username
              </label>
              <input
                type="text"
                id="emailOrUsername"
                className="w-full px-4 py-2 border border-unilight-border-gray-200 rounded-lg focus:ring-unilight-accent-amber focus:border-unilight-accent-amber transition duration-200 bg-unilight-card dark:bg-unidark-card dark:border-unidark-border-gold-10 dark:text-unidark-text-200"
                placeholder="your.email@example.com or username"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
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
              {loading ? <Loader className="animate-spin h-5 w-5 mx-auto" /> : 'Login'}
            </motion.button>

            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="w-full text-unilight-accent-amber dark:text-unidark-accent-gold hover:underline text-sm mt-3"
            >
              Forgot Password?
            </button>
          </form>
        ) : (
          // Forgot Password Flow
          <div className="space-y-5">
            {!otpVerifiedForPasswordReset ? (
              // Step 1: Request OTP / Verify OTP
              <form onSubmit={forgotPasswordOtp ? handleVerifyForgotPasswordOtp : (e) => { e.preventDefault(); sendForgotPasswordOtp(forgotPasswordEmail); }}>
                <div>
                  <label htmlFor="forgotPasswordEmail" className="block text-unilight-text-700 dark:text-unidark-text-300 text-sm font-semibold mb-2">
                    <Mail className="inline-block w-4 h-4 mr-1 text-unilight-accent-amber dark:text-unidark-accent-gold" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="forgotPasswordEmail"
                    className="w-full px-4 py-2 border border-unilight-border-gray-200 rounded-lg focus:ring-unilight-accent-amber focus:border-unilight-accent-amber transition duration-200 bg-unilight-card dark:bg-unidark-card dark:border-unidark-border-gold-10 dark:text-unidark-text-200"
                    placeholder="your.email@example.com"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    required
                    disabled={otpVerifiedForPasswordReset}
                  />
                </div>

                {forgotPasswordEmail && ( // Show OTP input only after email is entered
                  <div>
                    <label htmlFor="forgotPasswordOtp" className="block text-unilight-text-700 dark:text-unidark-text-300 text-sm font-semibold mb-2">
                      <Key className="inline-block w-4 h-4 mr-1 text-unilight-accent-amber dark:text-unidark-accent-gold" />
                      OTP
                    </label>
                    <input
                      type="text"
                      id="forgotPasswordOtp"
                      className="w-full px-4 py-2 border border-unilight-border-gray-200 rounded-lg focus:ring-unilight-accent-amber focus:border-unilight-accent-amber transition duration-200 bg-unilight-card dark:bg-unidark-card dark:border-unidark-border-gold-10 dark:text-unidark-text-200"
                      placeholder="Enter 6-digit OTP"
                      value={forgotPasswordOtp}
                      onChange={(e) => setForgotPasswordOtp(e.target.value)}
                      required={forgotPasswordEmail.length > 0} // Required if email is present
                      maxLength="6"
                      disabled={otpVerifiedForPasswordReset}
                    />
                  </div>
                )}

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
                  disabled={loading || otpVerifiedForPasswordReset}
                >
                  {forgotPasswordOtp ? (loading ? <Loader className="animate-spin h-5 w-5 mx-auto" /> : 'Verify OTP') : (loading ? <Loader className="animate-spin h-5 w-5 mx-auto" /> : 'Send OTP')}
                </motion.button>

                {forgotPasswordEmail && (
                  <button
                    type="button"
                    onClick={() => sendForgotPasswordOtp(forgotPasswordEmail)}
                    className="w-full mt-2 bg-unilight-border-gray-200 text-unilight-text-700 font-bold py-3 px-4 rounded-lg shadow-md hover:bg-unilight-border-gray-100 transition-colors duration-200 disabled:opacity-50 dark:bg-unidark-card-alt dark:text-unidark-text-200 dark:hover:bg-unidark-card-deep"
                    disabled={loading || otpVerifiedForPasswordReset}
                  >
                    Resend OTP
                  </button>
                )}
              </form>
            ) : (
              // Step 2: Set New Password
              <form onSubmit={handleSetNewPassword}>
                <div>
                  <label htmlFor="newPassword" className="block text-unilight-text-700 dark:text-unidark-text-300 text-sm font-semibold mb-2">
                    <Lock className="inline-block w-4 h-4 mr-1 text-unilight-accent-amber dark:text-unidark-accent-gold" />
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    className="w-full px-4 py-2 border border-unilight-border-gray-200 rounded-lg focus:ring-unilight-accent-amber focus:border-unilight-accent-amber transition duration-200 bg-unilight-card dark:bg-unidark-card dark:border-unidark-border-gold-10 dark:text-unidark-text-200"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="confirmNewPassword" className="block text-unilight-text-700 dark:text-unidark-text-300 text-sm font-semibold mb-2">
                    <Lock className="inline-block w-4 h-4 mr-1 text-unilight-accent-amber dark:text-unidark-accent-gold" />
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmNewPassword"
                    className="w-full px-4 py-2 border border-unilight-border-gray-200 rounded-lg focus:ring-unilight-accent-amber focus:border-unilight-accent-amber transition duration-200 bg-unilight-card dark:bg-unidark-card dark:border-unidark-border-gold-10 dark:text-unidark-text-200"
                    placeholder="••••••••"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
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
                  {loading ? <Loader className="animate-spin h-5 w-5 mx-auto" /> : 'Set New Password'}
                </motion.button>
              </form>
            )}
            <button
              type="button"
              onClick={() => {
                setShowForgotPassword(false);
                setOtpVerifiedForPasswordReset(false); // Reset state if user goes back to login
                setForgotPasswordEmail('');
                setForgotPasswordOtp('');
                setNewPassword('');
                setConfirmNewPassword('');
                setError(null);
                setMessage(null);
              }}
              className="w-full text-unilight-text-600 dark:text-unidark-text-400 hover:underline text-sm mt-3"
            >
              Back to Login
            </button>
          </div>
        )}

        <div className="mt-6 text-center pt-6 border-t border-unilight-border-gray-200 dark:border-unidark-border-gold-10">
          <p className="text-unilight-text-600 dark:text-unidark-text-400 mb-4">Or login/sign up with:</p>
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
            Login with Google
          </Link>
        </div>

        <p className="mt-8 text-center text-unilight-text-600 dark:text-unidark-text-400">
          Don't have an account?{' '}
          <Link href="/signup" className="text-unilight-accent-amber dark:text-unidark-accent-gold hover:underline font-semibold">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
