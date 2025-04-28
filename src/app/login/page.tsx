'use client';

import { motion } from 'framer-motion';
import { Loader2, Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useAuth } from '@/contexts/auth-context';

import type { UserCredentials } from '@/types/auth.types';
import type React from 'react';

export default function LoginPage() {
  const [credentials, setCredentials] = useState<UserCredentials>({
    username: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { login, isAuthenticated, error, clearError, loading } = useAuth();
  const router = useRouter();

  // Wenn bereits authentifiziert, zur Dashboard-Seite weiterleiten
  if (isAuthenticated && !loading) {
    router.push('/dashboard');
  }

  // Bei Änderung der Eingabefelder
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));

    // Fehler zurücksetzen, wenn der Benutzer Änderungen vornimmt
    if (error) {
      clearError();
    }
  };

  // Bei Absenden des Formulars
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await login(credentials);
      if (result) {
        router.push('/dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Loader2 className="h-12 w-12 text-accent animate-spin mx-auto" />
          <p className="mt-4 text-primary-600">Lade...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg border border-gray-100"
      >
        <motion.div variants={itemVariants} className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center justify-center mb-4"
          >
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-primary-50"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-2xl font-bold text-primary-800 mb-1">
            Ritter Digital
          </motion.h1>
          <motion.h2 variants={itemVariants} className="text-lg font-medium text-primary-600">
            Raumbuch Auswertung
          </motion.h2>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md"
          >
            <p>{error}</p>
          </motion.div>
        )}

        <motion.form variants={itemVariants} onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-primary-700 mb-1">
              Benutzername
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-primary-400" />
              </div>
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all duration-200"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-primary-700 mb-1">
              Passwort
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-primary-400" />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all duration-200"
                required
              />
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ y: -2, boxShadow: '0 4px 8px rgba(255, 138, 76, 0.25)' }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-accent hover:bg-accent-600 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 flex justify-center items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4 text-white" />
                Anmelden...
              </>
            ) : (
              'Anmelden'
            )}
          </motion.button>
        </motion.form>

        <motion.div variants={itemVariants} className="mt-6 text-center text-sm text-primary-500">
          © {new Date().getFullYear()} Ritter Digital GmbH
        </motion.div>
      </motion.div>
    </div>
  );
}
