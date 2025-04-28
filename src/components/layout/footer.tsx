'use client';

import { motion } from 'framer-motion';
import { ChevronUp, Home, Mail } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useSidebar } from './sidebar-context';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [scrolled, setScrolled] = useState(false);
  const { isCollapsed, sidebarWidth } = useSidebar();

  // Dynamisch den linken Rand basierend auf der Sidebar-Breite setzen
  const marginLeftClass = isCollapsed ? 'ml-20' : 'ml-64';

  // Handle scroll effect for consistency with header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`py-8 mt-auto relative z-30 ${scrolled ? 'bg-primary-800/95 text-white' : 'bg-primary-800 text-white'} ${marginLeftClass} transition-all duration-300`}
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Home className="h-4 w-4 text-blue-300" />
              </div>
              <span className="font-medium text-lg">Ritter Digital</span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-sm text-blue-200/80"
            >
              &copy; {currentYear} Ritter Digital Raumbuch Auswertung
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xs text-blue-200/60"
            >
              Version 1.0.0
            </motion.p>
          </div>

          {/* Links */}
          <div className="md:col-span-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col space-y-3"
            >
              <h3 className="text-sm font-medium text-blue-200 mb-2">Navigation</h3>
              <motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
                <Link
                  href="/dashboard"
                  className="text-sm text-white/80 hover:text-white flex items-center group"
                >
                  <span className="relative">
                    Dashboard
                    <motion.span
                      className="absolute bottom-0 left-0 h-[1px] bg-blue-300"
                      initial={{ width: 0 }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
                <a
                  href="mailto:info@ritter-digital.de"
                  className="text-sm text-white/80 hover:text-white flex items-center group"
                >
                  <Mail className="h-3.5 w-3.5 mr-2 text-blue-300 group-hover:text-blue-200 transition-colors" />
                  <span className="relative">
                    Kontakt
                    <motion.span
                      className="absolute bottom-0 left-0 h-[1px] bg-blue-300"
                      initial={{ width: 0 }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </span>
                </a>
              </motion.div>
            </motion.div>
          </div>

          {/* Back to top button */}
          <div className="flex items-center justify-center md:justify-end">
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              onClick={scrollToTop}
              className="group flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20 hover:bg-blue-500/30 transition-colors"
            >
              <ChevronUp className="h-5 w-5 text-blue-300 group-hover:text-blue-200 transition-colors" />
            </motion.button>
          </div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent my-6"
        />

        {/* Bottom text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center text-xs text-blue-200/50"
        >
          Designed and developed with ♥ by Ritter Digital
        </motion.div>
      </div>
    </motion.footer>
  );
}
