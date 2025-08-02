'use client';

import React from 'react';
import { motion } from 'framer-motion';

// The policy content is rewritten to be formal and authoritative.
const policyArticles = [
  {
    id: "art1",
    title: "Article 1: Preamble and Acceptance of Terms",
    content: "This Privacy Policy ('Policy') governs your access to and use of the UNIPDATES platform, its associated content, and services (collectively, 'the Platform'). By accessing, Browse, or using the Platform, you ('the User') signify your full and unconditional acceptance of this Policy and our Terms of Service. If you do not agree to these terms, you are prohibited from accessing or using the Platform. This document constitutes a legally binding agreement."
  },
  {
    id: "art2",
    title: "Article 2: Data Processing and User Information",
    content: [
      { id: "2.1", title: "2.1 Personally Identifiable Information (PII)", text: "The Platform collects PII (including, but not limited to, name and email address) only when voluntarily provided by the User through direct submission, such as during account registration. This data is utilized exclusively for its intended purpose, primarily user authentication, service delivery, and direct communication. We do not sell, trade, or rent Users' PII to others." },
      { id: "2.2", title: "2.2 Non-Personally Identifiable Information (Non-PII)", text: "The Platform may automatically collect Non-PII, including browser type, device type, operating system, and IP address for the purposes of system administration, aggregate analytics, and platform optimization. This data does not identify individual Users." },
      { id: "2.3", title: "2.3 Data Security Protocols", text: "We implement and maintain stringent security measures to protect your personal information. However, no method of transmission over the Internet or method of electronic storage is infallible. While we strive to use commercially acceptable means to protect your PII, we cannot guarantee its absolute security against all threats." }
    ]
  },
  {
    id: "art3",
    title: "Article 3: Assumption of Risk and Limitation of Liability",
    content: "The User acknowledges that all use of the Platform is at their sole risk. The Platform is provided on an 'as is' and 'as available' basis without warranties of any kind, either express or implied. UNIPDATES, its operators, and its affiliates shall not be liable for any academic, personal, professional, direct, indirect, consequential, or punitive damages arising from the User’s reliance on, or use of, the Platform or its content."
  },
  {
    id: "art4",
    title: "Article 4: User Conduct and Prohibitions",
    content: "Any use of the Platform for purposes of academic dishonesty, plagiarism, copyright infringement, or commercial redistribution of content is a material breach of this agreement and is strictly prohibited. The Platform reserves the absolute right to terminate access, without notice, for any User found to be in violation of these terms."
  },
  {
    id: "art5",
    title: "Article 5: Policy Amendments",
    content: "The Platform reserves the sovereign right to amend, modify, or update this Privacy Policy at any time and at its sole discretion, without prior notice. The date of the latest revision will be posted at the top of this document. Continued use of the Platform following any such amendments constitutes the User's binding acceptance of the revised Policy."
  },
];

const PrivacyPolicyPage = () => {
    // Dynamically set the current date for an authentic "last updated" feel.
    const lastUpdatedDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'tween', duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    // The 'dark' class forces a dark theme. The background is a stark, deep gray.
    <div className="min-h-screen bg-[#111111] dark font-sans text-gray-300 pt-32 pb-24">
      <div className="container mx-auto max-w-5xl px-4">
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-gray-50">
            PRIVACY POLICY
          </h1>
          <p className="font-mono text-sm text-red-500 mt-3 tracking-widest">
            {`DOCUMENT ID: UNIPD-PP-V2.1 | EFFECTIVE: ${lastUpdatedDate.toUpperCase()}`}
          </p>
          <motion.div 
             initial={{ width: 0 }}
             animate={{ width: "8rem" }}
             transition={{ duration: 0.7, delay: 0.5, ease: 'easeInOut' }}
             className="h-0.5 bg-red-600 mx-auto mt-6 shadow-[0_0_12px_rgba(255,59,59,0.5)]"
          />
        </motion.div>

        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10"
        >
          {policyArticles.map(article => (
            <motion.section 
              key={article.id} 
              variants={itemVariants} 
              className="border border-gray-800 bg-[#161616] p-6 md:p-8 shadow-2xl shadow-black/20"
            >
              <h2 className="font-mono text-lg md:text-xl font-bold tracking-wider text-red-500 mb-5 border-b border-red-900/50 pb-3">
                {article.title}
              </h2>
              {Array.isArray(article.content) ? (
                 <div className="space-y-5 text-gray-400 text-base md:text-lg leading-relaxed">
                   {article.content.map(sub => (
                     <div key={sub.id}>
                       <h3 className="font-semibold text-gray-200 mb-1">{sub.title}</h3>
                       <p>{sub.text}</p>
                     </div>
                   ))}
                 </div>
              ) : (
                <p className="text-gray-400 text-base md:text-lg leading-relaxed">
                  {article.content}
                </p>
              )}
            </motion.section>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0}} 
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-20 text-center font-mono text-xs text-gray-700"
        >
          <p>END OF DOCUMENT</p>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;