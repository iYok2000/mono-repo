package homesettings

import (
	"monorepo/backend-go/internal/infrastructure/adapter/persistence/gorm/homesettings/model"

	"gorm.io/gorm"
)

// AutoMigrate runs database migrations for home settings
func AutoMigrate(db *gorm.DB) error {
	// Create table if not exists
	if err := db.AutoMigrate(&model.HomeSettingsModel{}); err != nil {
		return err
	}

	// Add CHECK constraint to ensure only 'default' ID exists
	checkSQL := `
		DO $$ BEGIN
			IF NOT EXISTS (
				SELECT 1 FROM pg_constraint 
				WHERE conname = 'chk_home_settings_id_default'
			) THEN
				ALTER TABLE home_settings
				ADD CONSTRAINT chk_home_settings_id_default
				CHECK (id = 'default');
			END IF;
		END $$;
	`
	if err := db.Exec(checkSQL).Error; err != nil {
		return err
	}

	// Seed default data if not exists
	if err := seedDefaultData(db); err != nil {
		return err
	}

	return nil
}

// seedDefaultData inserts default home settings if not exists
func seedDefaultData(db *gorm.DB) error {
	var count int64
	if err := db.Model(&model.HomeSettingsModel{}).Count(&count).Error; err != nil {
		return err
	}

	// Skip if data already exists
	if count > 0 {
		return nil
	}

	// Default home settings data
	defaultSettings := &model.HomeSettingsModel{
		ID: "default",

		// Hero Section
		HeroEnabled:        true,
		HeroOrder:          1,
		HeroBadgeText:      "ของขวัญความทรงจำ • Digital Gift to Thailand",
		HeroBadgeIcon:      "✨",
		HeroTitleHighlight: "ของขวัญวิดีโอแบบ NFC",
		HeroTitleRest:      "ที่เปิดคลิปความทรงจำได้ทันที",
		HeroSubtitle:       "แตะการ์ดเพียงครั้งเดียว ก็เปิดคลิป วิดีโอ หรือข้อความแทนใจได้ทันที — ของขวัญสุดพิเศษสำหรับวันเกิด ครบรอบ และทุกโอกาสที่คุณอยากให้ความทรงจำอยู่ได้นาน",
		HeroFeature1:       "มี QR สำรอง สแกนได้ทุกเครื่อง",
		HeroFeature2:       "ไฟล์อยู่ใน Google Drive ของคุณ—คุมสิทธิ์เอง",
		HeroFeature3:       "ตั้งเวลาเปิด + ใส่รหัส ได้",

		// What Is It Section
		WhatIsItEnabled:             true,
		WhatIsItOrder:               2,
		WhatIsItTitle:               "NFC Gift Card คืออะไร?",
		WhatIsItSubtitle:            "ความหมายที่ลึกซึ้งกว่าของขวัญทั่วไป",
		WhatIsItFeature1Title:       "แตะเดียว เปิดได้ทันที",
		WhatIsItFeature1Description: "ไม่ต้อง scan QR หรือพิมพ์ URL ยาวๆ แค่แตะการ์ดบนมือถือ คลิปก็เปิดทันที",
		WhatIsItFeature2Title:       "ไฟล์คุมเองได้ 100%",
		WhatIsItFeature2Description: "วิดีโออยู่ใน Google Drive ของคุณเอง — คุณสามารถแก้ไข ลบ หรือตั้งค่าใครดูได้บ้างได้ตลอดเวลา",
		WhatIsItFeature3Title:       "ความหมายที่ยั่งยืน",
		WhatIsItFeature3Description: "ไม่ใช่แค่ของขวัญชั่วคราว แต่เป็นความทรงจำที่เปิดได้ทุกเมื่อ — วันเกิด ครบรอบ หรือวันธรรมดาที่อยากให้พิเศษ",

		// SKU Section
		SKUEnabled:   true,
		SKUOrder:     3,
		SKUTitle:     "เลือกสินค้า",
		SKUSubtitle:  "แพ็กเกจที่เหมาะกับทุกความต้องการ",
		SKUCardTitle: "สินค้าของเรา",

		// Card Labels
		SKUCard1Label: "Express Card",
		SKUCard2Label: "Squad Card",
		SKUCard3Label: "Greeting Card",

		// Express Card
		SKUExpressEnabled:     true,
		SKUExpressBadgeText:   "เร็วสุด",
		SKUExpressBadgeIcon:   "zap",
		SKUExpressBadgeColor:  "primary",
		SKUExpressEmoji:       "⚡",
		SKUExpressName:        "GyByte Express",
		SKUExpressTagline:     "⭐ ตัวเลือกยอดนิยม — ของขวัญเร็ว ใช้ได้เลย",
		SKUExpressDescription: "ส่งต่อความทรงจำด่วน ใช้งานทันที ไม่ต้องรอ — เหมาะสำหรับคนที่อยากให้ความพิเศษไวๆ",
		SKUExpressFeature1:    "ใช้งานได้ทันทีหลังสั่ง",
		SKUExpressFeature2:    "ส่งด่วนพิเศษ 1-2 วันถึง",
		SKUExpressFeature3:    "รวมการ์ดพรีเมียมใบเดียว",
		SKUExpressFeature4:    "รองรับ NFC + QR ไม่มีปัญหา",
		SKUExpressButtonText:  "สั่งของขวัญด่วน Express",
		SKUExpressButtonLink:  "/create",
		SKUExpressFooterText:  "เริ่มต้น ฿399 / ใบ",

		// Squad Card
		SKUSquadEnabled:     true,
		SKUSquadBadgeText:   "ทำหมู่",
		SKUSquadBadgeIcon:   "users",
		SKUSquadBadgeColor:  "gradient",
		SKUSquadEmoji:       "👥",
		SKUSquadName:        "GyByte Squad",
		SKUSquadTagline:     "🎉 สั่งพร้อมกัน ราคาหมู่คุ้มกว่า — แชร์ความทรงจำเป็นกลุ่ม",
		SKUSquadDescription: "สั่งหลายใบในคราวเดียว ราคาพิเศษ เหมาะสำหรับงานเลี้ยง ของขวัญหมู่คณะ",
		SKUSquadFeature1:    "ลด 15% เมื่อสั่ง 5 ใบขึ้นไป",
		SKUSquadFeature2:    "ออกแบบให้แต่ละใบได้",
		SKUSquadFeature3:    "รองรับจัดส่งหลายที่อยู่",
		SKUSquadFeature4:    "รับการ์ดพิเศษ + ซองของขวัญ",
		SKUSquadButtonText:  "สั่งกลุ่ม Squad",
		SKUSquadButtonLink:  "/create?type=squad",
		SKUSquadFooterText:  "เริ่มต้น ฿339 / ใบ (5 ใบขึ้นไป)",

		// Greeting Card
		SKUGreetingEnabled:     true,
		SKUGreetingBadgeText:   "เริ่มต้นเบาๆ",
		SKUGreetingBadgeIcon:   "sparkles",
		SKUGreetingBadgeColor:  "amber",
		SKUGreetingEmoji:       "💌",
		SKUGreetingName:        "GyByte Greeting",
		SKUGreetingTagline:     "💕 ใส่ใจแบบง่ายๆ แต่เต็มไปด้วยความหมาย",
		SKUGreetingDescription: "เริ่มต้นส่งความรู้สึกง่ายๆ ด้วยการ์ดเบสิก พร้อมคุณภาพเหมือนเดิม",
		SKUGreetingFeature1:    "การ์ดเบสิกพร้อม NFC",
		SKUGreetingFeature2:    "รองรับวิดีโอและข้อความ",
		SKUGreetingFeature3:    "มี QR Code สำรอง",
		SKUGreetingFeature4:    "จัดส่งมาตรฐาน 3-5 วัน",
		SKUGreetingButtonText:  "เลือก Greeting เบสิก",
		SKUGreetingButtonLink:  "/create?type=greeting",
		SKUGreetingFooterText:  "เริ่มต้น ฿249 / ใบ",

		// How It Works Section
		HowItWorksEnabled:          true,
		HowItWorksOrder:            4,
		HowItWorksTitle:            "ใช้งานง่าย ในสามขั้นตอน",
		HowItWorksSubtitle:         "ไม่ต้องติดตั้งแอป ไม่ต้องสมัครสมาชิก",
		HowItWorksStep1Title:       "1. สั่งและได้รับการ์ด",
		HowItWorksStep1Description: "สั่งการ์ดผ่านเว็บไซต์ และรับของส่งตรงถึงบ้าน",
		HowItWorksStep2Title:       "2. อัปโหลดวิดีโอหรือข้อความ",
		HowItWorksStep2Description: "อัปโหลดคอนเทนต์ที่คุณต้องการแชร์ลง Google Drive",
		HowItWorksStep3Title:       "3. แตะการ์ดเพื่อดู",
		HowItWorksStep3Description: "ผู้รับแค่แตะการ์ดก็เปิดคอนเทนต์ได้ทันที",

		// Occasions Section
		OccasionsEnabled:       true,
		OccasionsOrder:         5,
		OccasionsTitle:         "เหมาะกับทุกโอกาส",
		OccasionsSubtitle:      "ของขวัญที่ใช่ สำหรับทุกช่วงเวลาพิเศษ",
		OccasionsOccasion1:     "วันเกิด",
		OccasionsOccasion1Icon: "cake",
		OccasionsOccasion2:     "วันครบรอบ",
		OccasionsOccasion2Icon: "heart",
		OccasionsOccasion3:     "งานแต่งงาน",
		OccasionsOccasion3Icon: "sparkles",
		OccasionsOccasion4:     "รับปริญญา",
		OccasionsOccasion4Icon: "graduationcap",
		OccasionsOccasion5:     "เซอร์ไพรส์แฟน",
		OccasionsOccasion5Icon: "gift",
		OccasionsOccasion6:     "ขอบคุณลูกค้า",
		OccasionsOccasion6Icon: "users",
		OccasionsOccasion7:     "",
		OccasionsOccasion7Icon: "",
		OccasionsOccasion8:     "",
		OccasionsOccasion8Icon: "",
		OccasionsOccasion9:     "",
		OccasionsOccasion9Icon: "",

		// Why NFC Section
		WhyNFCEnabled:             true,
		WhyNFCOrder:               6,
		WhyNFCTitle:               "ทำไมต้อง NFC?",
		WhyNFCSubtitle:            "เทคโนโลยีที่ทำให้การให้ของขวัญสนุกและง่ายขึ้น",
		WhyNFCBenefit1Title:       "แตะเดียวเข้าถึงได้",
		WhyNFCBenefit1Description: "ไม่ต้องพิมพ์ URL หรือสแกน QR Code ให้ยุ่งยาก",
		WhyNFCBenefit2Title:       "ใช้งานได้ทุกมือถือ",
		WhyNFCBenefit2Description: "รองรับทั้ง iPhone และ Android ที่มี NFC",
		WhyNFCBenefit3Title:       "ปลอดภัยและเป็นส่วนตัว",
		WhyNFCBenefit3Description: "ข้อมูลอยู่ใน Google Drive ของคุณ ควบคุมได้เอง",
		WhyNFCBenefit4Title:       "ไม่มีค่าใช้จ่ายซ่อนเร้น",
		WhyNFCBenefit4Description: "ซื้อครั้งเดียว ใช้ได้ตลอด ไม่มีค่าบริการรายเดือน",

		// Why Us Section
		WhyUsEnabled:             true,
		WhyUsOrder:               7,
		WhyUsTitle:               "ทำไมต้องเลือกเรา?",
		WhyUsSubtitle:            "เราใส่ใจทุกรายละเอียดเพื่อประสบการณ์ที่ดีที่สุด",
		WhyUsFeature1Title:       "มี QR Code สำรอง",
		WhyUsFeature1Description: "ถึงมือถือไม่รองรับ NFC ก็ยังสแกน QR ได้",
		WhyUsFeature2Title:       "ควบคุมไฟล์ได้เอง",
		WhyUsFeature2Description: "ไฟล์อยู่ใน Google Drive ของคุณ แก้ไขหรือลบได้ตลอดเวลา",
		WhyUsFeature3Title:       "ตั้งเวลาเปิดและรหัสผ่าน",
		WhyUsFeature3Description: "กำหนดเวลาเปิดเผยหรือใส่รหัสผ่านเพื่อความเซอร์ไพรส์",

		// Preview Section
		PreviewEnabled:     true,
		PreviewOrder:       8,
		PreviewTitle:       "ตัวอย่างการใช้งาน",
		PreviewSubtitle:    "ดูว่าของขวัญจะเป็นอย่างไร",
		PreviewDescription: "ลองดูตัวอย่างการ์ดและวิธีการใช้งานจริง",

		// FAQ Section
		FAQEnabled:      true,
		FAQOrder:        9,
		FAQTitle:        "คำถามที่พบบ่อย",
		FAQSubtitle:     "ตอบทุกข้อสงสัยก่อนตัดสินใจ",
		FAQFAQ1Question: "มือถือต้องมี NFC ถึงจะใช้ได้หรือไม่?",
		FAQFAQ1Answer:   "ไม่จำเป็น! ถ้ามือถือไม่มี NFC ก็ยังสแกน QR Code ที่อยู่บนการ์ดได้",
		FAQFAQ2Question: "ไฟล์วิดีโอจะเก็บไว้ที่ไหน?",
		FAQFAQ2Answer:   "วิดีโอจะอยู่ใน Google Drive ของคุณเอง คุณควบคุมสิทธิ์การเข้าถึงได้เต็มที่",
		FAQFAQ3Question: "สามารถเปลี่ยนวิดีโอทีหลังได้ไหม?",
		FAQFAQ3Answer:   "ได้ครับ! คุณสามารถเปลี่ยนลิงก์หรืออัปเดตวิดีโอได้ตลอดเวลา",
		FAQFAQ4Question: "การ์ดใช้ได้นานแค่ไหน?",
		FAQFAQ4Answer:   "การ์ด NFC ใช้ได้ถาวร ไม่มีวันหมดอายุ และไม่มีค่าบริการรายเดือน",

		// Final CTA Section
		FinalCTAEnabled:    true,
		FinalCTAOrder:      10,
		FinalCTATitle:      "พร้อมสร้างของขวัญพิเศษแล้วหรือยัง?",
		FinalCTASubtitle:   "เริ่มต้นส่งความทรงจำที่น่าประทับใจวันนี้",
		FinalCTAButtonText: "สั่งของขวัญเลย",

		// SEO & OG Meta
		MetaTitle:       "GyByte - NFC Gift Cards ที่ทำให้คุณโดดเด่น",
		MetaDescription: "ส่งความทรงจำและความประทับใจผ่าน NFC Gift Cards สมัยใหม่ แค่แตะก็เข้าถึงได้ทันที",
		OGTitle:         "GyByte - NFC Gift Cards ที่ทำให้คุณโดดเด่น",
		OGDescription:   "ส่งความทรงจำและความประทับใจผ่าน NFC Gift Cards สมัยใหม่ แค่แตะก็เข้าถึงได้ทันที",
		OGImage:         "/og-image.jpg",

		UpdatedBy: "system",
	}

	return db.Create(defaultSettings).Error
}
