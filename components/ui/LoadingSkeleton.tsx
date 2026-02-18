'use client'

export default function LoadingSkeleton() {
  return (
    <div className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-2xl p-6 space-y-4 animate-pulse">
      <div className="flex gap-4">
        <div className="shimmer h-8 w-32 rounded-full" />
        <div className="shimmer h-8 w-20 rounded-full ml-auto" />
      </div>
      <div className="shimmer h-4 w-full rounded-lg" />
      <div className="shimmer h-4 w-4/5 rounded-lg" />
      <div className="shimmer h-4 w-3/5 rounded-lg" />
      <div className="border-t border-[#1e4a2e] pt-4">
        <div className="shimmer h-3 w-24 rounded mb-3" />
        <div className="shimmer h-16 rounded-xl" />
      </div>
      <div>
        <div className="shimmer h-3 w-28 rounded mb-3" />
        <div className="shimmer h-16 rounded-xl" />
      </div>
    </div>
  )
}
