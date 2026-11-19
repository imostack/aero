import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { listApplications } from "@/lib/applications";
import { categoriesByGroup, categoryName } from "@/lib/equipment";
import { fmtDate } from "@/lib/rfq";
import { inputCls, labelCls, primaryBtn, secondaryBtn } from "@/components/ui";
import AdminNav from "../AdminNav";
import { approveApplication, updateApplication } from "../actions";

export const metadata: Metadata = {
  title: "Vendor Applications | AeroJim Admin",
  robots: { index: false, follow: false },
};

const statusStyle: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-gray-100 text-gray-600",
};

export default async function ApplicationsPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ approved?: string; error?: string }>;
}>) {
  await requireAdmin();
  const { approved, error } = await searchParams;
  const applications = await listApplications();

  return (
    <section className="py-10 bg-[#f8f9fa] min-h-[70vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <AdminNav active="applications" />
        <h1 className="text-2xl font-black text-[#0a1628] mb-6">Vendor applications</h1>

        {approved && (
          <p className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-3 mb-6 text-sm">
            Approved. They&apos;re now an active vendor and will receive matching requests.
          </p>
        )}
        {error && (
          <p className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-6 text-sm">
            Select at least one category to approve.
          </p>
        )}

        {applications.length === 0 && <p className="text-gray-500">No applications yet.</p>}

        <div className="space-y-4">
          {applications.map((a) => (
            <div key={a.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                <div>
                  <h2 className="font-bold text-[#0a1628] text-lg">{a.company}</h2>
                  <p className="text-xs text-gray-500">Applied {fmtDate(a.created_at)}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusStyle[a.status]}`}>
                  {a.status}
                </span>
              </div>

              <dl className="text-sm grid grid-cols-3 gap-y-1.5 mb-3">
                <dt className="text-gray-500">Contact</dt>
                <dd className="col-span-2 font-semibold">{a.contact_name}</dd>
                <dt className="text-gray-500">Email</dt>
                <dd className="col-span-2"><a className="text-amber-700" href={`mailto:${a.email}`}>{a.email}</a></dd>
                <dt className="text-gray-500">Phone</dt>
                <dd className="col-span-2"><a className="text-amber-700" href={`tel:${a.phone}`}>{a.phone}</a></dd>
                <dt className="text-gray-500">Based in</dt>
                <dd className="col-span-2">{a.location}</dd>
                <dt className="text-gray-500">CAC / RC</dt>
                <dd className="col-span-2">{a.rc_number || "—"}</dd>
                <dt className="text-gray-500">Equipment</dt>
                <dd className="col-span-2">{a.categories.map(categoryName).join(", ")}</dd>
              </dl>
              {a.equipment_summary && (
                <p className="text-sm text-gray-600 whitespace-pre-line bg-gray-50 rounded p-3 mb-3">
                  {a.equipment_summary}
                </p>
              )}

              {a.status === "approved" ? (
                <p className="text-sm text-green-700">
                  ✓ Approved and added to Vendors.{a.admin_notes ? ` Notes: ${a.admin_notes}` : ""}
                </p>
              ) : (
                <div className="border-t border-gray-100 pt-4 space-y-4">
                  <form action={updateApplication} className="space-y-3">
                    <input type="hidden" name="id" value={a.id} />
                    <div>
                      <label className={labelCls} htmlFor={`notes-${a.id}`}>Private notes</label>
                      <textarea
                        id={`notes-${a.id}`}
                        name="notes"
                        rows={2}
                        defaultValue={a.admin_notes ?? ""}
                        className={`${inputCls} resize-none`}
                      />
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      <button type="submit" name="status" value="contacted" className={secondaryBtn}>
                        Mark contacted
                      </button>
                      <button type="submit" name="status" value="rejected" className={secondaryBtn}>
                        Reject
                      </button>
                    </div>
                  </form>

                  <details className="bg-amber-50/50 border border-amber-100 rounded-lg p-4">
                    <summary className="text-sm font-bold text-[#0a1628] cursor-pointer">
                      Approve and add as vendor
                    </summary>
                    <form action={approveApplication} className="mt-3 space-y-3">
                      <input type="hidden" name="id" value={a.id} />
                      <input type="hidden" name="notes" value={a.admin_notes ?? ""} />
                      <p className="text-xs text-gray-500">
                        They will start receiving requests for the categories ticked below. Adjust if needed.
                      </p>
                      <div className="max-h-56 overflow-y-auto space-y-2">
                        {categoriesByGroup()
                          .filter(({ group }) => group.slug !== "other")
                          .map(({ group, categories }) => (
                            <div key={group.slug}>
                              <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">{group.name}</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2">
                                {categories.map((c) => (
                                  <label key={c.slug} className="flex items-center gap-2 text-sm py-0.5">
                                    <input
                                      type="checkbox"
                                      name="categories"
                                      value={c.slug}
                                      defaultChecked={a.categories.includes(c.slug)}
                                    />
                                    {c.name}
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                      <button type="submit" className={primaryBtn}>Approve vendor</button>
                    </form>
                  </details>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
