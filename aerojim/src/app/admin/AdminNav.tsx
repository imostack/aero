import Link from "next/link";
import { countNewApplications } from "@/lib/applications";
import { logout } from "./actions";

type Tab = "requests" | "vendors" | "applications";

export default async function AdminNav({ active }: Readonly<{ active: Tab }>) {
  const newApplications = await countNewApplications().catch(() => 0);

  const link = (href: string, label: string, key: Tab, badge = 0) => (
    <Link
      href={href}
      className={`text-sm font-semibold px-3 py-1.5 rounded inline-flex items-center gap-1.5 ${
        active === key ? "bg-[#0a1628] text-amber-400" : "text-gray-600 hover:text-[#0a1628]"
      }`}
    >
      {label}
      {badge > 0 && (
        <span className="bg-amber-500 text-[#0a1628] text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none">
          {badge}
        </span>
      )}
    </Link>
  );

  return (
    <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
      <div className="flex gap-2 flex-wrap">
        {link("/admin", "Requests", "requests")}
        {link("/admin/applications", "Vendor applications", "applications", newApplications)}
        {link("/admin/vendors", "Vendors", "vendors")}
      </div>
      <form action={logout}>
        <button type="submit" className="text-sm text-gray-500 hover:text-red-600">
          Log out
        </button>
      </form>
    </div>
  );
}
