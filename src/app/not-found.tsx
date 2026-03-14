import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-navy px-4">
      <h1 className="text-6xl font-bold text-gold">404</h1>
      <p className="mt-4 text-xl text-gray-400">Page not found</p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-gold px-6 py-3 font-medium text-navy transition-colors hover:bg-gold-light"
      >
        Back to Home
      </Link>
    </main>
  );
}
