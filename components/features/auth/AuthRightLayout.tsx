import React from 'react';
import Image from 'next/image';
import NepalBackgroundMap from '@/components/features/chat/NepalBackgroundMap';

interface AuthRightLayoutProps {
  children: React.ReactNode;
}

export default function AuthRightLayout({ children }: AuthRightLayoutProps) {
  return (
    <div className="flex-1 h-full overflow-y-auto bg-white relative z-10">
      {/* Mobile Background Map (drawn inside behind form) */}
      <div className="absolute inset-0 z-0 lg:hidden block overflow-hidden">
        <Image
          src="/pictures/everest_(1)-1624869402.jpg"
          fill
          unoptimized
          loading="lazy"
          decoding="async"
          sizes="100vw"
          className="object-cover opacity-12 mix-blend-luminosity pointer-events-none select-none"
          alt=""
        />
        <div className="absolute inset-0 bg-white/92 pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none scale-105">
          <NepalBackgroundMap isSidebar={false} theme="light" />
        </div>
      </div>

      {/* Center Wrapper preventing height cutoffs */}
      <div className="min-h-full w-full flex items-center justify-center px-6 sm:px-16 lg:px-20 py-12 lg:py-16">
        <div className="max-w-[440px] w-full flex flex-col gap-6 relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
