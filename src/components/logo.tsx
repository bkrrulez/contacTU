import * as React from 'react';
import { cn } from '@/lib/utils';

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <div className={cn("flex items-center", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 470 100"
        className="h-10 w-auto"
        {...props}
      >
        <g transform="translate(10, 10)">
          {/* Icon: Simple ID Card */}
          <g fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="30" y="0" width="60" height="80" rx="6" ry="6" className="text-gray-400" stroke="currentColor" fill="none"/>
            <circle cx="60" cy="25" r="10" className="text-gray-300" stroke="currentColor"/>
            <line x1="45" y1="48" x2="75" y2="48" className="text-gray-300" stroke="currentColor" />
            <line x1="45" y1="60" x2="75" y2="60" className="text-gray-300" stroke="currentColor" />
          </g>

          {/* Text */}
          <text x="95" y="68" fontFamily="Arial, sans-serif" fontSize="72" fontWeight="bold" className="fill-gray-600">
            contac
          </text>
          <text x="320" y="68" fontFamily="Arial, sans-serif" fontSize="72" fontWeight="bold" className="fill-blue-600">
            TU
          </text>
        </g>
      </svg>
    </div>
  );
}