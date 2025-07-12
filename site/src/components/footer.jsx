// components/Footer.jsx
"use client"; // This is a client component

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion'; // For subtle animations
import { useTheme } from 'next-themes'; // To ensure theme consistency, though footer is dark-only
import { Facebook, Twitter, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react'; // Lucide icons for social media and contact info

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme(); // Get current theme, though this footer is designed for dark mode

  return (
    <footer className="bg-unidark-card-deep text-unidark-text-300 py-12 px-4 sm:px-8 lg:px-16 font-sans border-t border-unidark-border-gold-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Column 1: Company Info */}
        <div className="flex flex-col items-start md:col-span-1">
          <Link href="/" className="text-3xl font-extrabold tracking-wider mb-4 bg-clip-text text-transparent bg-gradient-to-r from-unidark-accent-red to-unidark-accent-gold">
            UNIPDATES
          </Link>
          <p className="text-unidark-text-400 text-sm leading-relaxed mb-4">
            Empowering students with timely and relevant information, fostering academic excellence and career opportunities. Your trusted partner in university life.
          </p>
          <div className="flex space-x-4">
            {/* Social Media Icons using Lucide */}
            <motion.a
              href="#"
              whileHover={{ scale: 1.2, color: '#FFD301' }} // Gold accent on hover
              transition={{ duration: 0.2 }}
              className="text-unidark-text-400"
              aria-label="Facebook"
            >
              <Facebook className="w-6 h-6" />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.2, color: '#FFD301' }}
              transition={{ duration: 0.2 }}
              className="text-unidark-text-400"
              aria-label="Twitter"
            >
              <Twitter className="w-6 h-6" />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.2, color: '#FFD301' }}
              transition={{ duration: 0.2 }}
              className="text-unidark-text-400"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.2, color: '#FFD301' }}
              transition={{ duration: 0.2 }}
              className="text-unidark-text-400"
              aria-label="YouTube"
            >
              <Youtube className="w-6 h-6" />
            </motion.a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-unidark-text-100 mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link href="/" className="text-unidark-text-400 hover:text-unidark-accent-gold transition-colors duration-200">Home</Link></li>
            <li><Link href="/notes" className="text-unidark-text-400 hover:text-unidark-accent-gold transition-colors duration-200">Notes & Resources</Link></li>
            <li><Link href="/internships" className="text-unidark-text-400 hover:text-unidark-accent-gold transition-colors duration-200">Internship Opportunities</Link></li>
            <li><Link href="/about" className="text-unidark-text-400 hover:text-unidark-accent-gold transition-colors duration-200">About Us</Link></li>
            <li><Link href="/contact" className="text-unidark-text-400 hover:text-unidark-accent-gold transition-colors duration-200">Contact Support</Link></li>
          </ul>
        </div>

        {/* Column 3: Resources & Support */}
        <div>
          <h3 className="text-lg font-semibold text-unidark-text-100 mb-4">Resources & Support</h3>
          <ul className="space-y-2">
            <li><Link href="/faq" className="text-unidark-text-400 hover:text-unidark-accent-gold transition-colors duration-200">FAQ</Link></li>
            <li><Link href="/privacy" className="text-unidark-text-400 hover:text-unidark-accent-gold transition-colors duration-200">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-unidark-text-400 hover:text-unidark-accent-gold transition-colors duration-200">Terms of Service</Link></li>
            <li><Link href="/sitemap" className="text-unidark-text-400 hover:text-unidark-accent-gold transition-colors duration-200">Sitemap</Link></li>
            <li><Link href="/admin" className="text-unidark-text-400 hover:text-unidark-accent-gold transition-colors duration-200">Admin Panel</Link></li>
          </ul>
        </div>

        {/* Column 4: Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-unidark-text-100 mb-4">Contact Us</h3>
          <p className="text-unidark-text-400 text-sm mb-2 flex items-center">
            <Mail className="w-4 h-4 mr-2 text-unidark-accent-gold" />
            Email: <a href="mailto:support@unipdates.com" className="hover:text-unidark-accent-gold transition-colors duration-200 ml-1">support@unipdates.com</a>
          </p>
          <p className="text-unidark-text-400 text-sm mb-2 flex items-center">
            <Phone className="w-4 h-4 mr-2 text-unidark-accent-gold" />
            Phone: <a href="tel:+1234567890" className="hover:text-unidark-accent-gold transition-colors duration-200 ml-1">+1 (234) 567-890</a>
          </p>
          <p className="text-unidark-text-400 text-sm flex items-start">
            <MapPin className="w-4 h-4 mr-2 mt-0.5 text-unidark-accent-gold" />
            Address: 123 University Lane, Knowledge City, State, 12345
          </p>
          <p className="text-unidark-text-400 text-sm mt-4">
            Follow us for the latest updates!
          </p>
        </div>

      </div>

      {/* Bottom Bar: Copyright */}
      <div className="border-t border-unidark-border-gold-10 mt-10 pt-6 text-center text-unidark-text-400 text-sm">
        &copy; {currentYear} UNIPDATES. All rights reserved. Designed and developed with passion for student success.
      </div>
    </footer>
  );
};

export default Footer;
