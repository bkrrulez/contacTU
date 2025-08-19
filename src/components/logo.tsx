import * as React from 'react';
import { cn } from '@/lib/utils';

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8"
            {...props}
            >
            <path stroke="#0D47A1" d="M15.5 2.5h-8A2 2 0 0 0 5.5 4.5v15a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-15a2 2 0 0 0-2-2z" />
            <path stroke="#0D47A1" d="M13.5 6.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
            <path stroke="#66BB6A" d="M12.5 2.5h-2a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1z" />
            <path stroke="#0D47A1" d="M16.5 12.5h-10" />
            <path stroke="#66BB6A" d="M16.5 15.5h-10" />
            <path stroke="#0D47A1" d="M14.5 10.5c0 1.66-1.12 3-2.5 3s-2.5-1.34-2.5-3" />

        </svg>
      <span className="text-2xl font-bold tracking-tight" style={{ color: '#0D47A1' }}>
        contac<span style={{ color: '#66BB6A' }}>TU</span>
      </span>
    </div>
  );
}
