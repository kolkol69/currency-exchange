import * as React from "react"

export const ConfettiBurst = ({
  burstKey,
  count = 20,
}: {
  burstKey: number
  count?: number
}) => {
  const pieces = React.useMemo(() => {
    const result: Array<{
      dx: number
      dy: number
      size: number
      rot: number
      hue: number
      delay: number
    }> = []
    const distance = 150
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const spread = (Math.random() - 0.5) * 0.6
      const finalAngle = angle + spread
      const radius = distance * (0.8 + Math.random() * 0.4)
      const dx = Math.cos(finalAngle) * radius
      const dy = Math.sin(finalAngle) * radius * -1
      const size = 6 + Math.floor(Math.random() * 8)
      const rot = Math.floor(Math.random() * 360)
      const hue = Math.floor(Math.random() * 360)
      result.push({ dx, dy, size, rot, hue, delay: Math.random() * 60 })
    }
    return result
  }, [burstKey, count])

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible">
      <div className="relative">
        {pieces.map((p, idx) => (
          <span
            key={`${burstKey}-${idx}`}
            className="confetti-piece"
            style={
              {
                "--dx": `${p.dx}px`,
                "--dy": `${p.dy}px`,
                "--rot": `${p.rot}deg`,
                "--hue": `${p.hue}`,
                "--size": `${p.size}px`,
                animationDelay: `${p.delay}ms`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  )
}

export default ConfettiBurst
