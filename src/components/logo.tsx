import * as React from 'react';

export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 2H8C6.34 2 5 3.34 5 5v14c0 1.66 1.34 3 3 3h8c1.66 0 3-1.34 3-3V5c0-1.66-1.34-2-3-2z" />
      <path d="M9 7h6" />
      <path d="M9 11h6" />
      <path d="M9 15h4" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2" />
      <path d="M11 4h2" />
    </svg>
  );
}
