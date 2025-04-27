'use client';

import React from 'react';

import Select from '@/components/ui/select';

import type { Standort } from '@/types/standort.types';

interface StandortSelectProps {
  standorte: Standort[];
  value: number | null;
  onChange: (value: number) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  label?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
}

export default function StandortSelect({
  standorte,
  value,
  onChange,
  placeholder = 'Standort auswählen...',
  required = false,
  className = '',
  label = 'Standort',
  id = 'standort-select',
  name = 'standort',
  disabled = false,
}: StandortSelectProps) {
  // Sort standorte by bezeichnung
  const sortedStandorte = [...standorte].sort((a, b) => a.bezeichnung.localeCompare(b.bezeichnung));

  // Handle select change
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value);
    if (!isNaN(selectedId)) {
      onChange(selectedId);
    }
  };

  return (
    <Select
      id={id}
      name={name}
      label={label}
      value={value?.toString() || ''}
      onChange={handleChange}
      required={required}
      className={className}
      disabled={disabled}
    >
      <option value="" disabled>
        {placeholder}
      </option>

      {sortedStandorte.map(standort => (
        <option key={standort.id} value={standort.id.toString()}>
          {standort.bezeichnung}
        </option>
      ))}
    </Select>
  );
}
