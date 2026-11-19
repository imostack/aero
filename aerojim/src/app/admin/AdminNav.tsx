import Link from "next/link";
import { logout } from "./actions";

export default function AdminNav({ active }: { active: "requests" | "vendors" }) {
  const link = (href: string, label: string, key: string) => (
    <Link
      href={href}
      className={`text-sm font-semibold px-3 py-1.5 rounded ${
        active === key ? "bg-[#0a1628] text-amber-400" : "text-gray-600 hover:text-[#0a1628]"
      }`}
    >
      {label}
    </Link>
  );
  return (
    <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
      <div className="flex gap-2">
        {link("/admin", "Requests", "requests")}
        {link("/admin/vendors", "Vendors", "vendors")}
      </div>
      <form action={logout}>
        <button className="text-sm text-gray-500 hover:text-red-600">Log out</button>
      </form>
    </div>
  );
}
