export function AdminLoginLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect x="24" y="8" width="8" height="40" rx="2" fill="currentColor" />
      <rect x="8" y="16" width="40" height="6" rx="2" fill="currentColor" />
      <circle cx="8" cy="19" r="4" fill="currentColor" />
      <circle cx="48" cy="19" r="4" fill="currentColor" />
      <rect x="8" y="34" width="40" height="6" rx="2" fill="currentColor" />
      <circle cx="8" cy="37" r="4" fill="currentColor" />
      <circle cx="48" cy="37" r="4" fill="currentColor" />
    </svg>
  );
}
