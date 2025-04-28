'use client';

import Sidebar from '@/components/layout/sidebar';
import { useSidebar } from '@/components/layout/sidebar-context';

import type { ReactNode } from 'react';

interface AppContentProps {
  children: ReactNode;
}

export default function AppContent({ children }: AppContentProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex flex-1">
      <Sidebar />
      {/* Add left margin to account for the fixed sidebar, responsive to collapsed state */}
      <main
        className={`flex-1 pt-4 px-6 pb-16 bg-background transition-all duration-300 ${
          isCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        {children}
      </main>
    </div>
  );
}
