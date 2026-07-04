import { Link } from "react-router-dom";

// createcv logo: layered "file stack" mark with a big AI sparkle (concept A) +
// two-tone Futura wordmark.
export function LogoMark({ className = "" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect x="7" y="8" width="16" height="20" rx="3" fill="#2563EB" opacity="0.22" transform="translate(5 -5)" />
      <rect x="7" y="8" width="16" height="20" rx="3" fill="#2563EB" opacity="0.45" transform="translate(2.5 -2.5)" />
      <rect x="7" y="8" width="16" height="20" rx="3" fill="#2563EB" />
      <rect x="10" y="22" width="9" height="1.6" rx="0.8" fill="#fff" opacity="0.85" />
      <rect x="10" y="24.6" width="6" height="1.6" rx="0.8" fill="#fff" opacity="0.85" />
      <path d="M14 9 C14 13.92 15.08 15 20 15 C15.08 15 14 16.08 14 21 C14 16.08 12.92 15 8 15 C12.92 15 14 13.92 14 9 Z" fill="#fff" />
      <path d="M21 6.4 C21 8.53 21.47 9 23.6 9 C21.47 9 21 9.47 21 11.6 C21 9.47 20.53 9 18.4 9 C20.53 9 21 8.53 21 6.4 Z" fill="#fff" />
    </svg>
  );
}

export default function Logo({ className = "" }) {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2 ${className}`}
      aria-label="createcv home"
    >
      <LogoMark className="h-8 w-8" />
      <span className="font-logo text-[22px] font-medium tracking-tight">
        <span className="text-dark">create</span>
        <span className="text-primary">cv</span>
      </span>
    </Link>
  );
}
