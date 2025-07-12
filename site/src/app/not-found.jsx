// app/not-found.jsx
'use client'; // Required for Framer Motion animations

import { motion } from 'framer-motion';
import Link from 'next/link';
// import Navbar from '@/components/Navbar';
// import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      {/* <Navbar /> */}
    <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-unilight-bg to-unilight-bg-gradient-to dark:from-unidark-bg dark:to-unidark-bg-gradient-to px-6 transition-colors duration-500">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-9xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-unilight-accent-red to-unilight-accent-amber dark:from-unidark-accent-red dark:to-unidark-accent-gold drop-shadow-lg"
      >
        404
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-2xl md:text-3xl text-unilight-text-700 dark:text-unidark-text-200 mb-8 text-center max-w-xl"
      >
        Oops! The page you are looking for does not exist.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <Link
          href="/"
          className="px-8 py-3 rounded-full bg-unilight-accent-amber hover:bg-unilight-accent-amber-400 text-white font-bold shadow-lg transition-colors duration-200 dark:bg-unidark-accent-gold dark:hover:bg-unidark-accent-gold-30"
        >
          Go Back Home
        </Link>
      </motion.div>
    </section>
    {/* <Footer /> */}
    </>
  );
}