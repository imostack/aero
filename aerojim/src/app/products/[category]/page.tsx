import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getCategoryBySlug } from "@/lib/products";
import { ArrowRight, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return categories.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await props.params;
  const cat = getCategoryBySlug(category);
  if (!cat) return {};
  return {
    title: `${cat.name} | AeroJim Oil & Gas Supply`,
    description: cat.description,
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await props.params;
  const cat = getCategoryBySlug(category);

  if (!cat) notFound();

  return (
    <>
      {/* Header */}
      <section className="bg-[#0a1628] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold tracking-widest uppercase mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-white/30">/</span>
            <Link href="/products" className="hover:text-white transition-colors">
              Products
            </Link>
            <span className="text-white/30">/</span>
            <span>{cat.name}</span>
          </div>
          <div className="flex items-start gap-5">
            <span className="text-5xl hidden sm:block">{cat.icon}</span>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black mb-3">
                {cat.name}
              </h1>
              <p className="text-gray-400 max-w-2xl leading-relaxed">
                {cat.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="py-16 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-[#0a1628]">
              {cat.products.length} Product Types
            </h2>
            <Link
              href="/contact"
              className="text-sm font-semibold text-amber-600 hover:text-amber-500 flex items-center gap-1 transition-colors"
            >
              Request Quote <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {cat.products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col"
              >
                <h3 className="font-bold text-[#0a1628] text-base mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-4">
                  {product.description}
                </p>
                {product.specs && product.specs.length > 0 && (
                  <div className="space-y-1.5">
                    {product.specs.map((spec) => (
                      <div key={spec} className="flex items-start gap-2">
                        <CheckCircle
                          size={14}
                          className="text-amber-500 mt-0.5 shrink-0"
                        />
                        <span className="text-xs text-gray-600">{spec}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <Link
                    href={`/contact?product=${encodeURIComponent(product.name)}&category=${encodeURIComponent(cat.name)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-500 transition-colors"
                  >
                    Request Quote for this item <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Other categories */}
      <section className="py-14 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-[#0a1628] mb-6">
            Other Product Categories
          </h2>
          <div className="flex flex-wrap gap-3">
            {categories
              .filter((c) => c.id !== cat.id)
              .map((c) => (
                <Link
                  key={c.id}
                  href={`/products/${c.slug}`}
                  className="flex items-center gap-2 bg-[#f8f9fa] hover:bg-[#0a1628] hover:text-white border border-gray-200 hover:border-[#0a1628] text-[#0a1628] text-sm font-medium px-4 py-2 rounded-full transition-all duration-150"
                >
                  <span>{c.icon}</span> {c.name}
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-amber-500 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0a1628] mb-3">
            Need {cat.name}?
          </h2>
          <p className="text-[#0a1628]/70 mb-6">
            Submit your RFQ or material requisition and our team will respond
            with pricing and lead time within 24 hours.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#0a1628] hover:bg-[#0d2550] text-white font-bold px-8 py-3.5 rounded text-sm transition-colors"
          >
            Get a Quote <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </>
  );
}
