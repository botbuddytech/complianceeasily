'use client';

import { Link, NavLink } from '@/components/nav/NextNav';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { BrandMark } from '@/components/BrandMark';
import { navFor, type DashboardVariant } from './navConfig';

interface SidebarProps {
  variant: DashboardVariant;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  variant,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const items = navFor(variant);
  const subtitle =
    variant === 'admin'
      ? 'Admin Console'
      : variant === 'professional'
        ? 'Professional Workspace'
        : 'Client Workspace';

  const shell = (forceExpanded = false) => {
    const isCollapsed = forceExpanded ? false : collapsed;
    return (
    <aside
      className={`flex h-full flex-col border-r border-[#1E2630] bg-[#0E1217] text-white transition-[width] duration-200 ${
        isCollapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      <div
        className={`relative flex border-b border-[#1E2630] px-3 ${
          isCollapsed ? 'h-14 items-center justify-center' : 'h-14 items-center justify-between'
        }`}
      >
        {!isCollapsed ? (
          <Link
            to="/"
            className="min-w-0 pl-1 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
            onClick={onCloseMobile}
          >
            <BrandMark size="xs" />
            <div className="min-w-0">
              <div className="truncate text-sm font-bold tracking-tight">
                Compliance<span className="text-[#B89E6B]">Easily</span>
              </div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#A8B0BA]">
                {subtitle}
              </div>
            </div>
          </Link>
        ) : (
          <Link
            to="/"
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:opacity-90 transition-opacity"
            aria-label="Go to home"
            title="Home"
            onClick={onCloseMobile}
          >
            <BrandMark size="xs" framed={false} className="!h-9 !w-9" />
          </Link>
        )}
        <button
          type="button"
          onClick={onToggleCollapse}
          className={`hidden rounded-lg p-1.5 hover:bg-[#1A2129] lg:inline-flex ${
            isCollapsed ? 'absolute right-1 top-1' : ''
          }`}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={onCloseMobile}
          className="inline-flex rounded-lg p-1.5 hover:bg-[#1A2129] lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              title={isCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#B89E6B] text-white'
                    : 'text-[#A8B0BA] hover:bg-[#1A2129] hover:text-white'
                } ${isCollapsed ? 'justify-center px-2' : ''}`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {!isCollapsed && (
        <div className="border-t border-[#1E2630] p-3 text-[10px] font-mono text-[#6B7580]">
          UI scaffold · mock data
        </div>
      )}
    </aside>
    );
  };

  return (
    <>
      {/* Desktop */}
      <div className="hidden h-full shrink-0 lg:block">{shell(false)}</div>

      {/* Mobile drawer — always full-width labels */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[#0E1217]/60 backdrop-blur-[2px]"
            aria-label="Close menu backdrop"
            onClick={onCloseMobile}
          />
          <div className="absolute inset-y-0 left-0 max-w-[85vw] shadow-2xl">{shell(true)}</div>
        </div>
      )}
    </>
  );
}
