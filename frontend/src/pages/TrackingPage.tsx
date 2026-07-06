import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';

type TrackingStatus = 'Pending' | 'In Transit' | 'Delivered';

interface TrackingRecord {
  resiNumber: string;
  status: TrackingStatus;
  sender: string;
  recipient: string;
  createdAt: string;
  updatedAt: string;
}

interface TrackingResponse {
  data: TrackingRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const HISTORY_KEY = 'hoodwood_tracking_history';

const badgeClass: Record<TrackingStatus, string> = {
  Pending: 'bg-amber-400/10 text-amber-300 border-amber-400/40',
  'In Transit': 'bg-sky-400/10 text-sky-300 border-sky-400/40',
  Delivered: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/40'
};

export function TrackingPage() {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'createdAt' | 'status' | 'resiNumber'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [data, setData] = useState<TrackingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      setHistory(JSON.parse(stored) as string[]);
    }
  }, []);

  useEffect(() => {
    api
      .get<TrackingResponse>('/tracking/search', {
        params: { resi: query, page, pageSize: 5, sortBy, sortOrder }
      })
      .then((response) => {
        setData(response.data);
        setError(null);
      })
      .catch((requestError) => {
        setData(null);
        setError(requestError.response?.data?.issues?.[0] ?? 'Tracking search gagal diproses.');
      });
  }, [page, query, sortBy, sortOrder]);

  const totalLabel = useMemo(() => {
    if (!data) {
      return 'No data';
    }
    return `${data.total} result(s)`;
  }, [data]);

  const persistHistory = (value: string) => {
    if (!value) {
      return;
    }
    const next = [value, ...history.filter((item) => item !== value)].slice(0, 5);
    setHistory(next);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <label className="flex-1 space-y-2">
            <span className="text-sm text-slate-300">Search resi</span>
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value.toUpperCase());
                setPage(1);
              }}
              placeholder="HW1001A"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-500 focus:border-emerald-400"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-slate-300">Sort by</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as 'createdAt' | 'status' | 'resiNumber')}
              className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
            >
              <option value="createdAt">Created at</option>
              <option value="status">Status</option>
              <option value="resiNumber">Resi</option>
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm text-slate-300">Order</span>
            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value as 'asc' | 'desc')}
              className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => persistHistory(query)}
            className="rounded-2xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950 hover:bg-emerald-300"
          >
            Save search
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {history.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setQuery(item);
                setPage(1);
              }}
              className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-emerald-400 hover:text-emerald-300"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Tracking Results</h2>
            <p className="text-sm text-slate-400">{totalLabel}</p>
          </div>
        </div>

        {error ? <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="pb-3">Resi</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Sender</th>
                <th className="pb-3">Recipient</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {data?.data.map((item) => (
                <tr key={item.resiNumber}>
                  <td className="py-3 font-medium text-white">{item.resiNumber}</td>
                  <td className="py-3">
                    <span className={`rounded-full border px-3 py-1 text-xs ${badgeClass[item.status]}`}>{item.status}</span>
                  </td>
                  <td className="py-3 text-slate-300">{item.sender}</td>
                  <td className="py-3 text-slate-300">{item.recipient}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex items-center justify-between text-sm text-slate-400">
          <span>
            Page {data?.page ?? 1} of {Math.max(data?.totalPages ?? 1, 1)}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(current - 1, 1))}
              className="rounded-xl border border-slate-700 px-3 py-2 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={Boolean(data && page >= Math.max(data.totalPages, 1))}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-xl border border-slate-700 px-3 py-2 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
