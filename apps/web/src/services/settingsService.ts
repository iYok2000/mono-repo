import { goApi } from "@/lib/axios";

export interface SectionVisibility {
  hero: boolean;
  what_is_it: boolean;
  sku: boolean;
  how_it_works: boolean;
  occasions: boolean;
  why_nfc: boolean;
  why_us: boolean;
  preview: boolean;
  faq: boolean;
  final_cta: boolean;
}

export const DEFAULT_SECTION_VISIBILITY: SectionVisibility = {
  hero: true,
  what_is_it: true,
  sku: true,
  how_it_works: true,
  occasions: true,
  why_nfc: true,
  why_us: true,
  preview: true,
  faq: true,
  final_cta: true,
};

export const SECTION_LABELS: Record<keyof SectionVisibility, string> = {
  hero: "🎯 Hero — ส่วนแนะนำหลัก",
  what_is_it: "💡 What Is It — อธิบายผลิตภัณฑ์",
  sku: "📦 SKU — ตัวเลือกแพ็กเกจ",
  how_it_works: "⚙️ How It Works — วิธีการทำงาน",
  occasions: "🎉 Occasions — โอกาสพิเศษ",
  why_nfc: "📡 Why NFC — เหตุผลที่เลือก NFC",
  why_us: "⭐ Why Us — จุดเด่นของเรา",
  preview: "🖼️ Preview — ตัวอย่างการ์ด",
  faq: "❓ FAQ — คำถามที่พบบ่อย",
  final_cta: "🚀 Final CTA — ปุ่มสั่งซื้อ",
};

export const getHomeSections = async (): Promise<SectionVisibility> => {
  try {
    const res = await goApi.get<{ sections: SectionVisibility }>(
      "/api/settings/home-sections"
    );
    return { ...DEFAULT_SECTION_VISIBILITY, ...res.data.sections };
  } catch {
    return DEFAULT_SECTION_VISIBILITY;
  }
};

export const updateHomeSections = async (
  sections: SectionVisibility
): Promise<SectionVisibility> => {
  const res = await goApi.put<{ sections: SectionVisibility }>(
    "/api/settings/home-sections",
    { sections }
  );
  return res.data.sections;
};
