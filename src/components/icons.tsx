import type { SVGProps } from 'react';

export const Icons = {
  forklift: ({ ...props }: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 12H5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h2"/>
        <path d="M19 18v-6h-4"/>
        <path d="M21 18h-2"/>
        <path d="M10 12V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v7"/>
        <path d="M17 12V8"/>
        <path d="M5 12V9c0-1.1.9-2 2-2h2"/>
        <circle cx="7" cy="19" r="2"/>
        <circle cx="17" cy="19" r="2"/>
    </svg>
  ),
};
