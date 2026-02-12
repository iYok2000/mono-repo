"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { LoadingFallback } from "@/components/ui/LoadingFallback";
import { DecorativeImage } from "@/components/decorative";
import { useScrollTracking } from "@/hooks/useScrollTracking";
import { renderMarkdown } from "@/utils/markdown";
import { ContentSection } from "@/components/product/ContentSection";
import { DesktopTOC, MobileTOC, type TOCItem } from "@/components/product/TableOfContents";
import * as productService from "@/services/productService";
import type { ProductDetail } from "@/types/product";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use custom hook for scroll tracking (optimized with throttle)
  const { scrollProgress, activeSection } = useScrollTracking();

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err: unknown) {
        console.error("Error loading product:", err);
        setError("ไม่พบข้อมูล Product หรือเกิดข้อผิดพลาด");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(`[data-section="${sectionId}"]`);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Build TOC items based on available content (memoized)
  const tocItems = useMemo((): TOCItem[] => {
    if (!product) return [];

    const items: TOCItem[] = [
      { id: "overview", title: "ภาพรวม", icon: "📋" },
    ];

    if (product.main_content) {
      items.push({ id: "main-content", title: "เนื้อหาหลัก", icon: "📖" });
    }
    if (product.how_to_use) {
      items.push({ id: "how-to-use", title: "วิธีการใช้งาน", icon: "🔧" });
    }
    if (product.example) {
      items.push({ id: "example", title: "ตัวอย่างโค้ด", icon: "💻" });
    }
    if (product.reference) {
      items.push({ id: "reference", title: "เอกสารอ้างอิง", icon: "🔗" });
    }

    return items;
  }, [product]);

  if (loading) {
    return <LoadingFallback message="กำลังโหลดข้อมูล..." />;
  }

  if (error || !product) {
    return (
      <main className="relative min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-10">
        <DecorativeImage variant="bottom-left" opacity={0.63} zIndex={0} />
        <DecorativeImage variant="top-right" opacity={0.6} zIndex={0} />

        <div className="relative z-10 mx-auto max-w-4xl">
          <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950 p-6 text-center">
            <h2 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">
              ไม่พบข้อมูล
            </h2>
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Link
              href="/product"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-(--color-primary) text-white hover:opacity-90 transition-opacity"
            >
              ← กลับไปหน้ารายการ
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-(--color-surface) z-50">
        <div 
          className="h-full bg-linear-to-r from-(--color-primary) to-(--color-secondary) transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <DecorativeImage variant="bottom-left" opacity={0.4} zIndex={0} />
      <DecorativeImage variant="top-right" opacity={0.4} zIndex={0} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Desktop Table of Contents */}
          <DesktopTOC
            items={tocItems}
            activeSection={activeSection}
            onSectionClick={scrollToSection}
          />

          {/* Main Content */}
          <article className="flex-1 min-w-0">
            {/* Single Article Card - All content in one flow */}
            <article className="bg-(--color-surface) rounded-2xl border border-(--color-border) overflow-hidden shadow-sm">
              {/* Hero Banner */}
              <section data-section="overview" className="scroll-mt-24">
                <div className="bg-gradient-to-r from-(--color-primary) to-(--color-secondary) p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    {product.image && (
                      <div className="flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover shadow-lg ring-2 ring-white/30"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 mb-1.5">
                        {product.category_id}
                      </p>
                      <h1 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight">
                        {product.title}
                      </h1>
                      {product.tags && product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {product.tags.map((tag) => (
                            <span 
                              key={tag}
                              className="px-1.5 py-0.5 bg-white/20 backdrop-blur-sm text-white text-[10px] font-medium rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Article Content - Everything flows together */}
              <div className="p-4 sm:p-5 lg:p-6 max-w-none prose prose-sm">
                {/* Description */}
                <div
                  className="mb-4"
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(product.description),
                  }}
                />

                {/* Content Sections - Using reusable component */}
                <ContentSection
                  id="main-content"
                  title="เนื้อหาหลัก"
                  icon="📖"
                  content={product.main_content}
                />

                <ContentSection
                  id="how-to-use"
                  title="วิธีการใช้งาน"
                  icon="🔧"
                  content={product.how_to_use}
                />

                <ContentSection
                  id="example"
                  title="ตัวอย่างโค้ด"
                  icon="💻"
                  content={product.example}
                  isCodeExample
                />

                <ContentSection
                  id="reference"
                  title="เอกสารอ้างอิง"
                  icon="🔗"
                  content={product.reference}
                />
              </div>
            </article>
          </article>
        </div>
      </div>

      {/* Mobile Table of Contents - Floating Button */}
      <MobileTOC
        items={tocItems}
        activeSection={activeSection}
        onSectionClick={scrollToSection}
      />
    </main>
  );
}
