import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface AuthBackButtonProps {
  label: string;
  onClick: () => void;
}

export default function AuthBackButton({ label, onClick }: AuthBackButtonProps) {
  return (
    <div className="absolute top-6 right-6 z-30">
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-[#F8FBFF] border border-zinc-200/90 text-xs font-semibold text-[#4B5563] hover:text-[#0552A2] hover:border-[#0552A2]/30 transition-all shadow-xs cursor-pointer"
      >
        <ArrowLeft className="h-3.5 w-3.5 text-[#0552A2]" />
        <span>{label}</span>
      </button>
    </div>
  );
}
