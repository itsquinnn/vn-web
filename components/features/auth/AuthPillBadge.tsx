import React from 'react';
import { Sparkles } from '@/components/ui/Icons';

interface AuthPillBadgeProps {
  label: string;
}

export default function AuthPillBadge({ label }: AuthPillBadgeProps) {
  return (
    <div>
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2F8FD] border border-[#0552A2]/15 text-[10px] font-semibold text-[#0552A2] uppercase tracking-[0.14em] select-none">
        <Sparkles className="h-3 w-3" />
        <span>{label}</span>
      </div>
    </div>
  );
}
