import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { categoryName } from "@/lib/equipment";
import { fmtDate, listRequests } from "@/lib/rfq";
import AdminNav from "./AdminNav";

export const metadata: Metadata = {
  title: "Admin | AeroJim",
  robots: { index: false, follow: false },
};

const statusStyle: Record<string, string> = {
  open: "bg-blue-100 text-blue-800",
  quoted: "bg-amber-100 text-amber-800",
  accepted: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-600",
};

export default async function AdminPage() {
  await requireAdmin();
  const requests = await listRequests();

  return (
    <section className="py-10 bg-[#f8f9fa] min-h-[70vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <AdminNav active="requests" />
        <h1 className="text-2xl font-black text-[#0a1628] mb-6">Equipment requests</h1>

        {requests.length === 0 ? (
          <p className="text-gray-500">No requests yet.</p>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="p-3">Ref</th>
                  <th className="p-3">Equipment</th>
                  <th className="p-3">Client</th>
                  <th className="p-3">Vendors replied</th>
                  <th className="p-3">Quotes sent</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Received</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50 hover:bg-amber-50/40">
                    <td className="p-3 font-semibold">
                      <Link href={`/admin/requests/${r.id}`} className="text-amber-700 hover:underline">
                        {r.ref}
                      </Link>
                    </td>
                    <td className="p-3">{categoryName(r.category)}</td>
                    <td className="p-3">{r.company}</td>
                    <td className="p-3">
                      {r.responded}/{r.invited}
                    </td>
                    <td className="p-3">{r.quotes}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusStyle[r.status]}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500">{fmtDate(r.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
