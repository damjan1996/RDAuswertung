import { Metadata } from 'next';
import React, { ReactNode } from 'react';

// Define the props for the layout component
interface ReportLayoutProps {
  children: ReactNode;
  params: {
    id: string;
  };
}

// Generate metadata for the page
export async function generateMetadata({ params }: ReportLayoutProps): Promise<Metadata> {
  // You could fetch the standort name here for a more specific title
  return {
    title: `Raumbuch Auswertung - Standort ${params.id}`,
    description: 'Detaillierte Auswertung der Raumbuch-Daten für den ausgewählten Standort',
  };
}

export default function ReportLayout({ children }: ReportLayoutProps) {
  return (
    <div className="relative">
      {/* Report-specific layout elements could go here */}
      <div className="space-y-6">{children}</div>
    </div>
  );
}
