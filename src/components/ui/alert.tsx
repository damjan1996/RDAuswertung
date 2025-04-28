'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, CheckCircle, X, XCircle } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import type React from 'react';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  dismissible?: boolean;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
}

export default function Alert({
  children,
  variant = 'info',
  dismissible = false,
  className = '',
  title,
  icon,
}: AlertProps) {
  const [visible, setVisible] = useState(true);

  // Variant specific styles
  const variantStyles = {
    info: {
      container: 'bg-primary-50 border-primary-200 text-primary-800',
      icon: 'text-primary-400',
      closeButton: 'text-primary-500 hover:bg-primary-100',
    },
    success: {
      container: 'bg-green-50 border-green-200 text-green-800',
      icon: 'text-green-500',
      closeButton: 'text-green-500 hover:bg-green-100',
    },
    warning: {
      container: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: 'text-amber-500',
      closeButton: 'text-amber-500 hover:bg-amber-100',
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: 'text-red-500',
      closeButton: 'text-red-500 hover:bg-red-100',
    },
  };

  // Default icons based on variant
  const defaultIcons = {
    info: <AlertCircle className="h-5 w-5" />,
    success: <CheckCircle className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
    error: <XCircle className="h-5 w-5" />,
  };

  // Use custom icon or default based on variant
  const alertIcon = icon || defaultIcons[variant];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
          className={cn(
            'border-l-4 p-4 mb-4 rounded-lg shadow-sm',
            variantStyles[variant].container,
            className
          )}
          role="alert"
        >
          <div className="flex items-start">
            <div className={cn('flex-shrink-0 mr-3', variantStyles[variant].icon)}>{alertIcon}</div>
            <div className="flex-1">
              {title && (
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-base font-medium mb-1"
                >
                  {title}
                </motion.h3>
              )}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-sm"
              >
                {children}
              </motion.div>
            </div>
            {dismissible && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className={cn(
                  'ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-opacity-20 p-1.5 inline-flex h-8 w-8 items-center justify-center',
                  variantStyles[variant].closeButton
                )}
                onClick={() => setVisible(false)}
                aria-label="Schließen"
              >
                <span className="sr-only">Schließen</span>
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
