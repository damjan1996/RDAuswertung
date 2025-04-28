import '@/styles/globals.css';
import { SidebarProvider } from '@/components/layout/sidebar-context';
import { AuthProvider } from '@/contexts/auth-context'; // Hier den richtigen Pfad verwenden!

import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body>
        <AuthProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
