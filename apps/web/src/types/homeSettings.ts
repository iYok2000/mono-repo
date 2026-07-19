/**
 * Home Page Settings Types
 * Defines structure for managing home page sections via admin panel
 */

export interface SectionSettings {
  enabled: boolean;
  order: number;
}

export interface HeroSectionSettings extends SectionSettings {
  badge_text: string;
  badge_icon: string;
  title_highlight: string;
  title_rest: string;
  subtitle: string;
  feature_1: string;
  feature_2: string;
  feature_3: string;
  cta_primary: string;
  cta_secondary: string;
  cta_tertiary: string;
}

export interface WhatIsItSectionSettings extends SectionSettings {
  title: string;
  subtitle: string;
  feature_1_title: string;
  feature_1_description: string;
  feature_2_title: string;
  feature_2_description: string;
  feature_3_title: string;
  feature_3_description: string;
}

export interface SKUSectionSettings extends SectionSettings {
  title: string;
  subtitle: string;
  card_title: string;
  card_1_label: string;
  card_2_label: string;
  card_3_label: string;
  // Express Card
  express_enabled: boolean;
  express_badge_text: string;
  express_badge_icon: string;
  express_badge_color: string;
  express_emoji: string;
  express_name: string;
  express_tagline: string;
  express_description: string;
  express_feature_1: string;
  express_feature_2: string;
  express_feature_3: string;
  express_feature_4: string;
  express_button_text: string;
  express_button_link: string;
  express_footer_text: string;
  // Squad Card
  squad_enabled: boolean;
  squad_badge_text: string;
  squad_badge_icon: string;
  squad_badge_color: string;
  squad_emoji: string;
  squad_name: string;
  squad_tagline: string;
  squad_description: string;
  squad_feature_1: string;
  squad_feature_2: string;
  squad_feature_3: string;
  squad_feature_4: string;
  squad_button_text: string;
  squad_button_link: string;
  squad_footer_text: string;
  // Greeting Card
  greeting_enabled: boolean;
  greeting_badge_text: string;
  greeting_badge_icon: string;
  greeting_badge_color: string;
  greeting_emoji: string;
  greeting_name: string;
  greeting_tagline: string;
  greeting_description: string;
  greeting_feature_1: string;
  greeting_feature_2: string;
  greeting_feature_3: string;
  greeting_feature_4: string;
  greeting_button_text: string;
  greeting_button_link: string;
  greeting_footer_text: string;
}

export interface HowItWorksSectionSettings extends SectionSettings {
  title: string;
  subtitle: string;
  step_1_title: string;
  step_1_description: string;
  step_2_title: string;
  step_2_description: string;
  step_3_title: string;
  step_3_description: string;
}

export interface OccasionsSectionSettings extends SectionSettings {
  title: string;
  subtitle: string;
  occasion_1: string;
  occasion_1_icon: string;
  occasion_2: string;
  occasion_2_icon: string;
  occasion_3: string;
  occasion_3_icon: string;
  occasion_4: string;
  occasion_4_icon: string;
  occasion_5: string;
  occasion_5_icon: string;
  occasion_6: string;
  occasion_6_icon: string;
  occasion_7: string;
  occasion_7_icon: string;
  occasion_8: string;
  occasion_8_icon: string;
  occasion_9: string;
  occasion_9_icon: string;
}

export interface WhyNFCSectionSettings extends SectionSettings {
  title: string;
  subtitle: string;
  benefit_1_title: string;
  benefit_1_description: string;
  benefit_2_title: string;
  benefit_2_description: string;
  benefit_3_title: string;
  benefit_3_description: string;
  benefit_4_title: string;
  benefit_4_description: string;
}

export interface WhyUsSectionSettings extends SectionSettings {
  title: string;
  subtitle: string;
  feature_1_title: string;
  feature_1_description: string;
  feature_2_title: string;
  feature_2_description: string;
  feature_3_title: string;
  feature_3_description: string;
}

export interface PreviewSectionSettings extends SectionSettings {
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

export interface FAQSectionSettings extends SectionSettings {
  title: string;
  subtitle: string;
  faq_1_question: string;
  faq_1_answer: string;
  faq_2_question: string;
  faq_2_answer: string;
  faq_3_question: string;
  faq_3_answer: string;
  faq_4_question: string;
  faq_4_answer: string;
}

export interface FinalCTASectionSettings extends SectionSettings {
  title: string;
  subtitle: string;
  button_text: string;
}

/**
 * Complete Home Settings
 */
export interface HomeSettings {
  id: string;
  hero: HeroSectionSettings;
  what_is_it: WhatIsItSectionSettings;
  sku: SKUSectionSettings;
  how_it_works: HowItWorksSectionSettings;
  occasions: OccasionsSectionSettings;
  why_nfc: WhyNFCSectionSettings;
  why_us: WhyUsSectionSettings;
  preview: PreviewSectionSettings;
  faq: FAQSectionSettings;
  final_cta: FinalCTASectionSettings;
  
  // SEO & OG Meta
  meta_title?: string;
  meta_description?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  
  updated_at?: string;
  updated_by?: string;
}

/**
 * Section Metadata for Admin UI
 */
export interface SectionMetadata {
  key: keyof Omit<HomeSettings, 'id' | 'meta_title' | 'meta_description' | 'og_title' | 'og_description' | 'og_image' | 'updated_at' | 'updated_by'>;
  name: string;
  description: string;
}

export const SECTION_METADATA: SectionMetadata[] = [
  {
    key: 'hero',
    name: 'Hero Section',
    description: 'หน้าแรกสุด - แบนเนอร์หลักพร้อมคำกระตุ้น',
  },
  {
    key: 'what_is_it',
    name: 'What Is It',
    description: 'อธิบายว่าคืออะไร'
  },
  {
    key: 'sku',
    name: 'SKU/Products',
    description: 'แสดงสินค้าและราคา'
  },
  {
    key: 'how_it_works',
    name: 'How It Works',
    description: 'ขั้นตอนการใช้งาน'
  },
  {
    key: 'occasions',
    name: 'Occasions',
    description: 'โอกาสในการใช้งาน'
  },
  {
    key: 'why_nfc',
    name: 'Why NFC',
    description: 'ทำไมต้องใช้ NFC'
  },
  {
    key: 'why_us',
    name: 'Why Us',
    description: 'ทำไมต้องเลือกเรา'
  },
  {
    key: 'preview',
    name: 'Preview/Examples',
    description: 'ตัวอย่างการใช้งาน'
  },
  {
    key: 'faq',
    name: 'FAQ',
    description: 'คำถามที่พบบ่อย'
  },
  {
    key: 'final_cta',
    name: 'Final CTA',
    description: 'ปิดท้ายด้วยปุ่มกระตุ้น'
  }
];
