import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4">
      <main className="text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-900">
          Auth CRUD
        </h1>
        <p className="mb-8 text-lg text-zinc-500">
          User authentication &amp; profile management with Prisma + PostgreSQL
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Sign up
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Log in
          </Link>
          <Link
            href="/profile"
            className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Profile
          </Link>
        </div>
      </main>
    </div>
  );
}
