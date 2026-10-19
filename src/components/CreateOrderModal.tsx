"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Customer {
  id: number;
  name: string;
  email: string;
}

interface CreateOrderModalProps {
  initialCustomerId?: string;
}

export default function CreateOrderModal({ initialCustomerId }: CreateOrderModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customerId, setCustomerId] = useState(initialCustomerId || "");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [customerFetchError, setCustomerFetchError] = useState("");

  const router = useRouter();

  // Sync initialCustomerId if it changes
  useEffect(() => {
    if (initialCustomerId) {
      setCustomerId(initialCustomerId);
    }
  }, [initialCustomerId]);

  // Load existing customers whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      const fetchCustomers = async () => {
        setLoadingCustomers(true);
        setCustomerFetchError("");
        try {
          const res = await fetch("http://localhost:8080/api/customers", {
            cache: "no-store",
          });
          if (!res.ok) {
            throw new Error(`Server returned ${res.status}`);
          }
          const data: Customer[] = await res.json();
          setCustomers(data);

          // If there is an initialCustomerId, keep it; otherwise if none selected and customers exist
          if (initialCustomerId) {
            setCustomerId(initialCustomerId);
          }
        } catch (err: any) {
          console.error("Failed to fetch customers for modal:", err);
          setCustomerFetchError(err.message || "Failed to load customers");
        } finally {
          setLoadingCustomers(false);
        }
      };

      fetchCustomers();
    }
  }, [isOpen, initialCustomerId]);

  const selectedCustomer = customers.find((c) => String(c.id) === String(customerId));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) {
      setErrorMessage("Please select a customer to place an order.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: Number(customerId),
          amount: parseFloat(amount),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to create order (${response.status})`);
      }

      setAmount("");
      if (!initialCustomerId) setCustomerId("");
      setIsOpen(false);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition cursor-pointer"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Place New Order
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full p-6 transition-all">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Place an Order</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                ✕
              </button>
            </div>

            {errorMessage && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="customer-select"
                    className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                  >
                    Customer
                  </label>
                  {loadingCustomers && (
                    <span className="text-xs text-indigo-600 flex items-center gap-1">
                      <svg className="animate-spin h-3 w-3 text-indigo-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      Loading...
                    </span>
                  )}
                </div>

                {loadingCustomers ? (
                  <div className="w-full px-3 py-2 bg-slate-50 text-slate-400 border border-slate-200 rounded-lg text-sm animate-pulse">
                    Loading existing customers...
                  </div>
                ) : customerFetchError ? (
                  <div className="space-y-2">
                    <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 p-2 rounded-lg">
                      Could not load customer list automatically. Please enter ID manually:
                    </div>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 1"
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value)}
                      className="w-full px-3 py-2 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                  </div>
                ) : customers.length === 0 ? (
                  <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 p-2.5 rounded-lg">
                    No customers found in database. Please add a customer first.
                  </div>
                ) : (
                  <div className="space-y-1">
                    <select
                      id="customer-select"
                      required
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition cursor-pointer"
                    >
                      <option value="" disabled>
                        -- Choose an existing customer --
                      </option>
                      {customerId && !customers.some((c) => String(c.id) === String(customerId)) && (
                        <option value={customerId}>Customer #{customerId} (Pre-selected)</option>
                      )}
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} (ID: #{c.id}) — {c.email}
                        </option>
                      ))}
                    </select>

                    {selectedCustomer && (
                      <p className="text-xs text-slate-500 pt-1">
                        Selected: <span className="font-semibold text-slate-700">{selectedCustomer.name}</span> ({selectedCustomer.email})
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Order Amount (LKR)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  placeholder="e.g. 2500.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || (customers.length === 0 && !customerId && !customerFetchError)}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-medium rounded-lg shadow-sm transition"
                >
                  {loading ? "Placing..." : "Submit Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}