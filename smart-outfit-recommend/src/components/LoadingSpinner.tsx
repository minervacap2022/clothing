import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
        <div className="absolute inset-0 w-12 h-12 border-4 border-orange-200 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};