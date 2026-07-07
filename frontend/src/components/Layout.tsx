import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth, type Role } from '../auth';

const trackingExternalUrl = 'https://cekresi.com/';

type MenuItem = {
  label: string;
  to?: string;
  href?: string;
  children?: Array<{ label: string; to: string }>;
};

const menuByRole: Record<Role, MenuItem[]> = {
  admin: [
    { to: '/', label: 'Dashboard' },
    { href: trackingExternalUrl, label: 'Tracking' },
    {
      label: 'Suppliers',
      children: [
        { to: '/suppliers', label: 'Maintain Supplier' },
        { to: '/suppliers/account/new', label: 'Add Supplier Account' }
      ]
    },
    { to: '/sellers', label: 'Sellers' },
    { to: '/products', label: 'Products' },
    { to: '/invoices', label: 'Invoices' }
  ],
  manager: [
    { to: '/', label: 'Dashboard' },
    { href: trackingExternalUrl, label: 'Tracking' },
    {
      label: 'Suppliers',
      children: [
        { to: '/suppliers', label: 'Maintain Supplier' },
        { to: '/suppliers/account/new', label: 'Add Supplier Account' }
      ]
    },
    { to: '/sellers', label: 'Sellers' },
    { to: '/products', label: 'Products' },
    { to: '/invoices', label: 'Invoices' }
  ],
  staff: [
    { to: '/', label: 'Dashboard' },
    { href: trackingExternalUrl, label: 'Tracking' }
  ]
};

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const items = menuByRole[user.role];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row">
        <aside className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-5 lg:w-72">
          <Link to="/" className="text-xl font-semibold text-white">
            Hoodwood Admin
          </Link>
          <p className="mt-2 text-sm text-slate-400">Warehouse dashboard with authentication, tracking, and role-based access.</p>
          <nav className="mt-6 space-y-2">
            {items.map((item) =>
              item.href ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl bg-slate-800/60 px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-800"
                >
                  {item.label}
                </a>
              ) : item.children ? (
                <div key={item.label} className="space-y-1 rounded-xl bg-slate-800/40 px-3 py-2">
                  <div className="px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{item.label}</div>
                  {item.children.map((child) => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      className={({ isActive }) =>
                        `block rounded-lg px-3 py-2 text-sm transition ${
                          isActive ? 'bg-emerald-500 text-slate-950' : 'text-slate-200 hover:bg-slate-800'
                        }`
                      }
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to!}
                  className={({ isActive }) =>
                    `block rounded-xl px-4 py-3 text-sm transition ${isActive ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800/60 text-slate-200 hover:bg-slate-800'}`
                  }
                >
                  {item.label}
                </NavLink>
              )
            )}
          </nav>
        </aside>

        <main className="flex-1">
          <header className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-400">Signed in as</p>
              <h1 className="text-2xl font-semibold">{user.name}</h1>
              <p className="text-sm text-slate-400">{user.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-300">
                Role: {user.role}
              </span>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/login', { replace: true });
                }}
                className="rounded-xl border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800"
              >
                Logout
              </button>
            </div>
          </header>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
