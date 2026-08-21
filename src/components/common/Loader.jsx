import { Loader2 } from 'lucide-react';

// Full page loader
export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
      <p className="text-sm text-slate-500">Loading...</p>
    </div>
  </div>
);

// Global overlay loader
export const GlobalLoader = () => (
  <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
      <p className="text-sm text-slate-600 font-medium">Please wait...</p>
    </div>
  </div>
);

// Inline/button loader
export const InlineLoader = ({ size = 'w-5 h-5', className = '' }) => (
  <Loader2 className={`${size} animate-spin ${className}`} />
);

// Skeleton loader for cards
export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 border border-slate-100 animate-pulse">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 bg-slate-200 rounded-xl" />
      <div className="flex-1">
        <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-slate-100 rounded w-full" />
      <div className="h-3 bg-slate-100 rounded w-5/6" />
    </div>
  </div>
);

export default PageLoader;
