import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-soft">
        <h1 className="text-xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-2 text-sm text-slate-500">The page you requested does not exist.</p>
        <Link
          to="/login"
          className="mt-4 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}
