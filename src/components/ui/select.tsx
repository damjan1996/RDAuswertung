'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { forwardRef, type SelectHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  helperClassName?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      children,
      className,
      label,
      error,
      helperText,
      fullWidth = false,
      disabled,
      required,
      containerClassName,
      labelClassName,
      errorClassName,
      helperClassName,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={cn('flex flex-col space-y-2', fullWidth && 'w-full', containerClassName)}>
        {label && (
          <motion.label
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            htmlFor={selectId}
            className={cn(
              'block text-sm font-medium text-primary-700',
              required && "after:content-['*'] after:ml-0.5 after:text-accent",
              labelClassName
            )}
          >
            {label}
          </motion.label>
        )}

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            required={required}
            className={cn(
              'block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm',
              'focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all duration-200',
              'disabled:opacity-60 disabled:bg-gray-50 disabled:cursor-not-allowed',
              'appearance-none text-primary-800',
              error && 'border-red-300 focus:ring-red-500/20 focus:border-red-500',
              fullWidth && 'w-full',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${selectId}-error` : helperText ? `${selectId}-description` : undefined
            }
            {...props}
          >
            {children}
          </select>

          {/* Custom dropdown arrow */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-primary-400">
            <ChevronDown className="h-4 w-4" />
          </div>
        </motion.div>

        {/* Error message */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            id={`${selectId}-error`}
            className={cn('text-sm text-red-500', errorClassName)}
          >
            {error}
          </motion.p>
        )}

        {/* Helper text - only show when there's no error */}
        {!error && helperText && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            id={`${selectId}-description`}
            className={cn('text-sm text-primary-500/70', helperClassName)}
          >
            {helperText}
          </motion.p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
