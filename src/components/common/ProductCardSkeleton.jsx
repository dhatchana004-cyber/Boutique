import React from 'react';

export default function ProductCardSkeleton() {
  return (
    <div className="group flex flex-col animate-pulse">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#111111] border border-[#333333] mb-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <div className="w-16 h-5 bg-[#333333] rounded-sm"></div>
        </div>
        <div className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#333333]"></div>
      </div>
      <div className="flex flex-col px-1">
        <div className="w-3/4 h-5 bg-[#222222] mb-2 rounded-sm"></div>
        <div className="w-1/2 h-3 bg-[#222222] mb-3 rounded-sm"></div>
        <div className="w-1/3 h-4 bg-[#D4AF37]/30 rounded-sm"></div>
      </div>
    </div>
  );
}
