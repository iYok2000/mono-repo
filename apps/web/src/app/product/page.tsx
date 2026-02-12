"use client";

import { useEffect, useState, useMemo } from "react";
import { ServiceCard } from "./_components/ServiceCard";
import type { ServiceItem } from "./_components/ServiceCard";
import { DecorativeImage } from "@/components/decorative";
import { LoadingFallback, PageSuspense } from "@/components/ui/LoadingFallback";
import * as productService from "@/services/productService";
import * as categoryService from "@/services/categoryService";
import {
  mapProductsWithCategories,
  groupProductsByCategory,
  getUniqueCategorySections,
} from "./_utils/productHelpers";
import type { ProductWithCategory } from "./_utils/productHelpers";

function ProductContent() {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          productService.getProducts(),
          categoryService.getCategories(),
        ]);

        // Map category names and IDs to products
        const mappedProducts = mapProductsWithCategories(
          productsData,
          categoriesData
        );

        setProducts(mappedProducts);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Memoize grouped data
  const { productsByCategory, recommendedProducts, sections } = useMemo(() => {
    const grouped = groupProductsByCategory(products);
    const recommended = products.filter((t) => t.status === "recommended");
    const uniqueSections = getUniqueCategorySections(
      grouped,
      recommended.length > 0
    );

    return {
      productsByCategory: grouped,
      recommendedProducts: recommended,
      sections: uniqueSections,
    };
  }, [products]);

  if (loading) {
    return <LoadingFallback message="กำลังโหลดข้อมูล Product..." />;
  }

  return (
    <main className="relative min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-10 text-foreground">
      <DecorativeImage variant="bottom-left" opacity={0.63} zIndex={0} />
      <DecorativeImage variant="top-right" opacity={0.6} zIndex={0} />

      <div className="relative z-10 mx-auto flex w-full max-w-8xl gap-6 sm:gap-8">
        {/* Sidebar Navigation */}
        <aside className="hidden w-56 shrink-0 md:block">
          <div className="sticky top-28 rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 shadow-sm">
            <DecorativeImage
              variant="decoration"
              opacity={0.8}
              zIndex={0}
              width={70}
              className="absolute -top-1 -right-5"
            />
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--color-muted)">
              Product
            </p>
            <nav className="mt-3 space-y-2 text-sm">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block rounded-xl px-3 py-2 text-(--color-muted) transition-colors hover:bg-(--color-surface-alt) hover:text-foreground"
                >
                  {section.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex w-full flex-col gap-6 sm:gap-10">
          <header className="space-y-2 sm:space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-(--color-muted)">
              Products
            </p>
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Product
              </h1>
              <p className="max-w-3xl text-base text-(--color-muted)">
                รวมเครื่องมือและ demo ที่ทีมใช้ทดสอบฟีเจอร์ต่างๆ
                จัดกลุ่มตามหมวดหมู่
              </p>
            </div>
          </header>

          {/* Recommended Section */}
          {recommendedProducts.length > 0 && (
            <section id="recommended" className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <h2 className="text-lg sm:text-xl font-semibold">แนะนำ</h2>
                <p className="text-xs sm:text-sm text-(--color-muted)">
                  เครื่องมือที่แนะนำให้ลองใช้
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {recommendedProducts.map((product) => {
                  const item: ServiceItem = {
                    id: product.id,
                    title: product.title,
                    category: product.category_name || "อื่นๆ",
                    description: product.description || "",
                    status: product.status,
                    tags: product.tags,
                    image: product.image,
                  };
                  return <ServiceCard key={product.id} item={item} />;
                })}
              </div>
            </section>
          )}

          {/* Category Sections - Fixed duplicate rendering */}
          {Object.entries(productsByCategory)
            .sort(([a], [b]) => a.localeCompare(b, "th"))
            .map(([categoryName, categoryProducts]) => {
              const sectionId = categoryName.toLowerCase().replace(/\s+/g, "-");
              return (
                <section
                  key={sectionId}
                  id={sectionId}
                  className="space-y-3 sm:space-y-4"
                >
                  <h2 className="text-lg sm:text-xl font-semibold">
                    {categoryName}
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {categoryProducts.map((product) => {
                      const item: ServiceItem = {
                        id: product.id,
                        title: product.title,
                        category: categoryName,
                        description: product.description || "",
                        status: product.status,
                        tags: product.tags,
                        image: product.image,
                      };
                      return <ServiceCard key={product.id} item={item} />;
                    })}
                  </div>
                </section>
              );
            })}

          {/* Empty State */}
          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-(--color-muted)">ยังไม่มีข้อมูล Product</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ProductPage() {
  return (
    <PageSuspense fallback={<LoadingFallback message="กำลังโหลดข้อมูล Product..." />}>
      <ProductContent />
    </PageSuspense>
  );
}
