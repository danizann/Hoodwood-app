import { useEffect, useState } from 'react';
import { api } from '../api';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  productName: string;
  invoiceNumber: string;
  unitPrice: number;
  quantity: number;
  shippingCost: number;
  taxAmount: number;
  totalPrice: number;
  resiNumber: string | null;
  createdAt: string;
}

const currencyFormat = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0
});

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    api.get<{ data: Order[] }>('/orders').then((response) => setOrders(response.data.data));
  }, []);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <h2 className="text-xl font-semibold">Orders linked to resi</h2>
      <p className="mt-2 text-sm text-slate-400">Lihat detail order produk, nomor invoice, dan rincian harga per transaksi.</p>
      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="pb-3">Order</th>
              <th className="pb-3">Customer</th>
              <th className="pb-3">Product</th>
              <th className="pb-3">Invoice</th>
              <th className="pb-3">Price Detail</th>
              <th className="pb-3">Resi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="py-3 font-medium text-white">{order.orderNumber}</td>
                <td className="py-3 text-slate-300">{order.customerName}</td>
                <td className="py-3 text-slate-300">{order.productName}</td>
                <td className="py-3 text-amber-300">{order.invoiceNumber}</td>
                <td className="py-3 text-slate-300">
                  <div className="space-y-1">
                    <div>{currencyFormat.format(order.unitPrice)} × {order.quantity}</div>
                    <div className="text-xs text-slate-400">Ongkir: {currencyFormat.format(order.shippingCost)}</div>
                    <div className="text-xs text-slate-400">Pajak: {currencyFormat.format(order.taxAmount)}</div>
                    <div className="font-medium text-emerald-300">Total: {currencyFormat.format(order.totalPrice)}</div>
                  </div>
                </td>
                <td className="py-3 text-emerald-300">{order.resiNumber ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
