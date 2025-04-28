'use client';

import React, { createContext, ReactNode, useContext, useState } from 'react';

interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  sidebarWidth: string; // Hinzugefügt, um TypeScript-Fehler zu beheben
}

const defaultContext: SidebarContextType = {
  isCollapsed: false,
  toggleSidebar: () => {},
  sidebarWidth: 'w-64', // Standardwert für nicht-kollabierten Zustand
};

const SidebarContext = createContext<SidebarContextType>(defaultContext);

export const useSidebar = () => useContext(SidebarContext);

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  // Dynamisch die Breite der Sidebar basierend auf dem Zustand setzen
  const sidebarWidth = isCollapsed ? 'w-20' : 'w-64';

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar, sidebarWidth }}>
      {children}
    </SidebarContext.Provider>
  );
};
