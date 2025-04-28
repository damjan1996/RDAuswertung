'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Home, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAuth } from '@/contexts/auth-context';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  // Navigation items
  const navItems = [{ href: '/dashboard', label: 'Dashboard' }];

  return (
    <>
      {/* Spacer div to push content below the fixed header */}
      <div className="h-16"></div>

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/95 text-primary shadow-lg backdrop-blur-md'
            : 'bg-primary text-primary-50'
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo/App Title */}
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Link href="/dashboard" className="text-xl font-bold flex items-center group">
                <motion.div
                  whileHover={{ rotate: 10 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="mr-2"
                >
                  <Home
                    className={`h-6 w-6 ${scrolled ? 'text-secondary' : 'text-primary-200'} group-hover:text-accent transition-colors`}
                  />
                </motion.div>
                <span className="hidden sm:inline relative overflow-hidden">
                  <span className="inline-block">Ritter Digital</span>
                  <motion.span
                    className={`absolute bottom-0 left-0 h-[2px] ${scrolled ? 'bg-accent' : 'bg-accent'}`}
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </span>
                <span className="sm:hidden">RD</span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map(item => (
                <motion.div
                  key={item.href}
                  whileHover={{ y: -2 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Link
                    href={item.href}
                    className={`relative px-2 py-1 font-medium transition-colors ${
                      pathname === item.href
                        ? scrolled
                          ? 'text-accent'
                          : 'text-accent'
                        : scrolled
                          ? 'text-primary-800'
                          : 'text-primary-100'
                    }`}
                  >
                    {item.label}
                    {pathname === item.href && (
                      <motion.span
                        className={`absolute bottom-0 left-0 h-[2px] w-full ${scrolled ? 'bg-accent' : 'bg-accent'}`}
                        layoutId="underline"
                      />
                    )}
                  </Link>
                </motion.div>
              ))}

              {isAuthenticated && (
                <div className="flex items-center space-x-6">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-sm ${scrolled ? 'text-secondary/80' : 'text-primary-200'}`}
                  >
                    Angemeldet als: {user || 'Benutzer'}
                  </motion.span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      scrolled
                        ? 'bg-accent text-white hover:bg-accent-600 hover:shadow-md'
                        : 'bg-accent text-white hover:bg-accent-400'
                    }`}
                  >
                    Abmelden
                  </motion.button>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className={`md:hidden p-2 rounded-full ${
                scrolled
                  ? 'text-primary hover:bg-primary-100'
                  : 'text-primary-50 hover:bg-primary-700'
              } transition-colors focus:outline-none`}
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Menü öffnen</span>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className={`md:hidden ${
                scrolled
                  ? 'bg-background border-t border-primary-100'
                  : 'bg-primary-700/95 backdrop-blur-md border-t border-primary-600/30'
              }`}
            >
              <div className="container mx-auto px-6 py-4">
                <nav className="flex flex-col space-y-3">
                  {navItems.map(item => (
                    <motion.div
                      key={item.href}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        href={item.href}
                        className={`block py-3 px-4 rounded-lg transition-all ${
                          pathname === item.href
                            ? scrolled
                              ? 'bg-primary-100 text-accent font-medium'
                              : 'bg-primary-600 text-accent font-medium'
                            : scrolled
                              ? 'text-primary-800 hover:bg-primary-100'
                              : 'text-primary-50 hover:bg-primary-600/50'
                        }`}
                        onClick={closeMobileMenu}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}

                  {isAuthenticated && (
                    <>
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                        className={`py-3 px-4 text-sm ${scrolled ? 'text-secondary/80' : 'text-primary-200'}`}
                      >
                        Angemeldet als: {user || 'Benutzer'}
                      </motion.div>
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.2, delay: 0.2 }}
                      >
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={handleLogout}
                          className={`w-full py-3 px-4 rounded-lg text-left transition-all ${
                            scrolled
                              ? 'bg-accent text-white hover:bg-accent-600'
                              : 'bg-accent text-white hover:bg-accent-400'
                          }`}
                        >
                          Abmelden
                        </motion.button>
                      </motion.div>
                    </>
                  )}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
