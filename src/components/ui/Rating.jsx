// Star rating: a masked bar (grey) with a gold bar on top whose width is the score.
export default function Rating({ value, count, size = 14, className = '' }) {
  const percent = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span role="img" aria-label={`Rated ${value} out of 5`} className="stars text-ink-200" style={{ fontSize: size }}>
        <span style={{ width: `${percent}%` }} />
      </span>
      <span className="text-[13px] text-ink-500">
        <strong className="font-bold text-ink">{value.toFixed(1)}</strong>
        {count != null && <span> · {count} reviews</span>}
      </span>
    </div>
  );
}
