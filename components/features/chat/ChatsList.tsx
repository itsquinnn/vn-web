'use client';

import React from 'react';
import { ChatChannel } from '@/store/useTravelStore';

export type Channel = ChatChannel;

export interface ChatsListProps {
  channels: ChatChannel[];
  activeChannelId?: string;
  onActiveChannelIdChange?: (id: string) => void;
  onChatViewStateChange?: (state: 'inbox' | 'conversation') => void;
  onSelectChannel?: (id: string) => void;
  onExpandToggle?: (id: string) => void;
}

export default function ChatsList({
  channels,
  activeChannelId,
  onActiveChannelIdChange,
  onChatViewStateChange,
  onSelectChannel,
  onExpandToggle,
}: ChatsListProps) {
  return (
    <div className="flex-1 overflow-y-auto flex flex-col min-h-0 scrollbar-thin">
      <div className="flex flex-col divide-y divide-slate-100">
        {channels.map((chan) => {
          const lastMsg = chan.messages[chan.messages.length - 1];
          const isAi = chan.id === 'ch-ai';
          const isMeLast = lastMsg?.sender === 'user';
          const isSelected = activeChannelId === chan.id;

          return (
            <button
              key={chan.id}
              onClick={() => {
                if (onSelectChannel) {
                  onSelectChannel(chan.id);
                } else if (onActiveChannelIdChange) {
                  onActiveChannelIdChange(chan.id);
                }
                if (onChatViewStateChange) {
                  onChatViewStateChange('conversation');
                }
              }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors duration-150 text-left cursor-pointer group ${
                isSelected
                  ? 'bg-slate-100/90'
                  : 'hover:bg-slate-50 active:bg-slate-100/80'
              }`}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={chan.avatar}
                  alt={chan.name}
                  className="h-10 w-10 rounded-full object-cover border border-slate-200/80"
                />
                <span
                  className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${
                    isAi ? 'bg-[#0552A2]' : 'bg-emerald-500'
                  }`}
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className={`font-[family-name:var(--font-quicksand)] text-[13px] font-bold truncate leading-tight transition-colors ${
                      isSelected
                        ? 'text-[#0552A2]'
                        : 'text-[#17212B] group-hover:text-[#0552A2]'
                    }`}
                  >
                    {chan.name}
                  </h4>
                  <span
                    className={`text-[11px] shrink-0 ${
                      chan.unread ? 'font-semibold text-[#0552A2]' : 'text-slate-400'
                    }`}
                  >
                    {lastMsg ? lastMsg.timestamp : '12:45 PM'}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 mt-1">
                  <p
                    className={`text-xs truncate leading-snug flex-1 ${
                      chan.unread ? 'font-medium text-[#17212B]' : 'text-slate-500'
                    }`}
                  >
                    {lastMsg ? (
                      isMeLast
                        ? `You: ${lastMsg.isVoice ? 'Voice note' : lastMsg.text}`
                        : lastMsg.text
                    ) : (
                      <span className="italic opacity-60">No messages yet</span>
                    )}
                  </p>
                  {chan.unread && (
                    <span className="h-2 w-2 rounded-full bg-[#0552A2] shrink-0" />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
