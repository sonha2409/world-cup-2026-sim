export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-navy">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-gold" />
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    </main>
  );
}
