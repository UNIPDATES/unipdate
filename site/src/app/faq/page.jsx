'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Expanded and categorized FAQ data
const faqData = [
  {
    category: 'General Information',
    questions: [
      { id: 'g1', question: 'What is UNIPDATES?', answer: 'UNIPDATES is a student-driven platform designed to support university students by providing academic resources, real-time campus updates, and curated opportunities like internships, workshops, and scholarships. It aims to make student life more organized, informed, and efficient by bringing everything into one simple space.' },
      { id: 'g2', question: 'Is UNIPDATES affiliated with any university?', answer: 'No, UNIPDATES is an independent platform and is not officially affiliated, connected, or endorsed by any university, college, or educational institution. All content shared here is either publicly available, student-submitted, or responsibly sourced from trusted open channels.' },
      { id: 'g3', question: 'How is UNIPDATES different from other student platforms?', answer: 'UNIPDATES focuses on being a hyper-relevant, all-in-one hub. While other platforms might specialize in just notes or just job postings, we integrate everything: academic notes, PYQs, internship listings, scholarship alerts, and global tech updates, all curated to be relevant to the student community we serve.' },
      { id: 'g4', question: 'Who runs UNIPDATES?', answer: 'The platform is run by a dedicated team of current students and recent graduates who are passionate about helping their peers. It is a non-commercial, volunteer-driven initiative focused purely on student support.' },
    ]
  },
  {
    category: 'Content & Resources',
    questions: [
      { id: 'c1', question: 'Is the content on UNIPDATES free to use?', answer: 'Yes, all study materials, notes, questions, and updates available on UNIPDATES are completely free to access. Our mission is to democratize access to information, so there are no charges, hidden fees, or subscriptions required.' },
      { id: 'c2', question: 'What kind of academic resources do you provide?', answer: 'UNIPDATES offers a range of academic support materials, including study notes, previous year question papers (PYQs), important question sets, subject-wise revision content, and one-shot preparation guides for both university and competitive exams.' },
      { id: 'c3', question: 'How often is the platform updated?', answer: 'The platform is updated regularly, with high-frequency updates during exam schedules, placement seasons, and university events. Our network of student contributors ensures that the information remains current and helpful.' },
      { id: 'c4', question: 'I found an error in the notes. What should I do?', answer: 'We appreciate your help in keeping our content accurate! If you find any errors or have updated information, please use the "Contact Us" or feedback form on our site to let us know. Our team will review and correct it promptly.' }
    ]
  },
  {
    category: 'Contribution & Community',
    questions: [
      { id: 'cc1', question: 'Can I contribute content to UNIPDATES?', answer: 'Absolutely! We strongly encourage students to contribute helpful content such as notes, important questions, or guides. All submissions are reviewed to ensure they are original, useful, and do not violate any content ownership or academic integrity policies.' },
      { id: 'cc2', question: 'How do you ensure the quality of user-submitted content?', answer: 'Our team of moderators reviews every submission for quality, relevance, and originality. We check for clarity, accuracy, and completeness before making it available on the platform to ensure it meets our community standards.' },
      { id: 'cc3', question: 'How can I support the UNIPDATES platform?', answer: 'The best way to support us is by contributing high-quality content, sharing our platform with your friends and classmates, and providing constructive feedback. As a non-commercial project, community engagement is our most valuable asset.' }
    ]
  },
  {
    category: 'Safety, Privacy & Technical',
    questions: [
      { id: 's1', question: 'Do you promote or support exam cheating?', answer: 'No, UNIPDATES strictly discourages any form of academic dishonesty. The platform is intended to support ethical learning and preparation. Using our resources for cheating, plagiarism, or bypassing academic integrity rules is a direct violation of our Terms of Service.' },
      { id: 's2', question: 'Is my data safe with UNIPDATES?', answer: 'Yes. We do not collect personal data unless it is voluntarily provided by you, for example, through a contact form. Any such information is used solely for the purpose of communication and is never sold, rented, or shared with third parties. Please see our Privacy Policy for full details.' },
      { id: 's3', question: 'Can universities or content owners request content removal?', answer: 'Yes. We respect intellectual property and content ownership. If any institution, university, or content creator believes their material is being used inappropriately, they can contact us directly. We will promptly remove or credit the content as per the request after verification.' },
      { id: 's4', question: 'Is there a mobile app for UNIPDATES?', answer: 'Currently, UNIPDATES is a web-based platform fully optimized for mobile browsers, ensuring you have a great experience on any device. We are exploring the development of a dedicated mobile app for the future.' }
    ]
  }
];

// Reusable Accordion Item Component
const AccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-5 px-2 md:px-4 flex justify-between items-center"
        whileHover={{ backgroundColor: 'rgba(251, 191, 36, 0.1)' }}
        transition={{ duration: 0.2 }}
      >
        <span className="text-lg font-medium text-gray-800 dark:text-gray-100">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
        </motion.div>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="prose prose-base dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 px-4 pb-5">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// Main FAQ Page Component
const FaqPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFaqs, setFilteredFaqs] = useState(faqData);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = faqData.map(category => {
      const filteredQuestions = category.questions.filter(item =>
        item.question.toLowerCase().includes(lowercasedFilter) ||
        item.answer.toLowerCase().includes(lowercasedFilter)
      );
      return { ...category, questions: filteredQuestions };
    }).filter(category => category.questions.length > 0);
    setFilteredFaqs(filtered);
  }, [searchTerm]);


  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans pt-32 pb-24">
      <div className="container mx-auto max-w-4xl px-4">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#FFD301] via-[#FF3B3B] to-[#FFB300] bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Have a question? We're here to help.
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="mb-12 relative">
          <input
            type="text"
            placeholder="Search for a question..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3 pl-12 pr-4 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus:border-amber-400 focus:ring-amber-400 rounded-full transition-all"
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-12">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map(category => (
              <motion.div 
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 border-l-4 border-amber-400 pl-4 mb-6">
                  {category.category}
                </h2>
                <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
                  {category.questions.map(item => (
                    <AccordionItem key={item.id} question={item.question} answer={item.answer} />
                  ))}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">No questions found matching your search.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default FaqPage;