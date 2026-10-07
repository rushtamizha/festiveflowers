// React Bits — StarBorder (https://reactbits.dev/animations/star-border)
// Keyframes live in globals.css (@theme). No hooks, so this stays a Server Component.

const StarBorder = ({
  as: Component = 'button',
  className = '',
  innerClassName = '',
  color = 'white',
  speed = '6s',
  thickness = 1,
  children,
  style,
  ...rest
}) => {
  return (
    <Component
      className={`relative inline-block overflow-hidden rounded-full ${className}`}
      style={{ padding: `${thickness}px 0`, ...style }}
      {...rest}
    >
      <span
        className="animate-star-movement-bottom absolute right-[-250%] bottom-[-11px] z-0 block h-[50%] w-[300%] rounded-full opacity-70"
        style={{ background: `radial-gradient(circle, ${color}, transparent 10%)`, animationDuration: speed }}
      />
      <span
        className="animate-star-movement-top absolute top-[-10px] left-[-250%] z-0 block h-[50%] w-[300%] rounded-full opacity-70"
        style={{ background: `radial-gradient(circle, ${color}, transparent 10%)`, animationDuration: speed }}
      />
      <span className={`relative z-1 flex items-center justify-center gap-2 rounded-full border px-7 py-3.5 text-center ${innerClassName}`}>
        {children}
      </span>
    </Component>
  );
};

export default StarBorder;
