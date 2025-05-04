'use client';

import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';

import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 pt-16">
        {' '}
        {/* Padding-top für Header */}
        <main className="flex-1 pt-4 px-6 pb-16 bg-background">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
