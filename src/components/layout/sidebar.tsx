'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Home, Loader2, MapPin, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { useStandorte } from '@/hooks/use-standorte';

import { useSidebar } from './sidebar-context';

export default function Sidebar() {
  const { isCollapsed, toggleSidebar, sidebarWidth } = useSidebar();
  const [isHovering, setIsHovering] = useState(false);
  const pathname = usePathname();
  const { standorte, isLoading } = useStandorte();

  // Main navigation items
  const navItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: <Home className="h-5 w-5" />,
    },
  ];

  return (
    <motion.nav
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      className={`${sidebarWidth} bg-primary text-primary-50 h-full fixed left-0 top-16 bottom-0 transition-all duration-300 ease-in-out z-50 md:block`}
      onMouseEnter={() => isCollapsed && setIsHovering(true)}
      onMouseLeave={() => isCollapsed && setIsHovering(false)}
    >
      <div className="h-full flex flex-col">
        {/* Toggle Button */}
        <motion.button
          whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
          whileTap={{ scale: 0.95 }}
          className="p-4 text-primary-50 flex justify-end items-center"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5 text-primary-200" />
          ) : (
            <div className="flex items-center w-full justify-between">
              <span className="text-sm font-medium text-primary-200">Menü einklappen</span>
              <ChevronLeft className="h-5 w-5 text-primary-200" />
            </div>
          )}
        </motion.button>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent">
          <ul className="py-2">
            {navItems.map(item => (
              <motion.li key={item.href} className="mb-1 px-2">
                <Link href={item.href}>
                  <motion.div
                    whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.1)' }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center px-3 py-3 rounded-lg transition-all ${
                      pathname === item.href
                        ? 'bg-secondary/50 text-primary-50'
                        : 'text-primary-100/80 hover:text-primary-50'
                    }`}
                  >
                    <motion.span
                      className={`${pathname === item.href ? 'text-accent' : 'text-primary-200'} mr-3`}
                      whileHover={{ rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      {item.icon}
                    </motion.span>
                    <AnimatePresence>
                      {(!isCollapsed || isHovering) && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="whitespace-nowrap overflow-hidden"
                        >
                          {item.title}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Link>
              </motion.li>
            ))}
          </ul>

          {/* Standorte Section */}
          <div className="border-t border-primary-700/50 pt-4 mt-4 px-2">
            <AnimatePresence>
              {(!isCollapsed || isHovering) && (
                <motion.h3
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-3 mb-2 text-xs uppercase tracking-wider text-primary-200/70 font-medium"
                >
                  Standorte
                </motion.h3>
              )}
            </AnimatePresence>

            {isLoading ? (
              <div className="px-3 py-4 flex justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: 'linear' }}
                >
                  <Loader2 className="h-5 w-5 text-primary-300/70" />
                </motion.div>
              </div>
            ) : (
              <ul className="space-y-1">
                {standorte?.slice(0, isCollapsed && !isHovering ? 5 : 10).map(standort => (
                  <motion.li key={standort.id} className="px-1">
                    <Link href={`/standorte/${standort.id}`}>
                      <motion.div
                        whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.1)' }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center px-2 py-2 text-sm rounded-lg transition-all ${
                          pathname === `/standorte/${standort.id}`
                            ? 'bg-secondary/50 text-primary-50'
                            : 'text-primary-100/80 hover:text-primary-50'
                        }`}
                      >
                        <motion.span
                          className={`${
                            pathname === `/standorte/${standort.id}`
                              ? 'text-accent'
                              : 'text-primary-300/70'
                          } mr-2`}
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <MapPin className="h-4 w-4" />
                        </motion.span>
                        <AnimatePresence>
                          {(!isCollapsed || isHovering) && (
                            <motion.span
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: 'auto' }}
                              exit={{ opacity: 0, width: 0 }}
                              transition={{ duration: 0.2 }}
                              className="truncate whitespace-nowrap overflow-hidden"
                            >
                              {standort.bezeichnung}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            )}

            <AnimatePresence>
              {(!isCollapsed || isHovering) && standorte && standorte.length > 10 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-3 py-2 text-xs text-primary-200/60"
                >
                  + {standorte.length - 10} weitere Standorte
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          className="border-t border-primary-700/50 p-3 mt-auto"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            className="flex items-center p-2 rounded-lg"
          >
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shadow-lg">
              <User className="h-4 w-4 text-primary-50" />
            </div>
            <AnimatePresence>
              {(!isCollapsed || isHovering) && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-2 whitespace-nowrap overflow-hidden"
                >
                  <span className="text-sm font-medium">Admin</span>
                  <p className="text-xs text-primary-200/60">Administrator</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
