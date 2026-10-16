import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <main className="max-w-5xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="text-center sm:text-left pb-12 border-b border-slate-200">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            Spring Boot Modular Store
          </h1>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {/* Customers Module Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xl mb-6">
              👥
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Customer Directory
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Manage customer records segregated inside <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-mono">customer_schema</code>. Exposes public contracts without leaking internal database tables.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Link
                href="/customers"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
              >
                Open Customers &rarr;
              </Link>
            </div>
          </div>

          {/* Orders Module Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xl mb-6">
              📦
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Orders & Events
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Track orders in <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-emerald-600 font-mono">order_schema</code>. Each order triggers decoupled asynchronous domain events to dispatch real-time email alerts.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Link
                href="/orders"
                className="inline-flex items-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg shadow-sm transition"
              >
                Open Orders &rarr;
              </Link>
            </div>
          </div>
        </div>    
      </main>
    </div>
  );
}