import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-28 text-center">
      <h1 className="font-serif text-5xl text-maroon">404</h1>
      <p className="mt-3 text-ink/60 font-sans">
        We couldn&apos;t find what you were looking for.
      </p>
      <Link href="/" className="mt-6 inline-block bg-maroon text-cream px-6 py-3 rounded-full text-sm font-sans">
        Back to Home
      </Link>
    </div>
  );
}
