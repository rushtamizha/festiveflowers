import { formatPrice } from '@/lib/format';

// Renders text that may contain the rupee sign, drawing each sign with a system font
// (see `.rupee` in globals.css). Use <Price value={499} /> for amounts and <Rupees> for labels.
export default function Rupees({ children }) {
  const text = String(children ?? '');
  if (!text.includes('₹')) return text;
  // One wrapping element, so the text stays a single item inside flex layouts.
  return (
    <span>
      {text.split('₹').map((part, index) => (
        <span key={index}>
          {index > 0 && <span className="rupee">₹</span>}
          {part}
        </span>
      ))}
    </span>
  );
}

export function Price({ value }) {
  return <Rupees>{formatPrice(value)}</Rupees>;
}
