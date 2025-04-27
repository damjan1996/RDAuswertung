'use client';

import React from 'react';

import { cn } from '@/lib/utils';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  className?: string;
  label?: string;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Loader({
  size = 'medium',
  color = 'primary',
  className = '',
  label,
  labelPosition = 'right',
}: LoaderProps) {
  // Size mappings
  const sizeMap = {
    small: {
      spinner: 'w-4 h-4',
      track: 'border',
      text: 'text-xs',
    },
    medium: {
      spinner: 'w-8 h-8',
      track: 'border-2',
      text: 'text-sm',
    },
    large: {
      spinner: 'w-12 h-12',
      track: 'border-4',
      text: 'text-base',
    },
  };

  // Color mappings
  const colorMap = {
    primary: {
      track: 'border-primary-100',
      spinner: 'border-primary-600',
      text: 'text-primary-800',
    },
    secondary: {
      track: 'border-secondary-100',
      spinner: 'border-secondary-600',
      text: 'text-secondary-800',
    },
    white: {
      track: 'border-white/30',
      spinner: 'border-white',
      text: 'text-white',
    },
    gray: {
      track: 'border-gray-100',
      spinner: 'border-gray-400',
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

  return (
    <div
      className={cn(
        'inline-flex',
        label ? directionClass[labelPosition] : 'items-center justify-center',
        className
      )}
    >
      <div className="relative">
        <div
          className={cn(
            'rounded-full animate-spin',
            sizeStyle.spinner,
            sizeStyle.track,
            colorStyle.track,
            colorStyle.spinner
          )}
          style={{
            borderTopColor: 'transparent',
          }}
          role="status"
          aria-label="Loading"
        />
      </div>

      {label && <span className={cn(sizeStyle.text, colorStyle.text)}>{label}</span>}
    </div>
  );
}
