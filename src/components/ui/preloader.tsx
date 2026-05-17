'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Preloader() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setLoading(false), 500);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[9999] flex items-center justify-center bg-background transition-opacity duration-500 ease-in-out',
        fadeOut ? 'opacity-0' : 'opacity-100'
      )}
    >
      <div className="relative flex flex-col items-center gap-6">
        <div className="relative h-24 w-48 animate-pulse">
          <Image
            src="/logofresh.png"
            alt="drive4mmm logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="h-1 w-32 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-full origin-left animate-[loading_1.5s_ease-in-out_infinite] bg-primary"></div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes loading {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.5); }
          100% { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
