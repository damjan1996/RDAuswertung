'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

import { useStandorte } from '@/hooks/use-standorte';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { standorte, isLoading } = useStandorte();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Main navigation items
  const navItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
    },
  ];

  const sidebarWidth = isCollapsed ? 'w-16' : 'w-64';

  return (
    <nav
      className={`${sidebarWidth} bg-primary-700 text-white h-full transition-all duration-300 ease-in-out hidden md:block`}
    >
      <div className="h-full flex flex-col">
        {/* Toggle Button */}
        <button
          className="p-4 text-white hover:bg-primary-600 flex justify-end"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isCollapsed ? 'M13 5l7 7-7 7M5 5l7 7-7 7' : 'M11 19l-7-7 7-7m8 14l-7-7 7-7'}
            />
          </svg>
        </button>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto">
          <ul className="py-2">
            {navItems.map(item => (
              <li key={item.href} className="mb-1">
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 ${
                    pathname === item.href ? 'bg-primary-800 text-white' : 'hover:bg-primary-600'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              </li>
            ))}
          </ul>

          {/* Standorte Section */}
          <div className="border-t border-primary-600 pt-4 mt-4">
            <h3
              className={`px-4 mb-2 text-xs uppercase text-gray-300 ${isCollapsed ? 'sr-only' : ''}`}
            >
              Standorte
            </h3>
            {isLoading ? (
              <div className="px-4 py-2 text-sm text-gray-300">Wird geladen...</div>
            ) : (
              <ul className="space-y-1">
                {standorte?.slice(0, isCollapsed ? 5 : 10).map(standort => (
                  <li key={standort.id}>
                    <Link
                      href={`/standorte/${standort.id}`}
                      className={`flex items-center px-4 py-2 text-sm ${
                        pathname === `/standorte/${standort.id}`
                          ? 'bg-primary-800 text-white'
                          : 'hover:bg-primary-600'
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {!isCollapsed && <span className="truncate">{standort.bezeichnung}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {!isCollapsed && standorte && standorte.length > 10 && (
              <div className="px-4 py-2 text-sm text-gray-300">
                + {standorte.length - 10} weitere
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-primary-600 p-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            {!isCollapsed && <span className="ml-2 text-sm">Admin</span>}
          </div>
        </div>
      </div>
    </nav>
  );
}
