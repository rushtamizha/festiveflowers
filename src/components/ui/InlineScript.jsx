// A script that runs while the HTML is parsed (before first paint) on full page loads.
// On the client it renders as text/plain, so React never warns about creating a <script>
// (e.g. when an error boundary re-renders the layout) and it is not run twice.
// Pattern from node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md
export default function InlineScript({ html }) {
  return (
    <script
      type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
