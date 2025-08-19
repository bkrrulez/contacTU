import * as React from 'react';
import { cn } from '@/lib/utils';

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <div className={cn("flex items-center", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 100"
        className="h-10 w-auto"
        {...props}
      >
        <g transform="translate(10, 10)">
          {/* Icon */}
          <g fill="#757575">
            <path d="M56.25,3.75H43.75a7.5,7.5,0,0,0-7.5,7.5v60a7.5,7.5,0,0,0,7.5,7.5h22.5a7.5,7.5,0,0,0,7.5-7.5v-60A7.5,7.5,0,0,0,66.25,3.75H56.25Z" fill="#e0e0e0" stroke="#757575" strokeWidth="2.5" />
            <path d="M60,3.75H50a2.5,2.5,0,0,0-2.5,2.5V10a2.5,2.5,0,0,0,2.5,2.5H60a2.5,2.5,0,0,0,2.5-2.5V6.25A2.5,2.5,0,0,0,60,3.75Z" fill="#bdbdbd" stroke="#757575" strokeWidth="2.5" />
            
            <g transform="translate(39, 25)">
              <rect width="32" height="32" rx="3" ry="3" fill="#fafafa" stroke="#757575" strokeWidth="2.5" />
              {/* Person Icon */}
              <circle cx="16" cy="13" r="5" fill="none" stroke="#757575" strokeWidth="2.5"/>
              <path d="M10,24 q6,-8 12,0" fill="none" stroke="#757575" strokeWidth="2.5"/>
            </g>
          </g>

          {/* Text */}
          <text x="110" y="68" fontFamily="Arial, sans-serif" fontSize="72" fontWeight="bold" fill="#555555">
            contac
          </text>
          <text x="330" y="68" fontFamily="Arial, sans-serif" fontSize="72" fontWeight="bold" fill="#0077c8">
            TU
          </text>
        </g>
      </svg>
    </div>
  );
}
