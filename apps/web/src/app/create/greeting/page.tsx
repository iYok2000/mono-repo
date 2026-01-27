"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Mail, Phone, Globe, MapPin, MessageCircle, Instagram, Zap, Facebook, Linkedin } from "lucide-react";

interface BusinessCardData {
  name: string;
  nameEn?: string;
  position: string;
  positionEn?: string;
  company: string;
  logo?: string;
  themeColor: string;
  email: string;
  phone: string;
  website: string;
  lineId: string;
  instagram: string;
  facebook: string;
  linkedin: string;
}

export default function CreateGreetingPage() {
  const router = useRouter();
  const [copySuccess, setCopySuccess] = useState(false);

  const [formData, setFormData] = useState<BusinessCardData>({
    name: "สมชาย ศรีสมบัติ",
    nameEn: "Somchai Srisombat",
    position: "Business Development Manager",
    positionEn: "Business Development Manager",
    company: "GyByte Technology Co., Ltd.",
    logo: "",
    themeColor: "#10B981",
    email: "somchai@gybyte.com",
    phone: "+66 8 1234 5678",
    website: "gybyte.co",
    lineId: "@gybyte_somchai",
    instagram: "@gybyte.somchai",
    facebook: "",
    linkedin: "",
  });

  const handleChange = (field: keyof BusinessCardData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateShareableLink = () => {
    // Map to short keys and filter empty values
    const shortData: Record<string, string> = {};
    if (formData.name) shortData.n = formData.name;
    if (formData.position) shortData.p = formData.position;
    if (formData.company) shortData.c = formData.company;
    if (formData.email) shortData.e = formData.email;
    if (formData.phone) shortData.ph = formData.phone;
    if (formData.website) shortData.w = formData.website;
    if (formData.lineId) shortData.l = formData.lineId;
    if (formData.instagram) shortData.i = formData.instagram;
    if (formData.facebook) shortData.f = formData.facebook;
    if (formData.linkedin) shortData.ln = formData.linkedin;
    if (formData.themeColor) shortData.t = formData.themeColor;
    if (formData.logo) shortData.lg = formData.logo;
    
    // Convert to JSON and base64 encode (UTF-8 safe + URL safe)
    const jsonString = JSON.stringify(shortData);
    const utf8Bytes = new TextEncoder().encode(jsonString);
    let base64Data = btoa(String.fromCharCode(...utf8Bytes));
    // Make URL-safe by replacing +/= with -_~
    base64Data = base64Data.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '~');
    
    const url = `${window.location.origin}/card/${base64Data}`;
    navigator.clipboard.writeText(url);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Main Content */}
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Form */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                กรอกข้อมูลนามบัตร
              </h2>
              <p className="text-[var(--muted)]">
                ข้อมูลที่คุณกรอกจะแสดงบนนามบัตรดิจิทัลแบบเรียลไทม์
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">
                  ชื่อ-นามสกุล (ภาษาไทย) *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--focus-ring)] outline-none transition-all"
                  placeholder="สมชาย ศรีสมบัติ"
                />
              </div>

              {/* Name EN (optional) */}
              <div>
                <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">
                  ชื่อ-นามสกุล (English)
                  <span className="text-[var(--subtle)] font-normal ml-1">(ไม่บังคับ)</span>
                </label>
                <input
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) => handleChange("nameEn", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--focus-ring)] outline-none transition-all"
                  placeholder="Somchai Srisombat"
                />
              </div>

              {/* Position */}
              <div>
                <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">
                  ตำแหน่ง / Position *
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleChange("position", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--focus-ring)] outline-none transition-all"
                  placeholder="Business Development Manager"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">
                  บริษัท / Company
                  <span className="text-[var(--subtle)] font-normal ml-1">(ไม่บังคับ)</span>
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--focus-ring)] outline-none transition-all"
                  placeholder="GyByte Technology Co., Ltd."
                />
              </div>

              {/* Company Logo */}
              <div>
                <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">
                  โลโก้บริษัท (URL)
                  <span className="text-[var(--subtle)] font-normal ml-1">(ไม่บังคับ)</span>
                </label>
                <input
                  type="text"
                  value={formData.logo}
                  onChange={(e) => handleChange("logo", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--focus-ring)] outline-none transition-all"
                  placeholder="https://example.com/logo.png"
                />
                <p className="text-xs text-[var(--subtle)] mt-1.5">
                  ใส่ URL ของโลโก้บริษัท (ขนาดแนะนำ: 200x200px)
                </p>
              </div>

              {/* Theme Color */}
              <div>
                <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">
                  สีธีมนามบัตร
                </label>
                <div className="flex gap-3 items-center">
                  <div className="relative">
                    <input
                      type="color"
                      value={formData.themeColor}
                      onChange={(e) => handleChange("themeColor", e.target.value)}
                      className="w-16 h-12 rounded-xl border-2 border-[var(--border)] cursor-pointer"
                    />
                  </div>
                  <input
                    type="text"
                    value={formData.themeColor}
                    onChange={(e) => handleChange("themeColor", e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--focus-ring)] outline-none transition-all font-mono text-sm"
                    placeholder="#10B981"
                    pattern="^#[0-9A-Fa-f]{6}$"
                  />
                </div>
                <p className="text-xs text-[var(--subtle)] mt-1.5">
                  คลิกที่สี่เหลี่ยมเพื่อเลือกสี หรือใส่รหัสสี (เช่น #10B981)
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">
                  อีเมล *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--focus-ring)] outline-none transition-all"
                  placeholder="somchai@gybyte.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">
                  เบอร์โทรศัพท์ *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--focus-ring)] outline-none transition-all"
                  placeholder="+66 8 1234 5678"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">
                  เว็บไซต์
                  <span className="text-[var(--subtle)] font-normal ml-1">(ไม่บังคับ)</span>
                </label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--focus-ring)] outline-none transition-all"
                  placeholder="gybyte.co"
                />
              </div>

              {/* LINE ID */}
              <div>
                <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">
                  LINE ID
                  <span className="text-[var(--subtle)] font-normal ml-1">(ไม่บังคับ)</span>
                </label>
                <input
                  type="text"
                  value={formData.lineId}
                  onChange={(e) => handleChange("lineId", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--focus-ring)] outline-none transition-all"
                  placeholder="@gybyte_somchai"
                />
              </div>

              {/* Instagram */}
              <div>
                <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">
                  Instagram
                  <span className="text-[var(--subtle)] font-normal ml-1">(ไม่บังคับ)</span>
                </label>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => handleChange("instagram", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--focus-ring)] outline-none transition-all"
                  placeholder="@gybyte.somchai"
                />
              </div>

              {/* Facebook */}
              <div>
                <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">
                  Facebook
                  <span className="text-[var(--subtle)] font-normal ml-1">(ไม่บังคับ)</span>
                </label>
                <input
                  type="text"
                  value={formData.facebook}
                  onChange={(e) => handleChange("facebook", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--focus-ring)] outline-none transition-all"
                  placeholder="facebook.com/gybyte.somchai"
                />
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">
                  LinkedIn
                  <span className="text-[var(--subtle)] font-normal ml-1">(ไม่บังคับ)</span>
                </label>
                <input
                  type="text"
                  value={formData.linkedin}
                  onChange={(e) => handleChange("linkedin", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--focus-ring)] outline-none transition-all"
                  placeholder="linkedin.com/in/somchai-s"
                />
              </div>
            </div>

            {/* Mobile CTA */}
            <div className="lg:hidden pt-4 space-y-3">
              <Button variant="primary" fullWidth>
                บันทึก & สั่งซื้อ
              </Button>
              <Button 
                variant="secondary" 
                fullWidth 
                onClick={generateShareableLink}
              >
                {copySuccess ? '✓ คัดลอกลิงก์แล้ว!' : 'คัดลอกลิงก์แชร์'}
              </Button>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-[var(--foreground)] mb-1">
                ตัวอย่างนามบัตร
              </h2>
              <p className="text-sm text-[var(--muted)]">
                แสดงในรูปแบบ Mobile (Portrait)
              </p>
            </div>

            {/* Mobile Preview - Always visible */}
            <MobileBusinessCard data={formData} />
            
            {/* Desktop Copy Link Button */}
            <div className="hidden lg:block mt-4">
              <Button 
                variant="secondary" 
                fullWidth 
                onClick={generateShareableLink}
              >
                {copySuccess ? '✓ คัดลอกลิงก์แล้ว!' : 'คัดลอกลิงก์แชร์'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mobile Business Card Component (Portrait)
function MobileBusinessCard({ data }: { data: BusinessCardData }) {
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-lg">
        {/* Header Strip with theme color */}
        <div 
          className="h-2"
          style={{ 
            background: `linear-gradient(to right, ${data.themeColor}, ${data.themeColor}dd)` 
          }}
        ></div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Company Logo - Top Right */}
          {data.logo && (
            <div className="flex justify-end">
              <div className="w-16 h-16 flex items-center justify-center">
                <img 
                  src={data.logo} 
                  alt="Company Logo" 
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          {/* Profile Section */}
          <div>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">{data.name || "ชื่อ-นามสกุล"}</h2>
            <p 
              className="text-[15px] font-semibold"
              style={{ color: data.themeColor }}
            >
              {data.position || "ตำแหน่ง"}
            </p>
            {data.company && (
              <p className="text-[13px] text-[var(--muted)] mt-1">{data.company}</p>
            )}
          </div>

          {/* Contact Info (with icons) */}
          <div className="space-y-3.5 text-[14px]">
            {data.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0" style={{ color: data.themeColor }} />
                <span className="text-[var(--muted)]">{data.email}</span>
              </div>
            )}

            {data.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0" style={{ color: data.themeColor }} />
                <span className="text-[var(--muted)]">{data.phone}</span>
              </div>
            )}

            {data.website && (
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 flex-shrink-0" style={{ color: data.themeColor }} />
                <span className="font-medium" style={{ color: data.themeColor }}>{data.website}</span>
              </div>
            )}

            {data.address && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: data.themeColor }} />
                <span className="text-[var(--muted)] text-sm">{data.address}</span>
              </div>
            )}
          </div>

          {/* Divider */}
          {(data.lineId || data.instagram || data.facebook || data.linkedin) && <div className="h-px bg-[var(--border)]"></div>}

          {/* Social Links */}
          {(data.lineId || data.instagram || data.facebook || data.linkedin) && (
            <div className="space-y-2.5">
              {data.lineId && (
                <div className="flex items-center gap-3 p-2.5 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                  <MessageCircle className="w-5 h-5 text-[#00B900]" />
                  <span className="text-[14px] text-[var(--muted)]">LINE ID: {data.lineId}</span>
                </div>
              )}

              {data.instagram && (
                <div className="flex items-center gap-3 p-2.5 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                  <Instagram className="w-5 h-5 text-[#E4405F]" />
                  <span className="text-[14px] text-[var(--muted)]">{data.instagram}</span>
                </div>
              )}

              {data.facebook && (
                <div className="flex items-center gap-3 p-2.5 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                  <Facebook className="w-5 h-5 text-[#1877F2]" />
                  <span className="text-[14px] text-[var(--muted)]">{data.facebook}</span>
                </div>
              )}

              {data.linkedin && (
                <div className="flex items-center gap-3 p-2.5 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                  <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                  <span className="text-[14px] text-[var(--muted)]">{data.linkedin}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Desktop Business Card Component (Landscape)
function DesktopBusinessCard({ data }: { data: BusinessCardData }) {
  return (
    <div className="w-full">
      <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] overflow-hidden shadow-xl">
        {/* Header Strip (Green) */}
        <div className="h-2 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)]"></div>
        
        <div className="grid grid-cols-2 gap-0">
          {/* Left Content */}
          <div className="col-span-1 p-10 border-r border-[var(--border)]">
            {/* Name & Title */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[var(--foreground)] mb-1 break-words">
                {data.name || "ชื่อ-นามสกุล"}
              </h2>
              <p className="text-[15px] text-[var(--primary)] font-semibold">
                {data.position || "ตำแหน่ง"}
              </p>
            </div>

            {/* Contact Info (Compact) */}
            <div className="space-y-2.5 text-[13px]">
              {data.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[var(--primary)]" />
                  <span className="text-[var(--muted)] truncate">{data.email}</span>
                </div>
              )}
              {data.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[var(--primary)]" />
                  <span className="text-[var(--muted)]">{data.phone}</span>
                </div>
              )}
              {data.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[var(--primary)] mt-0.5 flex-shrink-0" />
                  <span className="text-[var(--muted)] text-xs leading-relaxed">{data.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Content */}
          <div className="col-span-1 p-10 flex flex-col justify-between">
            {/* Website & Social */}
            <div>
              <p className="text-xs text-[var(--subtle)] uppercase tracking-widest mb-3">เชื่อมต่อ</p>
              <div className="space-y-2.5 text-[13px]">
                {data.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[var(--primary)]" />
                    <span className="text-[var(--primary)] font-medium">{data.website}</span>
                  </div>
                )}
                {data.lineId && (
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-[#00B900]" />
                    <span className="text-[var(--muted)] truncate">{data.lineId}</span>
                  </div>
                )}
                {data.instagram && (
                  <div className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-[#E4405F]" />
                    <span className="text-[var(--muted)] truncate">{data.instagram}</span>
                  </div>
                )}
              </div>
            </div>

            {/* QR Code */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-[var(--surface-muted)] rounded-lg border border-[var(--border)] flex items-center justify-center">
                <span className="text-xs text-[var(--subtle)]">QR</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
