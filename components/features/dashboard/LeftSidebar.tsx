'use client';

import React from 'react';
import { LucideIcon, X } from 'lucide-react';

// ─── Type Definitions ─────────────────────────────────────────────────────────
export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon | React.ComponentType<{ size?: number; className?: string }> | string;
  badge?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface LeftSidebarProps {
  navGroups: NavGroup[];
  activeId: string;
  onActiveChange: (id: string) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

// ─── Icon Primitive Helper ───────────────────────────────────────────────────
const Icon = ({ d, size = 18 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

// ─── SidebarItem Component ───────────────────────────────────────────────────
interface SidebarItemProps extends NavItem {
  isActive: boolean;
  collapsed: boolean;
  onClick: () => void;
}

function SidebarItem({
  label,
  icon,
  badge,
  isActive,
  collapsed,
  onClick,
}: SidebarItemProps) {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        aria-label={label}
        className={`w-full flex items-center h-9.5 transition-colors duration-150 relative text-left cursor-pointer overflow-hidden ${
          collapsed ? 'justify-center px-0' : 'px-3.5'
        } ${
          isActive
            ? 'bg-[#0552A2]/8 text-[#0552A2] font-semibold'
            : 'text-slate-600 hover:text-[#17212B] hover:bg-slate-100/80 active:bg-slate-100 font-medium'
        }`}
      >
        {/* Active Left Edge Indicator */}
        <span
          className={`absolute left-0 top-0 bottom-0 w-[3px] bg-[#0552A2] transition-opacity duration-150 ${
            isActive ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Icon Container */}
        <span
          className={`h-6 w-6 shrink-0 flex items-center justify-center rounded-md transition-colors duration-150 ${
            isActive ? 'text-[#0552A2]' : 'text-slate-400 group-hover:text-slate-700'
          }`}
        >
          {typeof icon === 'string' ? (
            <Icon d={icon} size={16} />
          ) : (
            React.createElement(icon, { size: 16, className: 'shrink-0' })
          )}
        </span>

        {/* Text Label & Badge */}
        <div
          className={`flex-1 min-w-0 flex items-center justify-between ml-2.5 whitespace-nowrap overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            collapsed
              ? 'opacity-0 -translate-x-2 pointer-events-none max-w-0 ml-0'
              : 'opacity-100 translate-x-0 max-w-[170px]'
          }`}
        >
          <span className="truncate text-[13px]">
            {label}
          </span>

          {badge && (
            <span
              className={`rounded-full text-[10px] font-semibold px-1.5 py-0.5 leading-none shrink-0 ml-1.5 transition-colors ${
                isActive
                  ? 'bg-[#0552A2] text-white'
                  : 'bg-slate-200/80 text-slate-600 group-hover:bg-[#0552A2]/15 group-hover:text-[#0552A2]'
              }`}
            >
              {badge}
            </span>
          )}
        </div>

        {/* Collapsed Badge Dot Indicator */}
        {collapsed && badge && (
          <span className="absolute top-1.5 right-2 h-1.5 w-1.5 rounded-full bg-[#EC1F27] ring-2 ring-white" />
        )}
      </button>

      {/* Accessible Floating Tooltip in Collapsed Mode */}
      {collapsed && (
        <div className="absolute left-[58px] top-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-out">
          <div className="bg-[#17212B] text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-xl flex items-center gap-1.5 whitespace-nowrap border border-white/10">
            <span>{label}</span>
            {badge && (
              <span className="bg-[#0552A2] text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                {badge}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SidebarGroup Component ──────────────────────────────────────────────────
interface SidebarGroupProps {
  title: string;
  items: NavItem[];
  activeId: string;
  collapsed: boolean;
  onItemClick: (id: string) => void;
}

function SidebarGroup({
  items,
  activeId,
  collapsed,
  onItemClick,
}: SidebarGroupProps) {
  return (
    <div>
      <div className="flex flex-col">
        {items.map((item) => (
          <SidebarItem
            key={item.id}
            id={item.id}
            label={item.label}
            icon={item.icon}
            badge={item.badge}
            isActive={activeId === item.id}
            collapsed={collapsed}
            onClick={() => onItemClick(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main LeftSidebar Component ──────────────────────────────────────────────
export default function LeftSidebar({
  navGroups,
  activeId,
  onActiveChange,
  collapsed,
  onCollapsedChange,
  mobileOpen = false,
  onMobileClose,
}: LeftSidebarProps) {
  return (
    <>
      {/* ── 1. DESKTOP / TABLET IN-FLOW SIDEBAR ───────────────────────────── */}
      <aside
        className={`hidden md:flex flex-col shrink-0 h-full select-none bg-white border-r border-slate-200 z-20 will-change-[width] overflow-hidden transition-[width] duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          collapsed ? 'w-[54px]' : 'w-[204px]'
        }`}
      >
        {/* Sticky Collapse Toggle Bar */}
        <div
          className={`sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-2.5 py-1.5 flex items-center h-9 ${
            collapsed ? 'justify-center' : 'justify-end'
          }`}
        >
          {/* Toggle Button */}
          <button
            onClick={() => onCollapsedChange(!collapsed)}
            className="p-1 rounded-md text-slate-400 hover:text-[#0552A2] hover:bg-slate-200/50 active:scale-95 transition-all duration-200 cursor-pointer shrink-0"
            title={collapsed ? 'Expand Sidebar (Ctrl+B)' : 'Collapse Sidebar (Ctrl+B)'}
            aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                collapsed ? 'rotate-180' : 'rotate-0'
              }`}
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>

        {/* Scrollable Navigation Groups List */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden divide-y divide-slate-100 scrollbar-none">
          {navGroups.map((group) => (
            <SidebarGroup
              key={group.title}
              title={group.title}
              items={group.items}
              activeId={activeId}
              collapsed={collapsed}
              onItemClick={onActiveChange}
            />
          ))}
        </nav>
      </aside>

      {/* ── 2. MOBILE SLIDE-IN DRAWER WITH BACKDROP ───────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop Overlay */}
          <div
            onClick={onMobileClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <div className="relative w-64 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
            {/* Mobile Drawer Header */}
            <div className="flex items-center justify-end px-4 py-2.5 border-b border-slate-100 bg-white">
              <button
                onClick={onMobileClose}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 transition-colors"
                aria-label="Close Navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex-1 overflow-y-auto divide-y divide-slate-100 scrollbar-none">
              {navGroups.map((group) => (
                <SidebarGroup
                  key={group.title}
                  title={group.title}
                  items={group.items}
                  activeId={activeId}
                  collapsed={false}
                  onItemClick={(id) => {
                    onActiveChange(id);
                    onMobileClose?.();
                  }}
                />
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
