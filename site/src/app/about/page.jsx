'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link'; // Import the Link component

// Icon components for features and values (using inline SVGs for performance and style control)
const Icons = {
  Academic: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-9-5.747h18" /></svg>,
  Campus: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h8a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.885 11h8.23a1 1 0 01.938.648l2.33 6.434a1 1 0 01-.937 1.352H5.554a1 1 0 01-.937-1.352l2.33-6.434A1 1 0 017.885 11z" /></svg>,
  Opportunities: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
  Heart: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 20.25l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>,
};

// Data for different sections
const whatWeDoData = [
  { icon: <Icons.Academic />, title: 'Academic Support', description: 'Free study materials, notes, PYQs, and revision playlists sourced from the open internet to help you understand concepts and score better.' },
  { icon: <Icons.Campus />, title: 'University & Campus Updates', description: 'Timely and verified updates on exam schedules, academic circulars, events, and placement drives to keep you informed and ahead.' },
  { icon: <Icons.Opportunities />, title: 'Internships & Opportunities', description: 'A curated list of internships, workshops, scholarships, and competitions from trusted sources to fuel your career growth.' },
];

const ourValuesData = [
  'Accessible to all students',
  'Promote ethical sharing',
  'No confidential data',
  'User privacy is paramount',
];

const whyUnipdatesData = [
  'One platform for everything',
  '100% free, no login required',
  'Clean, fast, & distraction-free',
  'Updated by students, for students',
];


const AboutPage = () => {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-100 pt-24 pb-24">
      <div className="container mx-auto max-w-5xl px-4">

        {/* --- Hero Section --- */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-16"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-[#FFD301] via-[#FF3B3B] to-[#FFB300] bg-clip-text text-transparent mb-4">
            Simplifying Student Life.
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300">
            UNIPDATES is a student-first platform built to support university students across India with academic resources, campus updates, and verified career opportunities.
          </p>
        </motion.section>

        {/* --- What We Do Section --- */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="py-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">What We Do</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {whatWeDoData.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-gray-50/80 dark:bg-gray-800/50 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 text-center flex flex-col items-center"
              >
                <div className="bg-gradient-to-br from-amber-400 to-red-500 text-white rounded-full p-4 mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
        
        {/* --- Our Values & Why UNIPDATES Section --- */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="py-16 grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Our Values */}
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">Our Core Values</h2>
            <div className="flex flex-wrap gap-4">
              {ourValuesData.map((value, index) => (
                <div key={index} className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 text-gray-700 dark:text-gray-200 font-medium">
                  <Icons.Heart className="text-red-500 mr-2" />
                  {value}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Why UNIPDATES */}
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">Why Choose Us?</h2>
            <div className="space-y-4">
              {whyUnipdatesData.map((reason, index) => (
                <div key={index} className="flex items-center text-lg">
                  <Icons.Check />
                  <span className="ml-3 text-gray-700 dark:text-gray-300">{reason}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* --- CTA Section --- */}
        <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7 }}
            className="py-16 text-center"
        >
            <div className="bg-gray-100 dark:bg-gray-800/80 rounded-2xl p-10 md:p-16 border border-gray-200 dark:border-gray-700">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    A Platform by Students, for Students
                </h2>
                <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 mb-8">
                    Our community is our greatest strength. Most content is contributed, suggested, or reviewed by students like you to maintain quality and relevance.
                </p>
                {/* The button is now wrapped in a Link component to handle navigation */}
                <Link href="/" passHref>
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(255, 59, 59, 0.2)" }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-[#FFB300] to-[#FF3B3B] text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all"
                    >
                        Explore Resources
                    </motion.button>
                </Link>
            </div>
        </motion.section>

      </div>
    </div>
  );
};

export default AboutPage;
