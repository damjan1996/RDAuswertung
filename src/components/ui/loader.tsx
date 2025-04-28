'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'accent' | 'white' | 'gray';
  className?: string;
  label?: string;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
  variant?: 'spinner' | 'dots' | 'icon';
}

export default function Loader({
  size = 'medium',
  color = 'primary',
  className = '',
  label,
  labelPosition = 'right',
  variant = 'spinner',
}: LoaderProps) {
  // Size mappings
  const sizeMap = {
    small: {
      spinner: 'w-4 h-4',
      icon: 'w-4 h-4',
      dots: 'w-1.5 h-1.5 mx-0.5',
      text: 'text-xs',
    },
    medium: {
      spinner: 'w-8 h-8',
      icon: 'w-6 h-6',
      dots: 'w-2 h-2 mx-1',
      text: 'text-sm',
    },
    large: {
      spinner: 'w-12 h-12',
      icon: 'w-8 h-8',
      dots: 'w-2.5 h-2.5 mx-1.5',
      text: 'text-base',
    },
  };

  // Color mappings
  const colorMap = {
    primary: {
      track: 'border-primary-100',
      spinner: 'border-primary-600',
      dots: 'bg-primary-600',
      icon: 'text-primary-600',
      text: 'text-primary-800',
    },
    secondary: {
      track: 'border-secondary-100',
      spinner: 'border-secondary-600',
      dots: 'bg-secondary-600',
      icon: 'text-secondary-600',
      text: 'text-secondary-800',
    },
    accent: {
      track: 'border-accent-100',
      spinner: 'border-accent',
      dots: 'bg-accent',
      icon: 'text-accent',
      text: 'text-primary-800',
    },
    white: {
      track: 'border-white/30',
      spinner: 'border-white',
      dots: 'bg-white',
      icon: 'text-white',
      text: 'text-white',
    },
    gray: {
      track: 'border-gray-100',
      spinner: 'border-gray-400',
      dots: 'bg-gray-400',
      icon: 'text-gray-400',
      text: 'text-gray-700',
    },
  };

  // Get styles based on props
  const sizeStyle = sizeMap[size];
  const colorStyle = colorMap[color];

  // Direction classes for label
  const directionClass = {
    top: 'flex-col-reverse items-center space-y-reverse space-y-2',
    bottom: 'flex-col items-center space-y-2',
    left: 'flex-row-reverse items-center space-x-reverse space-x-2',
    right: 'flex-row items-center space-x-2',
  };

  // Animation variants for dots
  const dotsContainerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const dotVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -6, 0],
      transition: {
        duration: 0.8,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'easeInOut',
      },
    },
  };

  // Render the appropriate loader variant
  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return (
          <motion.div
            className="flex items-center justify-center"
            variants={dotsContainerVariants}
            initial="initial"
            animate="animate"
          >
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className={cn('rounded-full', sizeStyle.dots, colorStyle.dots)}
                variants={dotVariants}
              />
            ))}
          </motion.div>
        );
      case 'icon':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
            className={cn(sizeStyle.icon, colorStyle.icon)}
          >
            <Loader2 className="w-full h-full" />
          </motion.div>
        );
      case 'spinner':
      default:
        return (
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={cn(
                'rounded-full border-2 border-transparent animate-spin',
                sizeStyle.spinner,
                colorStyle.track
              )}
              style={{
                borderRightColor: 'currentColor',
                borderTopColor: 'currentColor',
              }}
              role="status"
              aria-label="Loading"
            />
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'inline-flex',
        label ? directionClass[labelPosition] : 'items-center justify-center',
        className
      )}
    >
      {renderLoader()}

      {label && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className={cn(sizeStyle.text, colorStyle.text)}
        >
          {label}
        </motion.span>
      )}
    </motion.div>
  );
}
