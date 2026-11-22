'use client';

import React from 'react';
import NepalBackgroundMap from '@/components/features/chat/NepalBackgroundMap';
import WeatherTelemetry from '@/components/features/chat/WeatherTelemetry';
import CoPlannerHub from '@/components/features/chat/CoPlannerHub';
import ChatsList, { Channel } from '@/components/features/chat/ChatsList';

export type { Channel };

export interface RightSidebarProps {
  rightCollapsed: boolean;
  onRightCollapsedChange: (val: boolean) => void;
  isFullExpanded: boolean;
  onIsFullExpandedChange: (val: boolean) => void;
  rightSidebarTab: 'telemetry' | 'chat' | 'notices';
  onRightSidebarTabChange: (val: 'telemetry' | 'chat' | 'notices') => void;
  chatViewState: 'inbox' | 'conversation';
  onChatViewStateChange: (val: 'inbox' | 'conversation') => void;
  collapsed: boolean; // Left sidebar collapsed state
  channels: Channel[];
  activeChannelId: string;
  onActiveChannelIdChange: (id: string) => void;
  expandedChannelId: string | null;
  onExpandedChannelIdChange: (id: string | null) => void;
  weather: {
    region: string;
    temp: string;
    status: string;
    alert: string;
  };
  calendarMarks: Record<string, boolean>;
  onCalendarMarksChange: (updater: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>)) => void;
  userNote: string;
  onUserNoteChange: (note: string) => void;
  companyNote: string;
  onCompanyNoteChange: (note: string) => void;
  renderSingleChatView: (chan: Channel, showBackButton: boolean) => React.ReactNode;
}

export default function RightSidebar({
  rightCollapsed,
  onRightCollapsedChange,
  isFullExpanded,
  onIsFullExpandedChange,
  rightSidebarTab,
  onRightSidebarTabChange,
  chatViewState,
  onChatViewStateChange,
  collapsed,
  channels,
  activeChannelId,
  onActiveChannelIdChange,
  expandedChannelId,
  onExpandedChannelIdChange,
  weather,
  calendarMarks,
  onCalendarMarksChange,
  userNote,
  onUserNoteChange,
  companyNote,
  onCompanyNoteChange,
  renderSingleChatView,
}: RightSidebarProps) {
  const activeChannelObj = channels.find(c => c.id === activeChannelId) || channels[0];

  const renderContent = (isMobile: boolean = false) => {
    if (rightSidebarTab === 'notices') {
      const notices = [
        {
          id: 'n-1',
          title: 'Lukla Flight Seasonal Advisory',
          time: '15m ago',
          category: 'Flight',
          detail: 'Peak-season flights to Lukla may depart from Ramechhap (Manthali). Allow a 2–3 day buffer before your return flight home.',
          unread: true,
        },
        {
          id: 'n-2',
          title: 'ACAP & TIMS Permit Endorsed',
          time: '2h ago',
          category: 'Permit',
          detail: 'Your Annapurna Conservation Area Permit and TIMS card are ready for checkpoint verification.',
          unread: true,
        },
        {
          id: 'n-3',
          title: 'High-Altitude Cash Reminder',
          time: 'Yesterday',
          category: 'Tip',
          detail: 'Withdraw NPR in Kathmandu or Pokhara and break 1,000 NPR notes before starting your trek; teahouses are cash-only.',
          unread: false,
        },
        {
          id: 'n-4',
          title: 'Clear Morning Window in Khumbu',
          time: '2d ago',
          category: 'Weather',
          detail: 'Stable morning skies reported above Namche Bazaar (3,440m). Maintain 400–500m daily sleeping elevation gains.',
          unread: false,
        },
      ];

      return (
        <div className="flex flex-col flex-1 min-h-0 relative text-left w-full overflow-hidden bg-white">
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 py-2.5 flex items-center justify-between border-b border-slate-100 gap-2">
            <span className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#17212B] truncate">
              Notices
            </span>
            <button
              onClick={() => {
                if (isMobile) {
                  onRightCollapsedChange(true);
                } else {
                  onRightSidebarTabChange('telemetry');
                }
              }}
              className="h-7 w-7 rounded-full text-slate-500 hover:text-[#0552A2] hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center shrink-0"
              title={isMobile ? 'Close' : 'Dock back to side'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 scrollbar-thin">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className={`px-4 py-3.5 transition-colors hover:bg-slate-50 ${
                  notice.unread ? 'bg-blue-50/25' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[11px] font-semibold text-[#0552A2]">
                    {notice.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400">{notice.time}</span>
                    {notice.unread && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#0552A2]" />
                    )}
                  </div>
                </div>
                <h4 className="font-[family-name:var(--font-quicksand)] text-[13px] font-bold text-[#17212B] leading-snug">
                  {notice.title}
                </h4>
                <p className="text-xs text-[#4B5563] mt-1 leading-relaxed">
                  {notice.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (rightSidebarTab === 'chat') {
      return (
        <div className="flex flex-col flex-1 min-h-0 relative text-left w-full overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 py-2.5 flex items-center justify-between border-b border-slate-100 gap-2">
            <span className="font-[family-name:var(--font-quicksand)] text-sm font-bold text-[#17212B] truncate">
              {chatViewState === 'inbox' ? 'Messages' : 'Active Conversation'}
            </span>

            <div className="flex items-center gap-1 shrink-0">
              {!isMobile && (
                <button
                  onClick={() => {
                    const next = !isFullExpanded;
                    onRightCollapsedChange(false);
                    onIsFullExpandedChange(next);
                    if (next) onExpandedChannelIdChange(null);
                  }}
                  className={`h-7 w-7 rounded-full transition-colors cursor-pointer flex items-center justify-center ${(!rightCollapsed && isFullExpanded)
                    ? 'bg-[#0552A2] text-white'
                    : 'text-slate-500 hover:text-[#0552A2] hover:bg-slate-100'
                    }`}
                  title={isFullExpanded ? 'Dock to Side' : 'Expand'}
                >
                  {isFullExpanded ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="4 14 10 14 10 20" /><polyline points="20 10 14 10 14 4" />
                      <line x1="10" y1="14" x2="3" y2="21" /><line x1="21" y1="3" x2="14" y2="10" />
                    </svg>
                  ) : (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
                      <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
                    </svg>
                  )}
                </button>
              )}

              <button
                onClick={() => {
                  if (isFullExpanded) {
                    onIsFullExpandedChange(false);
                  } else if (isMobile) {
                    onRightCollapsedChange(true);
                  } else {
                    onRightSidebarTabChange('telemetry');
                  }
                }}
                className="h-7 w-7 rounded-full text-slate-500 hover:text-[#0552A2] hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                title={isMobile ? 'Close' : 'Dock back to side'}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>

          {/* Chat Inbox vs Conversation vs Multi-Column */}
          {isFullExpanded && !isMobile ? (
            <div className="flex-1 flex overflow-hidden">
              <div className="w-80 shrink-0 border-r border-slate-100 overflow-y-auto">
                <ChatsList
                  channels={channels}
                  activeChannelId={activeChannelId}
                  onSelectChannel={(id) => {
                    onActiveChannelIdChange(id);
                    onExpandedChannelIdChange(id);
                  }}
                  onExpandToggle={(id) => {
                    onExpandedChannelIdChange(expandedChannelId === id ? null : id);
                  }}
                />
              </div>
              <div className="flex-1 flex flex-col min-w-0 p-3">
                {renderSingleChatView(activeChannelObj, false)}
              </div>
            </div>
          ) : (
            chatViewState === 'inbox' ? (
              <div className="flex-1 overflow-y-auto">
                <ChatsList
                  channels={channels}
                  onSelectChannel={(id) => {
                    onActiveChannelIdChange(id);
                    onChatViewStateChange('conversation');
                  }}
                  onExpandToggle={(id) => {
                    onExpandedChannelIdChange(expandedChannelId === id ? null : id);
                  }}
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0 p-3">
                {renderSingleChatView(activeChannelObj, true)}
              </div>
            )
          )}
        </div>
      );
    }

    // Telemetry view
    return (
      <div className="flex flex-col flex-1 min-h-0 text-left overflow-y-auto bg-white">
        {isMobile && (
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 py-2.5 flex items-center justify-end border-b border-slate-100">
            <button
              onClick={() => onRightCollapsedChange(true)}
              className="p-1 rounded-lg text-slate-400 hover:text-[#0552A2] hover:bg-slate-50 transition-colors cursor-pointer"
              title="Close"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        <div className="divide-y divide-slate-100">
          {/* Weather */}
          <div className="px-4 py-3.5">
            <WeatherTelemetry rightCollapsed={false} weather={weather} />
          </div>

          {/* Geographic Locator Map */}
          <div className="px-4 py-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between w-full">
              <span className="font-[family-name:var(--font-quicksand)] text-xs font-bold text-[#17212B] whitespace-nowrap">
                Topographic Map
              </span>
              <span className="text-[11px] text-[#0552A2] font-semibold">
                27.7172° N, 85.3240° E
              </span>
            </div>

            <div className="h-36 w-full overflow-hidden relative bg-white">
              <NepalBackgroundMap isSidebar={true} theme="light" />
            </div>
          </div>

          {/* Co-Planner Hub */}
          <div className="px-4 py-3.5">
            <CoPlannerHub
              calendarMarks={calendarMarks}
              onCalendarMarksChange={onCalendarMarksChange}
              userNote={userNote}
              onUserNoteChange={onUserNoteChange}
              companyNote={companyNote}
              onCompanyNoteChange={onCompanyNoteChange}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* ── 1. DESKTOP COMPULSORY SIDEBAR (>= xl screens) ────────────────── */}
      <aside
        className="hidden xl:flex flex-col shrink-0 h-full select-none relative z-30 bg-white border-l border-slate-200 transition-all duration-300 overflow-hidden"
        style={{
          width: isFullExpanded
            ? `calc(100vw - ${collapsed ? '54px' : '204px'})`
            : (rightSidebarTab === 'chat' ? '380px' : rightSidebarTab === 'notices' ? '340px' : '310px'),
        }}
      >
        <div className="flex flex-col flex-1 min-h-0 text-left w-full">
          {renderContent(false)}
        </div>
      </aside>

      {/* ── 2. MOBILE & TABLET SLIDE-OVER DRAWER (< xl screens) ─────────── */}
      {!rightCollapsed && (
        <div className="xl:hidden fixed inset-0 z-50 flex justify-end">
          {/* Backdrop Overlay */}
          <div
            onClick={() => onRightCollapsedChange(true)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
            aria-hidden="true"
          />

          {/* Slide-over Drawer Panel */}
          <div className="relative w-full sm:w-[420px] max-w-full sm:max-w-[92vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              {renderContent(true)}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
