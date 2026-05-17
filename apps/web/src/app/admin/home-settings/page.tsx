"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { Modal, ModalType } from "@/components/ui/Modal";
import { LoadingFallback } from "@/components/ui/LoadingFallback";
import { SectionEditor, renderFields, ContentField } from "@/components/admin/homeSettings";
import { withAuthentication } from "@/hoc";
import { useUnauthorizedHandler } from "@/hooks/useUnauthorizedHandler";
import * as homeSettingsService from "@/services/homeSettings";
import type { HomeSettings } from "@/services/homeSettings";
import { SECTION_METADATA } from "@/services/homeSettings";
import { ChevronLeft, Save, Eye } from "lucide-react";

function HomeSettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showModal: showUnauthorizedModal, errorMessage: unauthorizedError, handleModalClose } = useUnauthorizedHandler();
  
  const [settings, setSettings] = useState<HomeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    const sectionParam = searchParams.get("section");
    if (sectionParam) {
      const idx = SECTION_METADATA.findIndex((s) => s.key === sectionParam);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: ModalType;
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await homeSettingsService.getHomeSettings();
        setSettings(data);
      } catch (error) {
        console.error("Error fetching home settings:", error);
        setModal({
          isOpen: true,
          type: "error",
          title: "เกิดข้อผิดพลาด",
          message: "ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Save settings
  const handleSave = async () => {
    setShowSaveConfirm(false);
    if (!settings) return;

    try {
      setSaving(true);
      console.log('Saving settings:', JSON.stringify({
        faq_enabled: settings.faq?.enabled,
        hero_enabled: settings.hero?.enabled,
      }, null, 2));
      await homeSettingsService.updateHomeSettings(settings);
      setModal({
        isOpen: true,
        type: "success",
        title: "บันทึกสำเร็จ",
        message: "บันทึกการตั้งค่าหน้าแรกเรียบร้อยแล้ว กรุณารอ 60 วินาทีเพื่อให้หน้าเว็บอัพเดท หรือ refresh หน้าแรก",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      setModal({
        isOpen: true,
        type: "error",
        title: "เกิดข้อผิดพลาด",
        message: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingFallback message="กำลังโหลดการตั้งค่า..." />;
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-background px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-red-800">ไม่พบข้อมูลการตั้งค่า</p>
          </div>
        </div>
      </div>
    );
  }

  const currentSection = SECTION_METADATA[activeTab];

  return (
    <main className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <header className="space-y-4">
          <Link
            href="/admin"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            กลับหน้า Dashboard
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground">จัดการหน้าแรก</h1>
              <p className="mt-2 text-muted-foreground">
                ปรับแต่งเนื้อหาและการแสดงผลของแต่ละ Section ในหน้าแรก
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => window.open("/", "_blank")}
              >
                <Eye className="h-4 w-4 mr-2" />
                ดูหน้าเว็บ
              </Button>
              <Button
                onClick={() => setShowSaveConfirm(true)}
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "กำลังบันทึก..." : "บันทึก"}
              </Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar - Section List */}
          <div className="col-span-3">
            <div className="sticky top-6 space-y-2">
              <div className="flex items-center justify-between mb-1 px-1">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sections</h3>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  {SECTION_METADATA.filter((s) => (settings[s.key] as any)?.enabled).length}/{SECTION_METADATA.length}
                </span>
              </div>
              
              <nav className="space-y-0.5">
                {SECTION_METADATA.map((section, index) => {
                  const sectionData = settings[section.key] as any;
                  const isActive = activeTab === index;
                  
                  return (
                    <button
                      key={section.key}
                      onClick={() => setActiveTab(index)}
                      className={`
                        w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all text-sm
                        ${isActive
                          ? "bg-primary/10 text-primary font-medium shadow-sm"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        }
                      `}
                    >
                      <div className={`w-2 h-2 rounded-full shrink-0 ${
                        sectionData?.enabled 
                          ? 'bg-emerald-500'
                          : 'bg-gray-400'
                      }`} />
                      <span className="truncate">{section.name}</span>
                    </button>
                  );
                })}
              </nav>

              {/* SEO Section */}
              <div className="pt-2 mt-2 border-t border-border">
                <button
                  onClick={() => setActiveTab(SECTION_METADATA.length)}
                  className={`
                    w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all text-sm
                    ${activeTab === SECTION_METADATA.length
                      ? "bg-primary/10 text-primary font-medium shadow-sm"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }
                  `}
                >
                  <span className="text-base">🔍</span>
                  <span className="truncate">SEO & Meta Tags</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content - Section Editor */}
          <div className="col-span-9">
            <div className="bg-card rounded-lg border border-border shadow-sm">
              {activeTab === SECTION_METADATA.length ? (
                <div className="p-6">
                  <SEOEditorContent settings={settings} onUpdate={setSettings} />
                </div>
              ) : (
                <div className="p-6">
                  <SectionEditorContent
                    section={currentSection}
                    settings={settings}
                    onUpdate={setSettings}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        <Modal
          isOpen={showSaveConfirm}
          onClose={() => setShowSaveConfirm(false)}
          onConfirm={handleSave}
          type="info"
          title="ยืนยันการบันทึก"
          message="คุณต้องการบันทึกการเปลี่ยนแปลงหน้าแรกหรือไม่?"
          confirmText="บันทึก"
          cancelText="ยกเลิก"
          showCancel={true}
        />

        <Modal
          isOpen={modal.isOpen}
          onClose={() => setModal({ ...modal, isOpen: false })}
          title={modal.title}
          message={modal.message}
          type={modal.type}
        />

        <Modal
          isOpen={showUnauthorizedModal}
          onClose={handleModalClose}
          type="warning"
          title="⚠️ Session หมดอายุ"
          message={unauthorizedError}
          confirmText="เข้าสู่ระบบใหม่"
        />
      </div>
    </main>
  );
}

interface SectionEditorContentProps {
  section: typeof SECTION_METADATA[number];
  settings: HomeSettings;
  onUpdate: (settings: HomeSettings) => void;
}

function SectionEditorContent({ section, settings, onUpdate }: SectionEditorContentProps) {
  const sectionData = settings[section.key] as any;
  const sectionKey = section.key;

  const updateSection = (data: any) => {
    onUpdate({
      ...settings,
      [section.key]: data,
    });
  };

  const handleFieldChange = (key: string, value: any) => {
    updateSection({
      ...sectionData,
      [key]: value,
    });
  };

  // Define fields for each section
  const getFieldsForSection = () => {
    switch (section.key) {
      case "hero":
        return [
          { key: "badge_text", label: "ข้อความแบดจ์", placeholder: "🎉 เปิดตัวใหม่!", helperText: "แบดจ์เล็กๆ ด้านบนหัวข้อ" },
          { key: "badge_icon", label: "ไอคอนแบดจ์", placeholder: "🎉", helperText: "อีโมจิหรือไอคอน" },
          { key: "title_highlight", label: "ส่วนเน้นของหัวข้อ", placeholder: "NFC Gift Cards", required: true, helperText: "คำที่ต้องการเน้น (สีต่าง)" },
          { key: "title_rest", label: "ส่วนที่เหลือของหัวข้อ", placeholder: "ที่ทำให้คุณโดดเด่น", helperText: "ส่วนหลังของหัวข้อ" },
          { key: "subtitle", label: "คำบรรยาย", placeholder: "ส่งความทรงจำที่มีค่าด้วยเทคโนโลยี NFC", multiline: true, helperText: "อธิบายสั้นๆ ใต้หัวข้อ" },
          { key: "feature_1", label: "คุณสมบัติ 1", placeholder: "✓ ไม่ต้องติดตั้งแอพ" },
          { key: "feature_2", label: "คุณสมบัติ 2", placeholder: "✓ ใช้งานง่าย แค่แตะ" },
          { key: "feature_3", label: "คุณสมบัติ 3", placeholder: "✓ ปลอดภัย รวดเร็ว" },
          { key: "cta_primary", label: "ปุ่ม CTA หลัก", placeholder: "สั่งของขวัญด่วน", helperText: "ข้อความบนปุ่มหลัก" },
          { key: "cta_secondary", label: "ปุ่ม CTA รอง", placeholder: "Squad 7-10 คน", helperText: "ข้อความบนปุ่มรอง" },
          { key: "cta_tertiary", label: "ลิงก์ CTA", placeholder: "ดูตัวอย่างของขวัญ", helperText: "ข้อความบนลิงก์" },
        ];
      
      case "what_is_it":
        return [
          { key: "title", label: "หัวข้อ", placeholder: "NFC Gift Card คืออะไร?", required: true },
          { key: "subtitle", label: "หัวข้อย่อย", placeholder: "เทคโนโลยีที่เปลี่ยนวิธีการส่งของขวัญ" },
          { key: "feature_1_title", label: "คุณสมบัติ 1 - หัวข้อ", placeholder: "แตะเดียวเปิดได้เลย" },
          { key: "feature_1_description", label: "คุณสมบัติ 1 - คำอธิบาย", placeholder: "ไม่ต้องพิมพ์ URL ไม่ต้องสแกน QR", multiline: true },
          { key: "feature_2_title", label: "คุณสมบัติ 2 - หัวข้อ", placeholder: "เก็บวิดีโอและข้อความ" },
          { key: "feature_2_description", label: "คุณสมบัติ 2 - คำอธิบาย", placeholder: "อัปโหลดคลิปวิดีโอ รูปภาพ", multiline: true },
          { key: "feature_3_title", label: "คุณสมบัติ 3 - หัวข้อ", placeholder: "ของขวัญที่เก็บไว้ได้นาน" },
          { key: "feature_3_description", label: "คุณสมบัติ 3 - คำอธิบาย", placeholder: "การ์ดที่มีความหมาย เปิดดูซ้ำได้เรื่อยๆ", multiline: true },
        ];
      
      case "sku":
        return (
          <div>
            <div className="mb-6 space-y-4">
              {renderFields(sectionData, [
                { key: "title", label: "หัวข้อ", placeholder: "เลือกสินค้าที่เหมาะกับคุณ", required: true },
                { key: "subtitle", label: "หัวข้อย่อย", placeholder: "แพ็กเกจที่เหมาะกับทุกความต้องการ" },
                { key: "card_title", label: "ชื่อหมวดสินค้า", placeholder: "สินค้าของเรา", helperText: "หัวข้อหมวดสินค้า" },
                { key: "card_1_label", label: "ชื่อการ์ด 1", placeholder: "Express Card", helperText: "ชื่อการ์ดแรก" },
                { key: "card_2_label", label: "ชื่อการ์ด 2", placeholder: "Squad Card", helperText: "ชื่อการ์ดที่สอง" },
                { key: "card_3_label", label: "ชื่อการ์ด 3", placeholder: "Greeting Card", helperText: "ชื่อการ์ดที่สาม" },
              ], updateSection)}
            </div>
            
            <Accordion>
              {/* Express Card */}
              <AccordionItem title={`⚡ ${sectionData.card_1_label || "Express Card"}`} defaultOpen={true}>
                <div className="space-y-4">
                  {renderFields(sectionData, [
                    { key: "express_enabled", label: "เปิดใช้งาน Express", type: "checkbox" },
                    { key: "express_badge_text", label: "ข้อความบน Badge", placeholder: "เร็วสุด" },
                    { key: "express_badge_icon", label: "ไอคอน Badge", placeholder: "zap", helperText: "zap, users, sparkles, heart, credit" },
                    { key: "express_badge_color", label: "สี Badge", placeholder: "primary", helperText: "primary, gradient, amber" },
                    { key: "express_emoji", label: "Emoji", placeholder: "⚡" },
                    { key: "express_name", label: "ชื่อการ์ด", placeholder: "GyByte Express" },
                    { key: "express_tagline", label: "Tagline", placeholder: "⭐ ตัวเลือกยอดนิยม — ของขวัญเร็ว ใช้ได้เลย" },
                    { key: "express_description", label: "คำอธิบาย", placeholder: "ส่งต่อความทรงจำด่วน ใช้งานทันที ไม่ต้องรอ", multiline: true },
                    { key: "express_feature_1", label: "คุณสมบัติ 1", placeholder: "ใช้งานได้ทันทีหลังสั่ง" },
                    { key: "express_feature_2", label: "คุณสมบัติ 2", placeholder: "ส่งด่วนพิเศษ 1-2 วันถึง" },
                    { key: "express_feature_3", label: "คุณสมบัติ 3", placeholder: "รวมการ์ดพรีเมียมใบเดียว" },
                    { key: "express_feature_4", label: "คุณสมบัติ 4", placeholder: "รองรับ NFC + QR ไม่มีปัญหา" },
                    { key: "express_button_text", label: "ข้อความปุ่ม", placeholder: "สั่งของขวัญด่วน Express" },
                    { key: "express_button_link", label: "ลิงก์ปุ่ม", placeholder: "/create" },
                    { key: "express_footer_text", label: "ข้อความท้าย", placeholder: "เริ่มต้น ฿399 / ใบ" },
                  ], updateSection)}
                </div>
              </AccordionItem>

              {/* Squad Card */}
              <AccordionItem title={`👥 ${sectionData.card_2_label || "Squad Card"}`}>
                <div className="space-y-4">
                  {renderFields(sectionData, [
                    { key: "squad_enabled", label: "เปิดใช้งาน Squad", type: "checkbox" },
                    { key: "squad_badge_text", label: "ข้อความบน Badge", placeholder: "ทำหมู่" },
                    { key: "squad_badge_icon", label: "ไอคอน Badge", placeholder: "users" },
                    { key: "squad_badge_color", label: "สี Badge", placeholder: "gradient", helperText: "primary, gradient, amber" },
                    { key: "squad_emoji", label: "Emoji", placeholder: "👥" },
                    { key: "squad_name", label: "ชื่อการ์ด", placeholder: "GyByte Squad" },
                    { key: "squad_tagline", label: "Tagline", placeholder: "🎉 สั่งพร้อมกัน ราคาหมู่คุ้มกว่า" },
                    { key: "squad_description", label: "คำอธิบาย", placeholder: "สั่งหลายใบในคราวเดียว ราคาพิเศษ", multiline: true },
                    { key: "squad_feature_1", label: "คุณสมบัติ 1", placeholder: "ลด 15% เมื่อสั่ง 5 ใบขึ้นไป" },
                    { key: "squad_feature_2", label: "คุณสมบัติ 2", placeholder: "ออกแบบให้แต่ละใบได้" },
                    { key: "squad_feature_3", label: "คุณสมบัติ 3", placeholder: "รองรับจัดส่งหลายที่อยู่" },
                    { key: "squad_feature_4", label: "คุณสมบัติ 4", placeholder: "รับการ์ดพิเศษ + ซองของขวัญ" },
                    { key: "squad_button_text", label: "ข้อความปุ่ม", placeholder: "สั่งกลุ่ม Squad" },
                    { key: "squad_button_link", label: "ลิงก์ปุ่ม", placeholder: "/create?type=squad" },
                    { key: "squad_footer_text", label: "ข้อความท้าย", placeholder: "เริ่มต้น ฿339 / ใบ (5 ใบขึ้นไป)" },
                  ], updateSection)}
                </div>
              </AccordionItem>

              {/* Greeting Card */}
              <AccordionItem title={`💌 ${sectionData.card_3_label || "Greeting Card"}`}>
                <div className="space-y-4">
                  {renderFields(sectionData, [
                    { key: "greeting_enabled", label: "เปิดใช้งาน Greeting", type: "checkbox" },
                    { key: "greeting_badge_text", label: "ข้อความบน Badge", placeholder: "เริ่มต้นเบาๆ" },
                    { key: "greeting_badge_icon", label: "ไอคอน Badge", placeholder: "sparkles" },
                    { key: "greeting_badge_color", label: "สี Badge", placeholder: "amber", helperText: "primary, gradient, amber" },
                    { key: "greeting_emoji", label: "Emoji", placeholder: "💌" },
                    { key: "greeting_name", label: "ชื่อการ์ด", placeholder: "GyByte Greeting" },
                    { key: "greeting_tagline", label: "Tagline", placeholder: "💕 ใส่ใจแบบง่ายๆ แต่เต็มไปด้วยความหมาย" },
                    { key: "greeting_description", label: "คำอธิบาย", placeholder: "เริ่มต้นส่งความรู้สึกง่ายๆ ด้วยการ์ดเบสิก", multiline: true },
                    { key: "greeting_feature_1", label: "คุณสมบัติ 1", placeholder: "การ์ดเบสิกพร้อม NFC" },
                    { key: "greeting_feature_2", label: "คุณสมบัติ 2", placeholder: "รองรับวิดีโอและข้อความ" },
                    { key: "greeting_feature_3", label: "คุณสมบัติ 3", placeholder: "มี QR Code สำรอง" },
                    { key: "greeting_feature_4", label: "คุณสมบัติ 4", placeholder: "จัดส่งมาตรฐาน 3-5 วัน" },
                    { key: "greeting_button_text", label: "ข้อความปุ่ม", placeholder: "เลือก Greeting เบสิก" },
                    { key: "greeting_button_link", label: "ลิงก์ปุ่ม", placeholder: "/create?type=greeting" },
                    { key: "greeting_footer_text", label: "ข้อความท้าย", placeholder: "เริ่มต้น ฿249 / ใบ" },
                  ], updateSection)}
                </div>
              </AccordionItem>
            </Accordion>
          </div>
        );
      
      case "how_it_works":
        return [
          { key: "title", label: "หัวข้อ", placeholder: "ใช้งานง่ายเพียง 3 ขั้นตอน", required: true },
          { key: "subtitle", label: "หัวข้อย่อย", placeholder: "เริ่มส่งความสุขได้ทันที" },
          { key: "step_1_title", label: "ขั้นตอนที่ 1 - หัวข้อ", placeholder: "1. เลือกบัตรที่ชอบ" },
          { key: "step_1_description", label: "ขั้นตอนที่ 1 - คำอธิบาย", placeholder: "เลือกดีไซน์บัตรที่เหมาะกับโอกาส", multiline: true, helperText: "อธิบายขั้นตอนแรก" },
          { key: "step_2_title", label: "ขั้นตอนที่ 2 - หัวข้อ", placeholder: "2. ปรับแต่งเนื้อหา" },
          { key: "step_2_description", label: "ขั้นตอนที่ 2 - คำอธิบาย", placeholder: "เพิ่มข้อความ รูปภาพ หรือวิดีโอ", multiline: true, helperText: "อธิบายขั้นตอนที่สอง" },
          { key: "step_3_title", label: "ขั้นตอนที่ 3 - หัวข้อ", placeholder: "3. ส่งมอบความสุข" },
          { key: "step_3_description", label: "ขั้นตอนที่ 3 - คำอธิบาย", placeholder: "แตะบัตรเพื่อแชร์ความทรงจำ", multiline: true, helperText: "อธิบายขั้นตอนสุดท้าย" },
        ];
      
      case "occasions":
        return (
          <div>
            <div className="mb-6 space-y-4">
              {renderFields(sectionData, [
                { key: "title", label: "หัวข้อ", placeholder: "เหมาะสำหรับทุกโอกาสพิเศษ", required: true },
                { key: "subtitle", label: "หัวข้อย่อย", placeholder: "มอบความสุขในทุกช่วงเวลา" },
              ], updateSection)}
            </div>
            
            <Accordion>
              {/* Occasion 1-3 */}
              <AccordionItem title="🎂 โอกาสที่ 1-3" defaultOpen={true}>
                <div className="space-y-4">
                  {renderFields(sectionData, [
                    { key: "occasion_1", label: "โอกาสที่ 1", placeholder: "วันเกิด" },
                    { key: "occasion_1_icon", label: "ไอคอนที่ 1", placeholder: "cake", helperText: "cake, heart, sparkles, graduationcap, gift, users, star, zap, crown, trophy" },
                    { key: "occasion_2", label: "โอกาสที่ 2", placeholder: "วันครบรอบ" },
                    { key: "occasion_2_icon", label: "ไอคอนที่ 2", placeholder: "heart" },
                    { key: "occasion_3", label: "โอกาสที่ 3", placeholder: "งานแต่งงาน" },
                    { key: "occasion_3_icon", label: "ไอคอนที่ 3", placeholder: "sparkles" },
                  ], updateSection)}
                </div>
              </AccordionItem>

              {/* Occasion 4-6 */}
              <AccordionItem title="🎓 โอกาสที่ 4-6">
                <div className="space-y-4">
                  {renderFields(sectionData, [
                    { key: "occasion_4", label: "โอกาสที่ 4", placeholder: "รับปริญญา" },
                    { key: "occasion_4_icon", label: "ไอคอนที่ 4", placeholder: "graduationcap" },
                    { key: "occasion_5", label: "โอกาสที่ 5", placeholder: "เซอร์ไพรส์แฟน" },
                    { key: "occasion_5_icon", label: "ไอคอนที่ 5", placeholder: "gift" },
                    { key: "occasion_6", label: "โอกาสที่ 6", placeholder: "ขอบคุณลูกค้า" },
                    { key: "occasion_6_icon", label: "ไอคอนที่ 6", placeholder: "users" },
                  ], updateSection)}
                </div>
              </AccordionItem>

              {/* Occasion 7-9 */}
              <AccordionItem title="✨ โอกาสที่ 7-9 (ถ้ามี)">
                <div className="space-y-4">
                  {renderFields(sectionData, [
                    { key: "occasion_7", label: "โอกาสที่ 7", placeholder: "" },
                    { key: "occasion_7_icon", label: "ไอคอนที่ 7", placeholder: "" },
                    { key: "occasion_8", label: "โอกาสที่ 8", placeholder: "" },
                    { key: "occasion_8_icon", label: "ไอคอนที่ 8", placeholder: "" },
                    { key: "occasion_9", label: "โอกาสที่ 9", placeholder: "" },
                    { key: "occasion_9_icon", label: "ไอคอนที่ 9", placeholder: "" },
                  ], updateSection)}
                </div>
              </AccordionItem>
            </Accordion>
          </div>
        );
      
      case "why_nfc":
        return [
          { key: "title", label: "หัวข้อ", required: true },
          { key: "subtitle", label: "หัวข้อย่อย" },
          { key: "benefit_1_title", label: "ประโยชน์ 1 - หัวข้อ" },
          { key: "benefit_1_description", label: "ประโยชน์ 1 - คำอธิบาย", multiline: true },
          { key: "benefit_2_title", label: "ประโยชน์ 2 - หัวข้อ" },
          { key: "benefit_2_description", label: "ประโยชน์ 2 - คำอธิบาย", multiline: true },
          { key: "benefit_3_title", label: "ประโยชน์ 3 - หัวข้อ" },
          { key: "benefit_3_description", label: "ประโยชน์ 3 - คำอธิบาย", multiline: true },
          { key: "benefit_4_title", label: "ประโยชน์ 4 - หัวข้อ" },
          { key: "benefit_4_description", label: "ประโยชน์ 4 - คำอธิบาย", multiline: true },
        ];
      
      case "why_us":
        return [
          { key: "title", label: "หัวข้อ", required: true },
          { key: "subtitle", label: "หัวข้อย่อย" },
          { key: "feature_1_title", label: "จุดเด่น 1 - หัวข้อ" },
          { key: "feature_1_description", label: "จุดเด่น 1 - คำอธิบาย", multiline: true },
          { key: "feature_2_title", label: "จุดเด่น 2 - หัวข้อ" },
          { key: "feature_2_description", label: "จุดเด่น 2 - คำอธิบาย", multiline: true },
          { key: "feature_3_title", label: "จุดเด่น 3 - หัวข้อ" },
          { key: "feature_3_description", label: "จุดเด่น 3 - คำอธิบาย", multiline: true },
        ];
      
      case "preview":
        return [
          { key: "title", label: "หัวข้อ", placeholder: "ตัวอย่างการใช้งาน", required: true },
          { key: "subtitle", label: "หัวข้อย่อย", placeholder: "ดูว่าจะเป็นอย่างไร" },
          { key: "description", label: "คำอธิบาย", placeholder: "ลองดูตัวอย่างการใช้งานจริง", multiline: true, helperText: "อธิบายส่วน Preview" },
        ];
      
      case "faq":
        return [
          { key: "title", label: "หัวข้อ", placeholder: "คำถามที่พบบ่อย", required: true },
          { key: "subtitle", label: "หัวข้อย่อย", placeholder: "ทุกอย่างที่คุณอยากรู้" },
          { key: "faq_1_question", label: "คำถามที่ 1", placeholder: "มือถือต้องมี NFC ถึงจะใช้ได้หรือไม่?", helperText: "คำถามแรก" },
          { key: "faq_1_answer", label: "คำตอบที่ 1", placeholder: "ไม่จำเป็น! ถ้ามือถือไม่มี NFC ก็ยังสแกน QR Code ได้", multiline: true, rows: 2, helperText: "คำตอบสำหรับคำถามแรก" },
          { key: "faq_2_question", label: "คำถามที่ 2", placeholder: "ไฟล์วิดีโอจะเก็บไว้ที่ไหน?" },
          { key: "faq_2_answer", label: "คำตอบที่ 2", placeholder: "วิดีโอจะอยู่ใน Google Drive ของคุณเอง", multiline: true, rows: 2 },
          { key: "faq_3_question", label: "คำถามที่ 3", placeholder: "สามารถเปลี่ยนวิดีโอทีหลังได้ไหม?" },
          { key: "faq_3_answer", label: "คำตอบที่ 3", placeholder: "ได้ครับ! คุณสามารถเปลี่ยนลิงก์ได้ตลอดเวลา", multiline: true, rows: 2 },
          { key: "faq_4_question", label: "คำถามที่ 4", placeholder: "การ์ดใช้ได้นานแค่ไหน?" },
          { key: "faq_4_answer", label: "คำตอบที่ 4", placeholder: "การ์ด NFC ใช้ได้ถาวร ไม่มีวันหมดอายุ", multiline: true, rows: 2 },
        ];
      
      case "final_cta":
        return [
          { key: "title", label: "หัวข้อ", placeholder: "พร้อมสร้างของขวัญพิเศษแล้วหรือยัง?", required: true },
          { key: "subtitle", label: "หัวข้อย่อย", placeholder: "เริ่มต้นส่งความทรงจำที่น่าประทับใจวันนี้" },
          { key: "button_text", label: "ข้อความบนปุ่ม", placeholder: "สั่งของขวัญเลย", helperText: "ข้อความที่แสดงบนปุ่ม CTA" },
        ];

      default:
        return [];
    }
  };

  return (
    <SectionEditor
      sectionName={section.name}
      description={section.description}
      sectionData={sectionData}
      onUpdate={updateSection}
    >
      {typeof getFieldsForSection() === 'object' && 'type' in getFieldsForSection() 
        ? getFieldsForSection()
        : renderFields(sectionData, getFieldsForSection(), updateSection)
      }
    </SectionEditor>
  );
}

// SEO Editor Component
interface SEOEditorContentProps {
  settings: HomeSettings;
  onUpdate: (settings: HomeSettings) => void;
}

function SEOEditorContent({ settings, onUpdate }: SEOEditorContentProps) {
  const updateMeta = (key: string, value: string) => {
    onUpdate({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔍</span>
          <h2 className="text-2xl font-bold text-foreground">SEO & Meta Tags</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          ตั้งค่า Meta Tags สำหรับการแสดงผลในผลการค้นหาและโซเชียลมีเดีย
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-muted/30 rounded-lg border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <span>📄</span> Basic SEO
          </h3>
          <div className="space-y-4">
            <ContentField
              label="Meta Title"
              value={settings.meta_title || ""}
              onChange={(value: string) => updateMeta("meta_title", value)}
              placeholder="หน้าแรก | NFC Gift Cards"
              helperText="ความยาวแนะนำ: 50-60 ตัวอักษร"
              required
            />
            <ContentField
              label="Meta Description"
              value={settings.meta_description || ""}
              onChange={(value: string) => updateMeta("meta_description", value)}
              placeholder="ส่งความทรงจำที่มีค่าด้วยบัตรของขวัญ NFC..."
              multiline
              rows={3}
              helperText="ความยาวแนะนำ: 150-160 ตัวอักษร"
              required
            />
          </div>
        </div>

        <div className="p-4 bg-muted/30 rounded-lg border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <span>🌐</span> Open Graph (Facebook, LinkedIn)
          </h3>
          <div className="space-y-4">
            <ContentField
              label="OG Title"
              value={settings.og_title || ""}
              onChange={(value: string) => updateMeta("og_title", value)}
              placeholder="NFC Gift Cards - บัตรของขวัญยุคใหม่"
              helperText="หัวข้อที่แสดงเมื่อแชร์บนโซเชียล (ถ้าไม่ระบุจะใช้ Meta Title)"
            />
            <ContentField
              label="OG Description"
              value={settings.og_description || ""}
              onChange={(value: string) => updateMeta("og_description", value)}
              placeholder="ส่งความทรงจำที่มีค่าด้วยเทคโนโลยี NFC..."
              multiline
              rows={2}
              helperText="คำอธิบายที่แสดงเมื่อแชร์บนโซเชียล"
            />
            <ContentField
              label="OG Image URL"
              value={settings.og_image || ""}
              onChange={(value: string) => updateMeta("og_image", value)}
              placeholder="https://example.com/og-image.jpg"
              helperText="URL รูปภาพที่แสดงเมื่อแชร์ (แนะนำขนาด 1200x630px)"
            />
          </div>
        </div>

        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 <strong>เคล็ดลับ:</strong> Meta Tags ที่ดีช่วยเพิ่ม Click-through Rate (CTR) 
            และทำให้เว็บไซต์ของคุณดูน่าสนใจมากขึ้นในผลการค้นหา
          </p>
        </div>
      </div>
    </div>
  );
}

export default withAuthentication(HomeSettingsPage);
