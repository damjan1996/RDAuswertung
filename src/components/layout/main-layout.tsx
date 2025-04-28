'use client';

import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { useSidebar } from '@/components/layout/sidebar-context';

import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 pt-16">
        {' '}
        {/* Added pt-16 to account for header height */}
        <Sidebar />
        <main
          className={`flex-1 pt-4 px-6 pb-16 bg-background transition-all duration-300 ${
            isCollapsed ? 'ml-20' : 'ml-64'
          }`}
        >
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
