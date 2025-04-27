'use client';

import React, { forwardRef, InputHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

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

    const hasIconOrText = icon || prefixText || suffixText;

    return (
      <div className={cn('flex flex-col space-y-1', fullWidth && 'w-full', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium text-gray-700',
              required && 'after:content-["*"] after:ml-0.5 after:text-red-500',
              labelClassName
            )}
          >
            {label}
          </label>
        )}

        <div className={cn('relative rounded-md', fullWidth && 'w-full')}>
          {/* Prefix text or left icon */}
          {(prefixText || (icon && iconPosition === 'left')) && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {prefixText && <span className="text-gray-500 sm:text-sm">{prefixText}</span>}
              {icon && iconPosition === 'left' && <span className="text-gray-400">{icon}</span>}
            </div>
          )}

          <input
            id={inputId}
            type={type}
            ref={ref}
            disabled={disabled}
            required={required}
            className={cn(
              'block border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
              'disabled:opacity-60 disabled:bg-gray-100 disabled:cursor-not-allowed',
              error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
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
              {suffixText && <span className="text-gray-500 sm:text-sm">{suffixText}</span>}
              {icon && iconPosition === 'right' && <span className="text-gray-400">{icon}</span>}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p id={`${inputId}-error`} className={cn('text-sm text-red-600', errorClassName)}>
            {error}
          </p>
        )}

        {/* Helper text - only show when there's no error */}
        {!error && helperText && (
          <p id={`${inputId}-description`} className={cn('text-sm text-gray-500', helperClassName)}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
