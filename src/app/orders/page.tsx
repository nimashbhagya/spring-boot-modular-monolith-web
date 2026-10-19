import React from "react";
import Link from "next/link";
import CreateOrderModal from "@/components/CreateOrderModal";
import OrderActions from "@/components/OrderActions";

interface Order {
  id: number;
  customerId: number;
  totalAmount: number;
  status: string;
}

async function getOrders(customerId?: string): Promise<Order[]> {
  try {
    const url = customerId
      ? `http://localhost:8080/api/orders?customerId=${customerId}`
      : `http://localhost:8080/api/orders`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch orders");
    return await res.json();
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ customerId?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const customerId = resolvedSearchParams.customerId;
  const orders = await getOrders(customerId);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-4">
          <Link
            href="/customers"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1"
          >
            &larr; Back to Customers Directory
          </Link>
        </div>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {customerId ? `Orders for Customer #${customerId}` : "All Orders"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Managed under order_schema with asynchronous domain event triggers
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center gap-3">
            {customerId && (
              <Link
                href="/orders"
                className="text-xs px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition"
              >
                Clear Filter
              </Link>
            )}
            <CreateOrderModal initialCustomerId={customerId} />
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-semibold text-slate-900">No orders found</h3>
              <p className="mt-1 text-sm text-slate-500">
                {customerId
                  ? `Customer #${customerId} has not placed any orders yet.`
                  : "No orders have been recorded in the database."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left">
                <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-4">Order ID</th>
                    <th scope="col" className="px-6 py-4">Customer ID</th>
                    <th scope="col" className="px-6 py-4">Total Amount</th>
                    <th scope="col" className="px-6 py-4">Status</th>
                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors duration-150">
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-indigo-600 font-semibold">
                        <Link href={`/orders?customerId=${order.customerId}`} className="hover:underline">
                          Customer #{order.customerId}
                        </Link>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        LKR {Number(order.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {order.status || "COMPLETED"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                          <OrderActions order={order} />
</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}