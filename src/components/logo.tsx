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
            <rect x="36.25" y="3.75" width="45" height="75" rx="7.5" ry="7.5" className="text-gray-400" fill="currentColor"/>
            <rect x="45" y="15" width="28" height="20" rx="3" ry="3" className="text-white" fill="currentColor" />
            <line x1="45" y1="45" x2="73" y2="45" className="text-gray-300" stroke="currentColor" />
            <line x1="45" y1="55" x2="73" y2="55" className="text-gray-300" stroke="currentColor" />
          </g>

          {/* Text */}
          <text x="85" y="68" fontFamily="Arial, sans-serif" fontSize="72" fontWeight="bold" className="fill-gray-600">
            contac
          </text>
          <text x="310" y="68" fontFamily="Arial, sans-serif" fontSize="72" fontWeight="bold" className="fill-blue-600">
            TU
          </text>
        </g>
      </svg>
    </div>
  );
}
