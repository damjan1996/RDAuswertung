'use client';

import React, { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

// Definieren wir eine neue Schnittstelle, die title ausschließt
type CardBaseProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'>;

// Jetzt erweitern wir unsere CardProps von dieser modifizierten Basis
interface CardProps extends CardBaseProps {
  title?: ReactNode;
  subtitle?: string;
  footer?: React.ReactNode;
  noPadding?: boolean;
  headerAction?: React.ReactNode;
  bordered?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  action?: ReactNode;
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
  action,
  ...props
}: CardProps) {
  // Shadow styles
  const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  // Wenn sowohl action als auch headerAction definiert sind, verwende headerAction
  const headerActionContent = headerAction || action;

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
      {(title || subtitle || headerActionContent) && (
        <div className="border-b border-gray-200">
          <div className="px-4 py-4 sm:px-6 flex justify-between items-center">
            <div className="flex-1">
              {typeof title === 'string' ? (
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              ) : (
                title
              )}
              {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
            </div>
            {headerActionContent && <div>{headerActionContent}</div>}
          </div>
        </div>
      )}

      <div className={noPadding ? '' : 'p-4 sm:p-6'}>{children}</div>

      {footer && <div className="border-t border-gray-200 px-4 py-4 sm:px-6">{footer}</div>}
    </div>
  );
}
