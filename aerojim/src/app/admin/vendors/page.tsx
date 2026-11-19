import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { categoryName, equipmentCategories } from "@/lib/equipment";
import { listVendors } from "@/lib/rfq";
import { inputCls, labelCls, primaryBtn } from "@/components/ui";
import AdminNav from "../AdminNav";
import { addVendor, toggleVendor } from "../actions";

export const metadata: Metadata = {
  title: "Vendors | AeroJim Admin",
  robots: { index: false, follow: false },
};

export default async function VendorsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const { error } = await searchParams;
  const vendors = await listVendors();

  return (
    <section className="py-10 bg-[#f8f9fa] min-h-[70vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <AdminNav active="vendors" />
        <h1 className="text-2xl font-black text-[#0a1628] mb-6">Vendors</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="p-3">Vendor</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Categories</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody>
                {vendors.map((v) => (
                  <tr key={v.id} className={`border-b border-gray-50 ${v.active ? "" : "opacity-50"}`}>
                    <td className="p-3 font-semibold">{v.name}</td>
                    <td className="p-3">
                      {v.contact_name && <div>{v.contact_name}</div>}
                      <div className="text-gray-500">{v.email}</div>
                      {v.phone && <div className="text-gray-500">{v.phone}</div>}
                    </td>
                    <td className="p-3">{v.categories.map(categoryName).join(", ")}</td>
                    <td className="p-3 text-right">
                      <form action={toggleVendor}>
                        <input type="hidden" name="id" value={v.id} />
                        <input type="hidden" name="active" value={String(!v.active)} />
                        <button className="text-xs text-gray-500 hover:text-amber-700 underline">
                          {v.active ? "Deactivate" : "Activate"}
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
                {vendors.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-6 text-gray-500">
                      No vendors yet — add your first one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <form action={addVendor} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4 h-fit">
            <h2 className="font-bold text-[#0a1628]">Add vendor</h2>
            {error && <p className="text-sm text-red-600">Name, email and at least one category are required.</p>}
            <div>
              <label className={labelCls}>Company name *</label>
              <input name="name" required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Contact person</label>
              <input name="contact_name" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Email *</label>
              <input type="email" name="email" required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Phone</label>
              <input name="phone" className={inputCls} />
            </div>
            <fieldset>
              <legend className={labelCls}>Categories *</legend>
              {equipmentCategories.map((c) => (
                <label key={c.slug} className="flex items-center gap-2 text-sm py-1">
                  <input type="checkbox" name="categories" value={c.slug} /> {c.name}
                </label>
              ))}
            </fieldset>
            <button className={`${primaryBtn} w-full`}>Add vendor</button>
          </form>
        </div>
      </div>
    </section>
  );
}
