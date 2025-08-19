import * as React from 'react';
import { cn } from '@/lib/utils';

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
        <svg
            width="150"
            height="150"
            viewBox="0 0 150 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-auto"
            {...props}
        >
            <circle cx="75" cy="75" r="72.5" stroke="#3B82F6" strokeOpacity="0.5" strokeWidth="3"/>
            <path d="M57.6942 56.6364C57.6942 51.5545 60.1074 47.5 64.124 47.5H85.876C89.8926 47.5 92.3058 51.5545 92.3058 56.6364V69.5H57.6942V56.6364Z" fill="#2563EB" fillOpacity="0.8"/>
            <path d="M92.3058 56.6364C92.3058 51.5545 89.8926 47.5 85.876 47.5H64.124C60.1074 47.5 57.6942 51.5545 57.6942 56.6364L43.5 70V82.5H69.5372L75.6198 76.8182L81.7025 82.5H106.5V70L92.3058 56.6364Z" fill="#3B82F6" fillOpacity="0.7"/>
            <path d="M64.6281 69.5H85.3719V60.2273H64.6281V69.5Z" fill="white"/>
            <path d="M69.8347 55.4545H80.1653V47.5H69.8347V55.4545Z" fill="white"/>
            <text fill="#3B82F6" style={{ "whiteSpace": "pre" }} fontFamily="Inter" fontSize="16" fontWeight="bold" letterSpacing="0em">
                <tspan x="30" y="105">contact</tspan>
            </text>
            <text fill="#2563EB" style={{ "whiteSpace": "pre" }} fontFamily="Inter" fontSize="16" fontWeight="bold" letterSpacing="0em">
                <tspan x="88" y="105">TU</tspan>
            </text>
        </svg>
    </div>
  );
}
