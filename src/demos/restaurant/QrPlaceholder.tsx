/**
 * QrPlaceholder — a decorative, QR-style SVG. Not actually scannable (the brief
 * was "concept only"), but built to *look* like a real code: finder squares in
 * three corners, a deterministic data-module pattern per table so each code
 * looks different, and a logo cutout in the centre. Pure SVG, no library.
 */
export function QrPlaceholder({ seed = 1, size = 132 }: { seed?: number; size?: number }) {
  const cells = 21 // a typical QR v1 is 21×21 modules
  // Deterministic pseudo-random fill so each table's code looks distinct.
  const filled = (x: number, y: number) => {
    const v = (seed * 73 + x * 17 + y * 31 + ((x * y) % 13)) % 7
    return v < 3
  }
  const unit = size / cells
  const finder = (cx: number, cy: number) => (
    <>
      <rect x={cx * unit} y={cy * unit} width={7 * unit} height={7 * unit} fill="var(--rd-ink)" />
      <rect x={(cx + 1) * unit} y={(cy + 1) * unit} width={5 * unit} height={5 * unit} fill="var(--rd-paper)" />
      <rect x={(cx + 2) * unit} y={(cy + 2) * unit} width={3 * unit} height={3 * unit} fill="var(--rd-ink)" />
    </>
  )

  const squares = []
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      // skip finder + separator regions
      const inFinder =
        (x < 8 && y < 8) || (x > cells - 9 && y < 8) || (x < 8 && y > cells - 9)
      if (inFinder) continue
      if (filled(x, y)) {
        squares.push(
          <rect
            key={`${x}-${y}`}
            x={x * unit}
            y={y * unit}
            width={unit}
            height={unit}
            fill="var(--rd-ink)"
          />,
        )
      }
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="QR code (concept)"
      style={{ display: 'block' }}
    >
      <rect width={size} height={size} fill="var(--rd-paper)" />
      {squares}
      {finder(0, 0)}
      {finder(cells - 7, 0)}
      {finder(0, cells - 7)}
      {/* centre logo cutout */}
      <rect
        x={size / 2 - 3 * unit}
        y={size / 2 - 3 * unit}
        width={6 * unit}
        height={6 * unit}
        fill="var(--rd-paper)"
      />
      <rect
        x={size / 2 - 2 * unit}
        y={size / 2 - 2 * unit}
        width={4 * unit}
        height={4 * unit}
        fill="var(--rd-clay)"
      />
    </svg>
  )
}