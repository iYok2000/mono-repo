"use client";

import { DecorativeImage } from "@/components/decorative";
import { BannerCarousel } from "@/components/banner/BannerCarousel";
import { useBanners } from "@/hooks/useBanners";

export default function ProjectPage() {
  const { banners, loading } = useBanners();

  return (
    <>
      {/* Banner Carousel - Full width at top */}
      {!loading && banners.length > 0 && <BannerCarousel banners={banners} />}

      <main className="relative min-h-screen bg-background px-4 pb-8 sm:px-6 sm:pb-12 font-sans text-foreground">
        <DecorativeImage variant="theme-main" opacity={0.05} zIndex={0} />
        <div className="mx-auto flex w-full max-w-6xl flex-col pt-8 sm:pt-12">
          <section className="overflow-hidden rounded-2xl sm:rounded-3xl border border-(--color-border) bg-(--color-surface) px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12 shadow-sm">
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-(--color-muted)">
                โปรเจกต์
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                โปรเจกต์ทั้งหมด
              </h1>
              <p className="max-w-2xl text-lg text-(--color-muted)">
                รวมโปรเจกต์และงานทั้งหมดของทีม
                พร้อมรายละเอียดและสถานะการดำเนินงาน
              </p>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-(--color-border) bg-(--color-surface-alt) px-6 py-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-foreground">
                      โปรเจกต์ A
                    </h3>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      ดำเนินการ
                    </span>
                  </div>
                  <p className="text-sm text-(--color-muted) mb-4">
                    รายละเอียดของโปรเจกต์ A ที่กำลังดำเนินการอยู่ในขณะนี้
                  </p>
                  <div className="flex items-center gap-2 text-xs text-(--color-muted)">
                    <span>อัพเดท: 25 ธ.ค. 2568</span>
                  </div>
                </div>

                <div className="rounded-xl border border-(--color-border) bg-(--color-surface-alt) px-6 py-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-foreground">
                      โปรเจกต์ B
                    </h3>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      วางแผน
                    </span>
                  </div>
                  <p className="text-sm text-(--color-muted) mb-4">
                    โปรเจกต์ใหม่ที่อยู่ระหว่างการวางแผนและเตรียมการ
                  </p>
                  <div className="flex items-center gap-2 text-xs text-(--color-muted)">
                    <span>อัพเดท: 20 ธ.ค. 2568</span>
                  </div>
                </div>

                <div className="rounded-xl border border-(--color-border) bg-(--color-surface-alt) px-6 py-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-foreground">
                      โปรเจกต์ C
                    </h3>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      เสร็จสิ้น
                    </span>
                  </div>
                  <p className="text-sm text-(--color-muted) mb-4">
                    โปรเจกต์ที่เสร็จสิ้นแล้วและพร้อมใช้งาน
                  </p>
                  <div className="flex items-center gap-2 text-xs text-(--color-muted)">
                    <span>อัพเดท: 15 ธ.ค. 2568</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
