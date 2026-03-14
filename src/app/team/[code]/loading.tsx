export default function TeamLoading() {
  return (
    <main className="min-h-screen bg-navy px-4 py-8">
      <div className="mx-auto max-w-5xl animate-pulse">
        <div className="mb-6 h-4 w-24 rounded bg-white/10" />
        <div className="mb-6 flex items-center gap-3">
          <div className="h-10 w-10 rounded bg-white/10" />
          <div>
            <div className="h-8 w-48 rounded bg-white/10" />
            <div className="mt-2 h-4 w-24 rounded bg-white/10" />
          </div>
        </div>
        <div className="mb-6">
          <div className="h-6 w-32 rounded bg-white/10" />
          <div className="mt-3 flex gap-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-16 rounded-md bg-white/10" />
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-navy-light p-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="mb-3 h-10 rounded bg-white/5" />
          ))}
        </div>
      </div>
    </main>
  );
}
