'use client';

import React, { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  noPadding?: boolean;
  headerAction?: React.ReactNode;
  bordered?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({
  children,
  className,
  title,
  subtitle,
  footer,
  noPadding = false,
  headerAction,
  bordered = true,
  shadow = 'md',
  ...props
}: CardProps) {
  // Shadow styles
  const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  return (
    <div
      className={cn(
        'bg-white rounded-lg overflow-hidden',
        bordered && 'border border-gray-200',
        shadowStyles[shadow],
        className
      )}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <div className="border-b border-gray-200">
          <div className="px-4 py-4 sm:px-6 flex justify-between items-center">
            <div>
              {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
              {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
            </div>
            {headerAction && <div>{headerAction}</div>}
          </div>
        </div>
      )}

      <div className={noPadding ? '' : 'p-4 sm:p-6'}>{children}</div>

      {footer && <div className="border-t border-gray-200 px-4 py-4 sm:px-6">{footer}</div>}
    </div>
  );
}
