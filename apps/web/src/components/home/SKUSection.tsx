"use client";

import { Button } from "@/components/ui/Button";
import { getProducts } from "@/services/productService";
import type { SKUSectionSettings } from "@/types/homeSettings";
import type { Product } from "@/types/product";
import { ArrowRight, Package, Sparkles, Tag, Zap } from "lucide-react";
import Link from "next/link";
import { memo, useEffect, useMemo, useState } from "react";

type SKUSectionProps = {
  settings?: SKUSectionSettings;
};

const statusLabel: Record<Product["status"], string> = {
  recommended: "แนะนำ",
  new: "ใหม่",
  coming_soon: "เร็วๆ นี้",
  default: "พร้อมใช้งาน",
};

let productCache: Product[] | null = null;

const ProductSkeleton = () => (
  <div className="h-[360px] animate-pulse rounded-2xl border border-(--border) bg-background" />
);

const ProductCard = memo(function ProductCard({ product }: { product: Product }) {
  const isComingSoon = product.status === "coming_soon";
  const detailHref = `/product/${product.id}/detail`;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-(--border) bg-(--card) p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-(--primary) hover:shadow-xl">
      <div className="absolute inset-0 rounded-2xl bg-(--primary)/0 transition-colors duration-300 group-hover:bg-(--primary)/5" />
      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-(--primary-soft) px-3 py-1 text-xs font-semibold text-(--primary)">
            {product.status === "recommended" ? (
              <Zap className="h-3 w-3" />
            ) : (
              <Sparkles className="h-3 w-3" />
            )}
            {statusLabel[product.status]}
          </span>
          <Package className="h-5 w-5 text-(--primary)" />
        </div>

        {product.image ? (
          <div className="mb-5 aspect-16/10 overflow-hidden rounded-xl bg-background">
            <img
              src={product.image}
              alt={product.title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="mb-5 flex aspect-16/10 items-center justify-center rounded-xl bg-(--primary-soft)">
            <Package className="h-10 w-10 text-(--primary)" />
          </div>
        )}

        <div className="flex flex-1 flex-col">
          <h3 className="mb-3 text-2xl font-bold text-foreground line-clamp-2">
            {product.title}
          </h3>
          <p className="text-base leading-relaxed text-(--muted) line-clamp-4">
            {product.description || "ดูรายละเอียดและเลือกแพ็กที่เหมาะกับโอกาสของคุณ"}
          </p>

          {product.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {product.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full border border-(--border) px-2.5 py-1 text-xs text-(--muted)"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-auto pt-6">
            {isComingSoon ? (
              <Button variant="primary" fullWidth disabled>
                กำลังมา
              </Button>
            ) : (
              <Link href={detailHref}>
                <Button variant="primary" fullWidth>
                  ดูรายละเอียด
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
});

export function SKUSection({ settings }: SKUSectionProps) {
  const [products, setProducts] = useState<Product[]>(productCache ?? []);
  const [loading, setLoading] = useState(!productCache);

  useEffect(() => {
    let mounted = true;

    if (productCache) {
      setLoading(false);
      return () => {
        mounted = false;
      };
    }

    getProducts()
      .then((data) => {
        productCache = data;
        if (mounted) setProducts(data);
      })
      .catch(() => {
        if (mounted) setProducts([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const featuredProducts = useMemo(() => {
    const recommended = products.filter((product) => product.status === "recommended");
    return (recommended.length > 0 ? recommended : products).slice(0, 3);
  }, [products]);

  const title = settings?.title || "เลือกแพ็กของขวัญที่เหมาะกับคุณ";
  const subtitle =
    settings?.subtitle ||
    "คนส่วนใหญ่เลือก Express - ของขวัญเร็ว ใช้ได้เลย พร้อม NFC + QR สำรอง";

  return (
    <section className="relative bg-(--card) py-16 lg:py-24" id="pricing">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center animate-slide-up">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-(--primary-soft) px-3 py-1.5">
            <span className="text-(--primary) text-sm font-medium">
              ของขวัญวันเกิด • ครบรอบ • อำลา • นามบัตร
            </span>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-foreground lg:text-4xl xl:text-5xl">
            {title}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-(--muted)">
            {subtitle}
          </p>
        </div>

        {loading && (
          <div className="mb-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <ProductSkeleton key={item} />
            ))}
          </div>
        )}

        {!loading && featuredProducts.length > 0 && (
          <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && featuredProducts.length === 0 && (
          <div className="mb-12 rounded-2xl border border-dashed border-(--border) bg-background p-8 text-center">
            <Package className="mx-auto mb-3 h-8 w-8 text-(--primary)" />
            <p className="text-base font-medium text-foreground">
              ยังไม่มี Product สำหรับแสดงบนหน้าแรก
            </p>
            <p className="mt-1 text-sm text-(--muted)">
              เพิ่ม Product ใน Admin แล้ว section นี้จะดึงมาแสดงอัตโนมัติ
            </p>
          </div>
        )}

        <div className="flex justify-center">
          <Link href="/product">
            <Button
              variant="secondary"
              className="inline-flex items-center gap-2 shadow-sm hover:-translate-y-0.5"
              iconAfter={<ArrowRight className="h-4 w-4" />}
            >
              ดู Product ทั้งหมด
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
