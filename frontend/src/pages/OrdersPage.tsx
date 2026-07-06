import { useEffect, useState } from 'react';
import { api } from '../api';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  resiNumber: string | null;
  createdAt: string;
}

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    api.get<{ data: Order[] }>('/orders').then((response) => setOrders(response.data.data));
  }, []);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <h2 className="text-xl font-semibold">Orders linked to resi</h2>
      <p className="mt-2 text-sm text-slate-400">Order data from the backend is now linked to shipment tracking numbers.</p>
      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="pb-3">Order</th>
              <th className="pb-3">Customer</th>
              <th className="pb-3">Resi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="py-3 font-medium text-white">{order.orderNumber}</td>
                <td className="py-3 text-slate-300">{order.customerName}</td>
                <td className="py-3 text-emerald-300">{order.resiNumber ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
