// React Bits — ShinyText (https://reactbits.dev/text-animations/shiny-text)
// Adapted: the sweep is a CSS animation instead of a per-frame JS loop, so it costs
// no main-thread time and the component can stay a Server Component.

const ShinyText = ({
  text,
  disabled = false,
  speed = 5,
  className = '',
  color = '#b5b5b5',
  shineColor = '#ffffff',
  spread = 120,
}) => (
  <span
    className={`inline-block ${disabled ? '' : 'animate-shine'} ${className}`}
    style={{
      backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
      backgroundSize: '200% auto',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      animationDuration: `${speed}s`,
    }}
  >
    {text}
  </span>
);

export default ShinyText;
