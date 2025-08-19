import * as React from 'react';
import { cn } from '@/lib/utils';

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <div className={cn("flex items-center", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 200"
        className="h-10 w-auto"
        {...props}
      >
        <rect
          x="40"
          y="40"
          width="70"
          height="120"
          rx="5"
          ry="5"
          stroke="#0b2a55"
          strokeWidth="3"
          fill="none"
        />
        <rect
          x="65"
          y="20"
          width="20"
          height="20"
          stroke="#41a642"
          strokeWidth="3"
          fill="none"
        />
        <circle cx="75" cy="30" r="2.5" fill="#41a642" />
        <circle
          cx="75"
          cy="80"
          r="12"
          stroke="#41a642"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M60,105 Q75,95 90,105"
          stroke="#41a642"
          strokeWidth="3"
          fill="none"
        />
        <line
          x1="60"
          y1="125"
          x2="90"
          y2="125"
          stroke="#41a642"
          strokeWidth="3"
        />
        <line
          x1="60"
          y1="140"
          x2="90"
          y2="140"
          stroke="#41a642"
          strokeWidth="3"
        />
        <text
          x="130"
          y="140"
          fontFamily="Arial, sans-serif"
          fontSize="72"
          fontWeight="bold"
          fill="#0b2a55"
        >
          contac
        </text>
        <text
          x="365"
          y="140"
          fontFamily="Arial, sans-serif"
          fontSize="72"
          fontWeight="bold"
          fill="#41a642"
        >
          TU
        </text>
      </svg>
    </div>
  );
}
