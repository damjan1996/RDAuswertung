'use client';

import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { forwardRef, useState } from 'react';

import { cn } from '@/lib/utils';

import type { InputHTMLAttributes } from 'react';
import type React from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  prefixText?: string;
  suffixText?: string;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  helperClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      helperText,
      fullWidth = false,
      disabled,
      required,
      icon,
      iconPosition = 'left',
      prefixText,
      suffixText,
      containerClassName,
      labelClassName,
      errorClassName,
      helperClassName,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const [isFocused, setIsFocused] = useState(false);

    const hasIconOrText = icon || prefixText || suffixText;

    return (
      <div className={cn('flex flex-col space-y-2', fullWidth && 'w-full', containerClassName)}>
        {label && (
          <motion.label
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            htmlFor={inputId}
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
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={cn('relative rounded-lg', fullWidth && 'w-full')}
        >
          {/* Prefix text or left icon */}
          {(prefixText || (icon && iconPosition === 'left')) && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {prefixText && <span className="text-primary-500 sm:text-sm">{prefixText}</span>}
              {icon && iconPosition === 'left' && (
                <motion.span
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: isFocused ? 1 : 0.7 }}
                  className={cn('text-primary-400', isFocused && 'text-accent')}
                >
                  {icon}
                </motion.span>
              )}
            </div>
          )}

          <input
            id={inputId}
            type={type}
            ref={ref}
            disabled={disabled}
            required={required}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              'block w-full border border-gray-200 rounded-lg shadow-sm',
              'focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all duration-200',
              'disabled:opacity-60 disabled:bg-gray-50 disabled:cursor-not-allowed',
              error && 'border-red-300 focus:ring-red-500/20 focus:border-red-500',
              prefixText || (icon && iconPosition === 'left') ? 'pl-10' : '',
              suffixText || (icon && iconPosition === 'right') ? 'pr-10' : '',
              hasIconOrText ? '' : 'py-2 px-3',
              fullWidth && 'w-full',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-description` : undefined
            }
            {...props}
          />

          {/* Suffix text or right icon */}
          {(suffixText || (icon && iconPosition === 'right')) && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {suffixText && <span className="text-primary-500 sm:text-sm">{suffixText}</span>}
              {icon && iconPosition === 'right' && (
                <motion.span
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: isFocused ? 1 : 0.7 }}
                  className={cn('text-primary-400', isFocused && 'text-accent')}
                >
                  {icon}
                </motion.span>
              )}
            </div>
          )}
        </motion.div>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.2 }}
            className="flex items-start"
          >
            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 mr-1.5 flex-shrink-0" />
            <p id={`${inputId}-error`} className={cn('text-sm text-red-500', errorClassName)}>
              {error}
            </p>
          </motion.div>
        )}

        {/* Helper text - only show when there's no error */}
        {!error && helperText && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            id={`${inputId}-description`}
            className={cn('text-sm text-primary-500/70', helperClassName)}
          >
            {helperText}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
