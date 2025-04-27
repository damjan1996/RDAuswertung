import { Metadata } from 'next';
import React, { ReactNode } from 'react';

// Define props for the layout component
interface StandortLayoutProps {
  children: ReactNode;
  params: {
    id: string;
  };
}

// Generate metadata for the page
export async function generateMetadata({ params }: StandortLayoutProps): Promise<Metadata> {
  // You could fetch the standort name here for a more specific title
  return {
    title: `Standort Details - ID ${params.id}`,
    description:
      'Detailansicht eines Standorts mit Informationen zu den Räumen und Reinigungsdaten',
  };
}

export default function StandortLayout({ children }: StandortLayoutProps) {
  return (
    <div className="relative">
      {/* Standort-specific layout elements could go here */}
      <div className="space-y-6">{children}</div>
    </div>
  );
}
