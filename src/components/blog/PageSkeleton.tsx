const PageSkeleton = () => (
  <div
    className="min-h-screen bg-background"
    aria-busy="true"
    aria-live="polite"
  >
    <div className="max-w-6xl mx-auto px-6 py-12 animate-pulse">
      <div className="h-8 w-48 rounded bg-muted mb-8" />
      <div className="h-4 w-full max-w-3xl rounded bg-muted mb-3" />
      <div className="h-4 w-5/6 max-w-3xl rounded bg-muted" />
    </div>
    <span className="sr-only">Loading…</span>
  </div>
);

export default PageSkeleton;
