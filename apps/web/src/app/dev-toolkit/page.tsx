"use client";

import { useEffect, useState } from "react";
import { ServiceCard } from "./_components/ServiceCard";
import type { ServiceItem } from "./_components/ServiceCard";
import { DecorativeImage } from "@/components/decorative";
import * as toolkitService from "@/services/toolkitService";
import * as categoryService from "@/services/categoryService";
import type { DevToolkit } from "@/types/devtoolkit";

type ToolkitWithCategory = DevToolkit & {
  category_name?: string;
};

export default function DevToolkitPage() {
  const [toolkits, setToolkits] = useState<ToolkitWithCategory[]>([]);
  const [categories, setCategories] = useState<categoryService.Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [toolkitsData, categoriesData] = await Promise.all([
          toolkitService.getToolkits(),
          categoryService.getCategories(),
        ]);

        // Map category names to toolkits
        const toolkitsWithCategory = toolkitsData.map((toolkit) => ({
          ...toolkit,
          category_name:
            categoriesData.find((cat) => cat.id === toolkit.category_id)
              ?.name_th || "อื่นๆ",
        }));

        setToolkits(toolkitsWithCategory);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading toolkits:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Group toolkits by category
  const toolkitsByCategory = toolkits.reduce(
    (acc, toolkit) => {
      const categoryName = toolkit.category_name || "อื่นๆ";
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(toolkit);
      return acc;
    },
    {} as Record<string, ToolkitWithCategory[]>
  );

  // Get recommended toolkits
  const recommendedToolkits = toolkits.filter(
    (t) => t.status === "recommended"
  );

  // Create sections from categories
  const sections = [
    ...(recommendedToolkits.length > 0
      ? [{ id: "recommended", label: "แนะนำ" }]
      : []),
    ...Object.keys(toolkitsByCategory)
      .sort()
      .map((categoryName) => ({
        id: categoryName.toLowerCase().replace(/\s+/g, "-"),
        label: categoryName,
      })),
  ];

  if (loading) {
    return (
      <main className="relative min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-10 text-foreground">
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-(--color-muted)">กำลังโหลด...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-10 text-foreground">
      <DecorativeImage variant="bottom-left" opacity={0.63} zIndex={0} />
      <DecorativeImage variant="top-right" opacity={0.6} zIndex={0} />

      <div className="relative z-10 mx-auto flex w-full max-w-8xl gap-6 sm:gap-8">
        <aside className="hidden w-56 shrink-0 md:block">
          <div className="sticky top-28 rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 shadow-sm">
            <DecorativeImage
              variant="decoration"
              opacity={0.72}
              zIndex={0}
              width={100}
              className="absolute -top-1 -right-5"
            />
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--color-muted)">
              Toolkit
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

        <div className="flex w-full flex-col gap-6 sm:gap-10">
          <header className="space-y-2 sm:space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-(--color-muted)">
              Dev Tools
            </p>
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Dev Toolkit
              </h1>
              <p className="max-w-3xl text-base text-(--color-muted)">
                รวมเครื่องมือและ demo ที่ทีมใช้ทดสอบฟีเจอร์ต่างๆ
                จัดกลุ่มตามหมวดหมู่
              </p>
            </div>
          </header>

          {recommendedToolkits.length > 0 && (
            <section id="recommended" className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <h2 className="text-lg sm:text-xl font-semibold">แนะนำ</h2>
                <p className="text-xs sm:text-sm text-(--color-muted)">
                  เครื่องมือที่แนะนำให้ลองใช้
                </p>
              </div>
              <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                {recommendedToolkits.map((toolkit) => {
                  const item: ServiceItem = {
                    id: toolkit.id,
                    title: toolkit.title,
                    category: toolkit.category_name || "อื่นๆ",
                    description: toolkit.description || "",
                    status: toolkit.status,
                    tags: toolkit.tags,
                    image: toolkit.image,
                  };
                  return <ServiceCard key={toolkit.id} item={item} />;
                })}
              </div>
            </section>
          )}

          {Object.entries(toolkitsByCategory)
            .sort(([a], [b]) => a.localeCompare(b, "th"))
            .map(([categoryName, categoryToolkits]) => (
              <section
                key={categoryName}
                id={categoryName.toLowerCase().replace(/\s+/g, "-")}
                className="space-y-3 sm:space-y-4"
              >
                <h2 className="text-lg sm:text-xl font-semibold">
                  {categoryName}
                </h2>
                <div className="grid gap-3 sm:gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {categoryToolkits.map((toolkit) => {
                    const item: ServiceItem = {
                      id: toolkit.id,
                      title: toolkit.title,
                      category: categoryName,
                      description: toolkit.description || "",
                      status: toolkit.status,
                      tags: toolkit.tags,
                      image: toolkit.image,
                    };
                    return <ServiceCard key={toolkit.id} item={item} />;
                  })}
                </div>
              </section>
            ))}

          {toolkits.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-(--color-muted)">ยังไม่มีข้อมูล DevToolkit</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
