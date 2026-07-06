import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('admin@hoodwood.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const destination = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/';

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl shadow-slate-950/40">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Hoodwood Warehouse</p>
        <h1 className="mt-3 text-3xl font-semibold">Login Admin App</h1>
        <p className="mt-2 text-sm text-slate-400">Masuk dengan email dan password untuk mengakses dashboard berdasarkan role.</p>

        <form
          className="mt-8 space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setLoading(true);
            setError(null);
            try {
              await login(email, password);
              navigate(destination, { replace: true });
            } catch {
              setError('Email atau password tidak valid.');
            } finally {
              setLoading(false);
            }
          }}
        >
          <label className="block space-y-2">
            <span className="text-sm text-slate-300">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none ring-0 placeholder:text-slate-500 focus:border-emerald-400"
              placeholder="admin@hoodwood.com"
              required
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm text-slate-300">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-500 focus:border-emerald-400"
              placeholder="******"
              required
            />
          </label>
          {error ? <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-400">
          <p className="font-medium text-slate-200">Demo credentials</p>
          <ul className="mt-2 space-y-1">
            <li>Admin: admin@hoodwood.com / admin123</li>
            <li>Manager: manager@hoodwood.com / manager123</li>
            <li>Staff: staff@hoodwood.com / staff123</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
