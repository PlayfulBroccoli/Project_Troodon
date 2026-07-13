/**
 * Fixed faint grid overlay behind all content — mirrors the reference site.
 * Sits at z-0; page content lives above it at z-10.
 */
export function GridBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-50">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d1d5db" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  )
}
