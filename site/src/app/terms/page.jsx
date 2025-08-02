'use client';

import React from 'react';
import { motion } from 'framer-motion';

// The content remains formal and authoritative to convey seriousness.
const termsArticles = [
  {
    id: "art1",
    title: "Article 1: Agreement to Terms",
    content: "This Terms of Service agreement ('Agreement') constitutes a legally binding contract between you, the end-user ('User'), and the operators of UNIPDATES ('the Platform'). Your access to and use of the Platform is expressly conditioned on your full and unconditional acceptance of this Agreement. By accessing or using the Platform, you acknowledge that you have read, understood, and agree to be bound by these terms. If you do not consent to this Agreement, you are prohibited from using the Platform and must cease all activity immediately."
  },
  {
    id: "art2",
    title: "Article 2: Platform Nature and Disclaimers",
    content: [
      { id: "2.1", title: "2.1 Independence:", text: "The Platform is an independent, non-commercial digital service and holds no official affiliation, endorsement, or sponsorship from any academic institution. All university trademarks, service marks, and trade names are the property of their respective owners." },
      { id: "2.2", title: "2.2 Disclaimer of Warranties:", text: "All content and resources provided are for general informational purposes only. The Platform provides all content 'as is' and 'as available' without warranty of any kind, express or implied. The Platform makes no representation as to the accuracy, completeness, or reliability of any content. Information herein does not constitute professional, legal, or academic advice." }
    ]
  },
  {
    id: "art3",
    title: "Article 3: Limitation of Liability",
    content: "In no event shall the Platform, its creators, operators, or affiliates be held liable for any direct, indirect, incidental, special, consequential, or punitive damages—including but not limited to, academic failure, loss of opportunity, or professional damages—arising from the User's access to, use of, or reliance on the Platform or its content. The User assumes all risk and responsibility for any decisions made based on information obtained from the Platform."
  },
  {
    id: "art4",
    title: "Article 4: Intellectual Property",
    content: "Content aggregated from public sources is for transformative, informational use only. The Platform does not assert ownership over such third-party material. User-contributed content remains the property of the contributor, who grants the Platform a non-exclusive, worldwide license to display it. Parties who believe their rights have been infringed upon may submit a formal takedown notice for prompt resolution."
  },
  {
    id: "art5",
    title: "Article 5: Acceptable Use and Prohibited Conduct",
    content: "The User is strictly prohibited from using the Platform for any unlawful purpose or any purpose that violates this Agreement. This includes, but is not limited to, engaging in academic dishonesty, cheating, plagiarism, commercial redistribution of content, or data scraping. Violation of this policy is a material breach of this Agreement and will result in the immediate and permanent termination of the User's access without notice."
  },
  {
    id: "art6",
    title: "Article 6: Modification of Terms",
    content: "The Platform reserves the absolute and unilateral right to revise, amend, or replace this Agreement at its sole discretion, at any time. The effective date of the latest revision will be posted at the top of this document. It is the User’s sole responsibility to review this Agreement periodically. Continued use of the Platform following any modifications constitutes binding acceptance of the revised terms."
  }
];

const TermsOfServicePage = () => {
    // Current date is correctly formatted as requested.
    const effectiveDate = new Date('2025-08-02T15:30:53+05:30').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  return (
    // Uses the main theme's light/dark backgrounds for perfect integration.
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-100 pt-32 pb-24">
      <div className="container mx-auto max-w-5xl px-4">
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
            Terms of Service
          </h1>
          {/* Metadata uses font-mono for a 'document' feel, but amber for brand color */}
          <p className="font-mono text-sm text-amber-600 dark:text-amber-400 mt-4 tracking-wider">
            {`DOC ID: UNIPD-TOS-V1.8 | EFFECTIVE: ${effectiveDate.toUpperCase()}`}
          </p>
          {/* The animated line now uses the brand's signature gradient */}
          <motion.div 
             initial={{ width: 0 }}
             animate={{ width: "10rem" }}
             transition={{ duration: 0.7, delay: 0.5, ease: 'easeInOut' }}
             className="h-1 bg-gradient-to-r from-[#FFD301] via-[#FF3B3B] to-[#FFB300] mx-auto mt-6 rounded-full"
          />
        </motion.div>

        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
          {termsArticles.map(article => (
            <motion.section 
              key={article.id} 
              variants={itemVariants} 
              // Card styling uses rounded corners, borders, and shadows from the main theme.
              className="border border-gray-200 dark:border-gray-700/80 bg-gray-50/50 dark:bg-gray-800/50 p-6 md:p-8 rounded-xl shadow-md backdrop-blur-sm"
            >
              <h2 className={`
                text-xl md:text-2xl font-bold mb-5
                ${article.id === 'art5' 
                  ? 'text-red-600 dark:text-red-500' // A special 'warning' color for the prohibitions clause
                  : 'text-amber-700 dark:text-amber-400' // The primary brand accent color for titles
                }
              `}>
                {article.title}
              </h2>
              
              {Array.isArray(article.content) ? (
                 <div className="space-y-4 text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                   {article.content.map(sub => (
                     <div key={sub.id}>
                       <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{sub.title}</h3>
                       <p>{sub.text}</p>
                     </div>
                   ))}
                 </div>
              ) : (
                <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
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
          className="mt-20 text-center font-mono text-xs text-gray-500 dark:text-gray-600"
        >
          <p>END OF DOCUMENT</p>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;