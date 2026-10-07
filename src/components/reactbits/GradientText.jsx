// React Bits — GradientText (https://reactbits.dev/text-animations/gradient-text)
// Adapted: CSS-driven gradient animation (no JS loop), inline so it can sit inside headings.

export default function GradientText({
  children,
  className = '',
  colors = ['#b8115a', '#ef3f80', '#c59d3f', '#b8115a'],
  animationSpeed = 8,
}) {
  return (
    <span
      className={`animate-gradient inline-block bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`,
        backgroundSize: '300% 100%',
        WebkitBackgroundClip: 'text',
        animationDuration: `${animationSpeed}s`,
      }}
    >
      {children}
    </span>
  );
}
