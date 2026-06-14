"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Tag, Wrench, Image, Activity, Settings, ToggleLeft, ToggleRight, Save, RefreshCw } from "lucide-react";
import {
  getHomeSections,
  updateHomeSections,
  SECTION_LABELS,
  DEFAULT_SECTION_VISIBILITY,
  type SectionVisibility,
} from "@/services/settingsService";
import { getCategories } from "@/services/categoryService";
import { getBanners } from "@/services/bannerService";
import { goApi } from "@/lib/axios";

interface Stats {
  categories: number;
  banners: number;
  products: number;
}

const QUICK_LINKS = [
  {
    href: "/admin/category",
    icon: Tag,
    label: "หมวดหมู่",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-500",
  },
  {
    href: "/admin/product",
    icon: Wrench,
    label: "Product",
    color: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    iconBg: "bg-violet-500",
  },
  {
    href: "/admin/banner",
    icon: Image,
    label: "Banner",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-500",
  },
  {
    href: "/admin/healthcheck",
    icon: Activity,
    label: "Health Check",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-500",
  },
  {
    href: "/admin/home-settings",
    icon: Settings,
    label: "Home Settings",
    color: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
    iconBg: "bg-pink-500",
  },
];

export default function AdminDashboard() {
  const [sections, setSections] = useState<SectionVisibility>(DEFAULT_SECTION_VISIBILITY);
  const [stats, setStats] = useState<Stats>({ categories: 0, banners: 0, products: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [sectionData, cats, bans, productsRes] = await Promise.allSettled([
        getHomeSections(),
        getCategories(),
        getBanners(),
        goApi.get("/api/products"),
      ]);

      if (sectionData.status === "fulfilled") setSections(sectionData.value);
      if (cats.status === "fulfilled") setStats((s) => ({ ...s, categories: cats.value.length }));
      if (bans.status === "fulfilled") setStats((s) => ({ ...s, banners: bans.value.length }));
      if (productsRes.status === "fulfilled") {
        const data = productsRes.value.data;
        const count = Array.isArray(data?.data) ? data.data.length : Array.isArray(data) ? data.length : 0;
        setStats((s) => ({ ...s, products: count }));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggle = (key: keyof SectionVisibility) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaveStatus("idle");
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus("idle");
    try {
      await updateHomeSections(sections);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch {
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const sectionKeys = Object.keys(SECTION_LABELS) as (keyof SectionVisibility)[];
  const enabledCount = sectionKeys.filter((k) => sections[k]).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">แดชบอร์ด Admin</h1>
        <p className="mt-1 text-sm text-(--muted)">จัดการระบบและควบคุมการแสดงผลหน้าหลัก</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "หมวดหมู่", value: stats.categories, color: "text-blue-600 dark:text-blue-400" },
          { label: "Banner", value: stats.banners, color: "text-amber-600 dark:text-amber-400" },
          { label: "Product", value: stats.products, color: "text-violet-600 dark:text-violet-400" },
          { label: "Sections เปิด", value: enabledCount, color: "text-emerald-600 dark:text-emerald-400" },
        ].map((stat) => (
          <div key={stat.label} className="glass-panel rounded-2xl p-4">
            {loading ? (
              <div className="h-8 w-12 animate-pulse rounded bg-(--border)" />
            ) : (
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            )}
            <p className="mt-1 text-xs text-(--muted)">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="glass-panel rounded-2xl p-4">
        <h2 className="text-sm font-semibold text-foreground mb-3">ไปยังหน้าจัดการ</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_LINKS.map(({ href, icon: Icon, label, color, iconBg }) => (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl ${color} hover:scale-105 transition-transform duration-150`}
            >
              <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Section Visibility */}
      <div className="glass-panel rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">ควบคุมการแสดง Section</h2>
            <p className="text-xs text-(--muted) mt-0.5">เปิด/ปิดส่วนต่างๆ ที่แสดงในหน้าหลัก</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-(--border)/50 text-(--muted) transition-colors"
              title="รีเฟรช"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-(--primary) text-white text-sm font-semibold hover:bg-(--primary)/90 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </div>
        </div>

        {saveStatus === "success" && (
          <div className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm">
            ✓ บันทึกการตั้งค่าเรียบร้อยแล้ว
          </div>
        )}
        {saveStatus === "error" && (
          <div className="px-4 py-2 rounded-lg bg-red-500/10 text-red-700 dark:text-red-400 text-sm">
            ✕ เกิดข้อผิดพลาด กรุณาลองใหม่
          </div>
        )}

        <div className="divide-y divide-(--border)">
          {sectionKeys.map((key) => {
            const isEnabled = sections[key];
            return (
              <div key={key} className="flex items-center justify-between py-3">
                <span className="text-sm text-foreground">{SECTION_LABELS[key]}</span>
                <button
                  onClick={() => handleToggle(key)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isEnabled
                      ? "bg-(--primary)/10 text-(--primary) hover:bg-(--primary)/20"
                      : "bg-(--border)/50 text-(--muted) hover:bg-(--border)"
                  }`}
                >
                  {isEnabled ? (
                    <ToggleRight className="w-5 h-5" />
                  ) : (
                    <ToggleLeft className="w-5 h-5" />
                  )}
                  {isEnabled ? "เปิด" : "ปิด"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
