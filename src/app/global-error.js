'use client';

// Last-resort boundary: replaces the root layout if it fails, so it carries its own styles.
export default function GlobalError({ reset }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          display: 'grid',
          placeItems: 'center',
          fontFamily: 'system-ui, sans-serif',
          color: '#0b0b0c',
          textAlign: 'center',
          padding: 24,
        }}
      >
        <div>
          <h1 style={{ fontSize: 28, letterSpacing: '-0.03em', margin: 0 }}>Something went wrong</h1>
          <p style={{ color: '#6f6f6f', margin: '8px 0 24px' }}>Please try again. Your cart is saved on this device.</p>
          <button
            type="button"
            onClick={reset}
            style={{ height: 48, padding: '0 28px', borderRadius: 999, border: 0, background: '#d81b66', color: '#fff', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
