#!/usr/bin/env tsx
/**
 * Initialize Home Settings with default content
 * 
 * Usage: 
 *   npm run seed:home
 *   หรือ
 *   cd apps/web && npx tsx scripts/initHomeSettings.ts
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const initialSettings = {
  hero: {
    enabled: true,
    order: 1,
    badge_text: "ของขวัญความทรงจำ • Digital Gift to Thailand",
    badge_icon: "✨",
    title_highlight: "ของขวัญวิดีโอแบบ NFC",
    title_rest: "ที่เปิดคลิปความทรงจำได้ทันที",
    subtitle: "แตะการ์ดเพียงครั้งเดียว ก็เปิดคลิป วิดีโอ หรือข้อความแทนใจได้ทันที — ของขวัญสุดพิเศษสำหรับวันเกิด ครบรอบ และทุกโอกาสที่คุณอยากให้ความทรงจำอยู่ได้นาน",
    feature_1: "มี QR สำรอง สแกนได้ทุกเครื่อง",
    feature_2: "ไฟล์อยู่ใน Google Drive ของคุณ—คุมสิทธิ์เอง",
    feature_3: "ตั้งเวลาเปิด + ใส่รหัส ได้"
  },
  what_is_it: {
    enabled: true,
    order: 2,
    title: "NFC Gift Card คืออะไร?",
    subtitle: "ความหมายที่ลึกซึ้งกว่าของขวัญทั่วไป",
    description: "NFC Gift Card คือการ์ดที่ฝังเทคโนโลยี NFC (Near Field Communication) ช่วยให้ผู้รับสามารถเข้าถึงวิดีโอ ข้อความ หรือคอนเทนต์ดิจิทัลพิเศษได้ทันทีเพียงแค่แตะการ์ด — สร้างประสบการณ์ที่ไม่มีวันลืม"
  },
  sku: {
    enabled: true,
    order: 3,
    title: "เลือกสินค้า",
    subtitle: "NFC Card หรือ NFC Sticker",
    card_title: "สินค้าของเรา",
    nfc_card_name: "NFC Gift Card",
    nfc_card_price: "฿299",
    nfc_sticker_name: "NFC Sticker",
    nfc_sticker_price: "฿199"
  },
  how_it_works: {
    enabled: true,
    order: 4,
    title: "ใช้งานง่าย ในสามขั้นตอน",
    subtitle: "ไม่ต้องติดตั้งแอป ไม่ต้องสมัครสมาชิก",
    step_1_title: "1. สั่งและได้รับการ์ด",
    step_1_description: "สั่งการ์ดผ่านเว็บไซต์ และรับของส่งตรงถึงบ้าน",
    step_2_title: "2. อัปโหลดวิดีโอหรือข้อความ",
    step_2_description: "อัปโหลดคอนเทนต์ที่คุณต้องการแชร์ลง Google Drive",
    step_3_title: "3. แตะการ์ดเพื่อดู",
    step_3_description: "ผู้รับแค่แตะการ์ดก็เปิดคอนเทนต์ได้ทันที"
  },
  occasions: {
    enabled: true,
    order: 5,
    title: "เหมาะกับทุกโอกาส",
    subtitle: "ของขวัญที่ใช่ สำหรับทุกช่วงเวลาพิเศษ",
    occasion_1: "วันเกิด",
    occasion_2: "วันครบรอบ",
    occasion_3: "วันวาเลนไทน์",
    occasion_4: "วันแม่ วันพ่อ",
    occasion_5: "งานแต่งงาน",
    occasion_6: "ของขวัญปีใหม่"
  },
  why_nfc: {
    enabled: true,
    order: 6,
    title: "ทำไมต้อง NFC?",
    subtitle: "เทคโนโลยีที่ทำให้การให้ของขวัญสนุกและง่ายขึ้น",
    benefit_1_title: "แตะเดียวเข้าถึงได้",
    benefit_1_description: "ไม่ต้องพิมพ์ URL หรือสแกน QR Code ให้ยุ่งยาก",
    benefit_2_title: "ใช้งานได้ทุกมือถือ",
    benefit_2_description: "รองรับทั้ง iPhone และ Android ที่มี NFC",
    benefit_3_title: "ปลอดภัยและเป็นส่วนตัว",
    benefit_3_description: "ข้อมูลอยู่ใน Google Drive ของคุณ ควบคุมได้เอง",
    benefit_4_title: "ไม่มีค่าใช้จ่ายซ่อนเร้น",
    benefit_4_description: "ซื้อครั้งเดียว ใช้ได้ตลอด ไม่มีค่าบริการรายเดือน"
  },
  why_us: {
    enabled: true,
    order: 7,
    title: "ทำไมต้องเลือกเรา?",
    subtitle: "เราใส่ใจทุกรายละเอียดเพื่อประสบการณ์ที่ดีที่สุด",
    feature_1_title: "มี QR Code สำรอง",
    feature_1_description: "ถึงมือถือไม่รองรับ NFC ก็ยังสแกน QR ได้",
    feature_2_title: "ควบคุมไฟล์ได้เอง",
    feature_2_description: "ไฟล์อยู่ใน Google Drive ของคุณ แก้ไขหรือลบได้ตลอดเวลา",
    feature_3_title: "ตั้งเวลาเปิดและรหัสผ่าน",
    feature_3_description: "กำหนดเวลาเปิดเผยหรือใส่รหัสผ่านเพื่อความเซอร์ไพรส์"
  },
  preview: {
    enabled: true,
    order: 8,
    title: "ตัวอย่างการใช้งาน",
    subtitle: "ดูว่าของขวัญจะเป็นอย่างไร",
    description: "ลองดูตัวอย่างการ์ดและวิธีการใช้งานจริง"
  },
  faq: {
    enabled: true,
    order: 9,
    title: "คำถามที่พบบ่อย",
    subtitle: "ตอบทุกข้อสงสัยก่อนตัดสินใจ",
    faq_1_question: "มือถือต้องมี NFC ถึงจะใช้ได้หรือไม่?",
    faq_1_answer: "ไม่จำเป็น! ถ้ามือถือไม่มี NFC ก็ยังสแกน QR Code ที่อยู่บนการ์ดได้",
    faq_2_question: "ไฟล์วิดีโอจะเก็บไว้ที่ไหน?",
    faq_2_answer: "วิดีโอจะอยู่ใน Google Drive ของคุณเอง คุณควบคุมสิทธิ์การเข้าถึงได้เต็มที่",
    faq_3_question: "สามารถเปลี่ยนวิดีโอทีหลังได้ไหม?",
    faq_3_answer: "ได้ครับ! คุณสามารถเปลี่ยนลิงก์หรืออัปเดตวิดีโอได้ตลอดเวลา",
    faq_4_question: "การ์ดใช้ได้นานแค่ไหน?",
    faq_4_answer: "การ์ด NFC ใช้ได้ถาวร ไม่มีวันหมดอายุ และไม่มีค่าบริการรายเดือน"
  },
  final_cta: {
    enabled: true,
    order: 10,
    title: "พร้อมสร้างของขวัญพิเศษแล้วหรือยัง?",
    subtitle: "เริ่มต้นส่งความทรงจำที่น่าประทับใจวันนี้",
    button_text: "สั่งของขวัญเลย"
  },
  
  // SEO & Meta Tags
  meta_title: "GyByte - NFC Gift Cards ที่ทำให้คุณโดดเด่น",
  meta_description: "ส่งความทรงจำและความประทับใจผ่าน NFC Gift Cards สมัยใหม่ แค่แตะก็เข้าถึงได้ทันที",
  og_title: "GyByte - NFC Gift Cards ที่ทำให้คุณโดดเด่น",
  og_description: "ส่งความทรงจำและความประทับใจผ่าน NFC Gift Cards สมัยใหม่ แค่แตะก็เข้าถึงได้ทันที",
  og_image: "/og-image.jpg"
};

async function initializeHomeSettings() {
  console.log("🚀 Initializing home settings...");
  console.log("API URL:", API_URL);
  
  try {
    const response = await fetch(`${API_URL}/api/home-settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(initialSettings),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to initialize: ${response.status} ${error}`);
    }

    const result = await response.json();
    console.log("✅ Home settings initialized successfully!");
    console.log("Response:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("❌ Error initializing home settings:", error);
    process.exit(1);
  }
}

// Run the initialization
initializeHomeSettings();
