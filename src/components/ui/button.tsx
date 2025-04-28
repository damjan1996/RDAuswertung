'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

import type { HTMLMotionProps } from 'framer-motion';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

// Erstelle einen benutzerdefinierten Typ, der die Kollisionen zwischen HTML-Button und Framer Motion behandelt
type ButtonBaseProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  keyof HTMLMotionProps<'button'>
>;

export interface ButtonProps extends ButtonBaseProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      type = 'button',
      ...props
    },
    ref
  ) => {
    // Variant styles
    const variantStyles = {
      primary: 'bg-accent hover:bg-accent-600 text-white focus:ring-accent/30',
      secondary: 'bg-primary-700 text-white hover:bg-primary-800 focus:ring-primary-500/30',
      outline:
        'bg-transparent border border-primary-200 text-primary-700 hover:bg-primary-50 focus:ring-primary-500/20',
      ghost: 'bg-transparent text-primary-700 hover:bg-primary-50 focus:ring-primary-500/20',
      link: 'bg-transparent text-accent hover:text-accent-600 hover:underline focus:ring-accent/20 p-0',
    };

    // Size styles
    const sizeStyles = {
      sm: 'text-xs px-2.5 py-1.5',
      md: 'text-sm px-4 py-2',
      lg: 'text-base px-6 py-3',
    };

    // Only add padding to link variant when icons are present
    const linkPadding = variant === 'link' && (leftIcon || rightIcon) ? 'px-1' : '';

    // Motion variants for hover and tap effects
    const motionVariants = {
      hover: variant === 'link' ? {} : { y: -2 },
      tap: variant === 'link' ? {} : { scale: 0.98 },
    };

    // Filtere HTML-Button-spezifische Props
    const buttonProps = { ...props } as any;

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        whileHover={!disabled && !isLoading ? motionVariants.hover : {}}
        whileTap={!disabled && !isLoading ? motionVariants.tap : {}}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-lg',
          'focus:outline-none focus:ring-2 focus:ring-offset-1',
          'transition-colors duration-200 ease-in-out',
          variantStyles[variant],
          variant !== 'link' && sizeStyles[size],
          linkPadding,
          fullWidth ? 'w-full' : '',
          (disabled || isLoading) && 'opacity-60 cursor-not-allowed',
          className
        )}
        {...buttonProps}
      >
        {isLoading && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="-ml-1 mr-2"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
          </motion.span>
        )}

        {!isLoading && leftIcon && (
          <motion.span
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="mr-2"
          >
            {leftIcon}
          </motion.span>
        )}

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          {children}
        </motion.span>

        {!isLoading && rightIcon && (
          <motion.span
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-2"
          >
            {rightIcon}
          </motion.span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
