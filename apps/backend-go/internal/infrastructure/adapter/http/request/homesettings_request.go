package request

// UpdateHomeSettingsRequest represents the HTTP request for updating home settings
type UpdateHomeSettingsRequest struct {
	// Hero Section
	HeroEnabled        *bool   `json:"hero_enabled"`
	HeroOrder          *int    `json:"hero_order"`
	HeroBadgeText      *string `json:"hero_badge_text"`
	HeroBadgeIcon      *string `json:"hero_badge_icon"`
	HeroTitleHighlight *string `json:"hero_title_highlight"`
	HeroTitleRest      *string `json:"hero_title_rest"`
	HeroSubtitle       *string `json:"hero_subtitle"`
	HeroFeature1       *string `json:"hero_feature_1"`
	HeroFeature2       *string `json:"hero_feature_2"`
	HeroFeature3       *string `json:"hero_feature_3"`

	// What Is It Section
	WhatIsItEnabled     *bool   `json:"what_is_it_enabled"`
	WhatIsItOrder       *int    `json:"what_is_it_order"`
	WhatIsItTitle       *string `json:"what_is_it_title"`
	WhatIsItSubtitle    *string `json:"what_is_it_subtitle"`
	WhatIsItDescription *string `json:"what_is_it_description"`

	// SKU Section
	SKUEnabled         *bool   `json:"sku_enabled"`
	SKUOrder           *int    `json:"sku_order"`
	SKUTitle           *string `json:"sku_title"`
	SKUSubtitle        *string `json:"sku_subtitle"`
	SKUCardTitle       *string `json:"sku_card_title"`
	SKUNFCCardName     *string `json:"sku_nfc_card_name"`
	SKUNFCCardPrice    *string `json:"sku_nfc_card_price"`
	SKUNFCStickerName  *string `json:"sku_nfc_sticker_name"`
	SKUNFCStickerPrice *string `json:"sku_nfc_sticker_price"`

	// How It Works Section
	HowItWorksEnabled          *bool   `json:"how_it_works_enabled"`
	HowItWorksOrder            *int    `json:"how_it_works_order"`
	HowItWorksTitle            *string `json:"how_it_works_title"`
	HowItWorksSubtitle         *string `json:"how_it_works_subtitle"`
	HowItWorksStep1Title       *string `json:"how_it_works_step_1_title"`
	HowItWorksStep1Description *string `json:"how_it_works_step_1_description"`
	HowItWorksStep2Title       *string `json:"how_it_works_step_2_title"`
	HowItWorksStep2Description *string `json:"how_it_works_step_2_description"`
	HowItWorksStep3Title       *string `json:"how_it_works_step_3_title"`
	HowItWorksStep3Description *string `json:"how_it_works_step_3_description"`

	// Occasions Section
	OccasionsEnabled   *bool   `json:"occasions_enabled"`
	OccasionsOrder     *int    `json:"occasions_order"`
	OccasionsTitle     *string `json:"occasions_title"`
	OccasionsSubtitle  *string `json:"occasions_subtitle"`
	OccasionsOccasion1 *string `json:"occasions_occasion_1"`
	OccasionsOccasion2 *string `json:"occasions_occasion_2"`
	OccasionsOccasion3 *string `json:"occasions_occasion_3"`
	OccasionsOccasion4 *string `json:"occasions_occasion_4"`
	OccasionsOccasion5 *string `json:"occasions_occasion_5"`
	OccasionsOccasion6 *string `json:"occasions_occasion_6"`

	// Why NFC Section
	WhyNFCEnabled             *bool   `json:"why_nfc_enabled"`
	WhyNFCOrder               *int    `json:"why_nfc_order"`
	WhyNFCTitle               *string `json:"why_nfc_title"`
	WhyNFCSubtitle            *string `json:"why_nfc_subtitle"`
	WhyNFCBenefit1Title       *string `json:"why_nfc_benefit_1_title"`
	WhyNFCBenefit1Description *string `json:"why_nfc_benefit_1_description"`
	WhyNFCBenefit2Title       *string `json:"why_nfc_benefit_2_title"`
	WhyNFCBenefit2Description *string `json:"why_nfc_benefit_2_description"`
	WhyNFCBenefit3Title       *string `json:"why_nfc_benefit_3_title"`
	WhyNFCBenefit3Description *string `json:"why_nfc_benefit_3_description"`
	WhyNFCBenefit4Title       *string `json:"why_nfc_benefit_4_title"`
	WhyNFCBenefit4Description *string `json:"why_nfc_benefit_4_description"`

	// Why Us Section
	WhyUsEnabled             *bool   `json:"why_us_enabled"`
	WhyUsOrder               *int    `json:"why_us_order"`
	WhyUsTitle               *string `json:"why_us_title"`
	WhyUsSubtitle            *string `json:"why_us_subtitle"`
	WhyUsFeature1Title       *string `json:"why_us_feature_1_title"`
	WhyUsFeature1Description *string `json:"why_us_feature_1_description"`
	WhyUsFeature2Title       *string `json:"why_us_feature_2_title"`
	WhyUsFeature2Description *string `json:"why_us_feature_2_description"`
	WhyUsFeature3Title       *string `json:"why_us_feature_3_title"`
	WhyUsFeature3Description *string `json:"why_us_feature_3_description"`

	// Preview Section
	PreviewEnabled     *bool   `json:"preview_enabled"`
	PreviewOrder       *int    `json:"preview_order"`
	PreviewTitle       *string `json:"preview_title"`
	PreviewSubtitle    *string `json:"preview_subtitle"`
	PreviewDescription *string `json:"preview_description"`

	// FAQ Section
	FAQEnabled      *bool   `json:"faq_enabled"`
	FAQOrder        *int    `json:"faq_order"`
	FAQTitle        *string `json:"faq_title"`
	FAQSubtitle     *string `json:"faq_subtitle"`
	FAQFAQ1Question *string `json:"faq_faq_1_question"`
	FAQFAQ1Answer   *string `json:"faq_faq_1_answer"`
	FAQFAQ2Question *string `json:"faq_faq_2_question"`
	FAQFAQ2Answer   *string `json:"faq_faq_2_answer"`
	FAQFAQ3Question *string `json:"faq_faq_3_question"`
	FAQFAQ3Answer   *string `json:"faq_faq_3_answer"`
	FAQFAQ4Question *string `json:"faq_faq_4_question"`
	FAQFAQ4Answer   *string `json:"faq_faq_4_answer"`

	// Final CTA Section
	FinalCTAEnabled    *bool   `json:"final_cta_enabled"`
	FinalCTAOrder      *int    `json:"final_cta_order"`
	FinalCTATitle      *string `json:"final_cta_title"`
	FinalCTASubtitle   *string `json:"final_cta_subtitle"`
	FinalCTAButtonText *string `json:"final_cta_button_text"`

	// SEO & OG Meta
	MetaTitle       *string `json:"meta_title"`
	MetaDescription *string `json:"meta_description"`
	OGTitle         *string `json:"og_title"`
	OGDescription   *string `json:"og_description"`
	OGImage         *string `json:"og_image"`
}

// CreateVersionRequest represents the HTTP request for creating a version
type CreateVersionRequest struct {
	VersionName        string `json:"version_name" binding:"required"`
	VersionDescription string `json:"version_description"`
}
