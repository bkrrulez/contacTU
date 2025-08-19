import * as React from 'react';
import { cn } from '@/lib/utils';

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <div className={cn("flex items-center", className)}>
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 450 150"
      className="h-10 w-auto"
      {...props}
    >
      <g transform="scale(1.15)">
        <rect x="40" y="40" width="70" height="100" rx="5" ry="5" 
              stroke="#0b2a55" strokeWidth="3" fill="none"/>
        
        <rect x="65" y="25" width="20" height="20" stroke="#41a642" strokeWidth="3" fill="none"/>
        <circle cx="75" cy="35" r="2.5" fill="#41a642"/>
        
        <circle cx="75" cy="70" r="12" stroke="#41a642" strokeWidth="3" fill="none"/>
        <path d="M60,95 Q75,85 90,95" stroke="#41a642" strokeWidth="3" fill="none"/>
        
        <line x1="60" y1="115" x2="90" y2="115" stroke="#41a642" strokeWidth="3"/>
        <line x1="60" y1="130" x2="90" y2="130" stroke="#41a642" strokeWidth="3"/>
      </g>
      
      <text x="160" y="118" fontFamily="Arial, sans-serif" fontSize="80" fontWeight="bold" fill="#0b2a55">
        contac
      </text>
      
      <text x="340" y="118" fontFamily="Arial, sans-serif" fontSize="80" fontWeight="bold" fill="#41a642">
        TU
      </text>
    </svg>
    </div>
  );
}
