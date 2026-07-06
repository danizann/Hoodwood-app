import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../auth';
import { api } from '../api';

interface DashboardResponse {
  role: string;
  stats: {
    totalOrders: number;
    totalTracking: number;
  };
}

const roleCopy = {
  admin: 'You have full access to operational and management features.',
  manager: 'You can manage business data and monitor shipping activity.',
  staff: 'You can monitor dashboard metrics and search shipment tracking.'
};

export function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    const response = await api.get<DashboardResponse>('/dashboard');
    setData(response.data);
    setLastUpdatedAt(new Date().toLocaleTimeString('id-ID'));
  }, []);

  useEffect(() => {
    fetchDashboard().catch(() => undefined);
    const intervalId = window.setInterval(() => {
      fetchDashboard().catch(() => undefined);
    }, 10_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [fetchDashboard]);

  if (!user) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Role-specific overview</p>
          <h2 className="mt-2 text-xl font-semibold capitalize">{user.role} dashboard</h2>
          <p className="mt-3 text-sm text-slate-300">{roleCopy[user.role]}</p>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">System summary</p>
          <p className="mt-1 text-xs text-slate-500">
            {lastUpdatedAt ? `Realtime update • ${lastUpdatedAt}` : 'Mengambil data terbaru...'}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-800/70 p-4">
              <div className="text-sm text-slate-400">Orders</div>
              <div className="mt-2 text-2xl font-semibold">{data?.stats.totalOrders ?? '—'}</div>
            </div>
            <div className="rounded-2xl bg-slate-800/70 p-4">
              <div className="text-sm text-slate-400">Tracking</div>
              <div className="mt-2 text-2xl font-semibold">{data?.stats.totalTracking ?? '—'}</div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
