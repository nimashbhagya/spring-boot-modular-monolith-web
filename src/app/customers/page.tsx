import React from "react";
import Link from "next/link";
import AddCustomerModal from "@/components/AddCustomerModal";

// 1. TypeScript Interface for the Customer response from Spring Boot
interface Customer {
  id: number;
  name: string;
  email: string;
}

// 2. Data fetching function (Runs as a Next.js Server Component for SEO optimization)
async function getCustomers(): Promise<Customer[]> {
  try {
    const res = await fetch("http://localhost:8080/api/customers", {
      cache: "no-store", // Ensures fresh data retrieval on every request
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}

// 3. Page Component
export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Customer Directory
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Customer records fetched from the Spring Boot Modular Monolith backend
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex items-center gap-3">
            <AddCustomerModal />
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
          {customers.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-semibold text-slate-900">
                No customers found
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Make sure your Spring Boot backend is running and the database contains customer records.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left">
                <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-4">ID</th>
                    <th scope="col" className="px-6 py-4">Name</th>
                    <th scope="col" className="px-6 py-4">Email</th>
                    <th scope="col" className="px-6 py-4">Status</th>
                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {customers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="hover:bg-slate-50/80 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">
                        #{customer.id}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase">
                            {customer.name.substring(0, 2)}
                          </div>
                          <span>{customer.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {customer.email}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/orders?customerId=${customer.id}`}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
                        >
                          View Orders &rarr;
                        </Link>
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