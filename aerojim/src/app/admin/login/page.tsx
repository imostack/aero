import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { inputCls, labelCls, primaryBtn } from "@/components/ui";
import { login } from "../actions";

export const metadata: Metadata = {
  title: "Admin Login | AeroJim",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdmin()) redirect("/admin");
  const { error } = await searchParams;
  const configured = !!process.env.ADMIN_PASSWORD;

  return (
    <section className="py-20 bg-[#f8f9fa]">
      <div className="max-w-sm mx-auto px-4">
        <form action={login} className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 space-y-5">
          <h1 className="text-xl font-black text-[#0a1628]">Admin login</h1>
          {!configured && (
            <p className="text-sm text-red-600">ADMIN_PASSWORD is not set on the server.</p>
          )}
          <div>
            <label className={labelCls}>Password</label>
            <input type="password" name="password" required autoFocus className={inputCls} />
          </div>
          {error && <p className="text-sm text-red-600">Incorrect password.</p>}
          <button className={`${primaryBtn} w-full`}>Log in</button>
        </form>
      </div>
    </section>
  );
}
