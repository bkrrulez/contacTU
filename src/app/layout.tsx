import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'contacTU',
  description: 'Your contact book in the cloud.',
  icons: {
    icon: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <g transform="translate(10, 10)">
          <rect x="30" y="0" width="60" height="80" rx="6" ry="6" fill="none" stroke="#000000" stroke-width="5"/>
          <circle cx="60" cy="25" r="10" stroke="#000000" stroke-width="5" fill="none" />
          <line x1="45" y1="48" x2="75" y2="48" stroke="#000000" stroke-width="5" />
          <line x1="45" y1="60" x2="75" y2="60" stroke="#000000" stroke-width="5" />
        </g>
      </svg>
    `)}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
