package model

import (
	"time"

	"monorepo/backend-go/internal/core/domain/homesettings/entity"
)

// HomeSettingsModel represents the GORM database model for home settings
type HomeSettingsModel struct {
	ID string `gorm:"column:id;primaryKey;size:50;default:default" json:"id"`

	// Hero Section
	HeroEnabled        bool   `gorm:"column:hero_enabled;not null;default:true" json:"hero_enabled"`
	HeroOrder          int    `gorm:"column:hero_order;not null;default:1" json:"hero_order"`
	HeroBadgeText      string `gorm:"column:hero_badge_text;size:100" json:"hero_badge_text"`
	HeroBadgeIcon      string `gorm:"column:hero_badge_icon;size:50" json:"hero_badge_icon"`
	HeroTitleHighlight string `gorm:"column:hero_title_highlight;size:200" json:"hero_title_highlight"`
	HeroTitleRest      string `gorm:"column:hero_title_rest;size:200" json:"hero_title_rest"`
	HeroSubtitle       string `gorm:"column:hero_subtitle;type:text" json:"hero_subtitle"`
	HeroFeature1       string `gorm:"column:hero_feature_1;size:200" json:"hero_feature_1"`
	HeroFeature2       string `gorm:"column:hero_feature_2;size:200" json:"hero_feature_2"`
	HeroFeature3       string `gorm:"column:hero_feature_3;size:200" json:"hero_feature_3"`
	HeroCTAPrimary     string `gorm:"column:hero_cta_primary;size:100" json:"hero_cta_primary"`
	HeroCTASecondary   string `gorm:"column:hero_cta_secondary;size:100" json:"hero_cta_secondary"`
	HeroCTATertiary    string `gorm:"column:hero_cta_tertiary;size:100" json:"hero_cta_tertiary"`

	// What Is It Section
	WhatIsItEnabled             bool   `gorm:"column:what_is_it_enabled;not null;default:true" json:"what_is_it_enabled"`
	WhatIsItOrder               int    `gorm:"column:what_is_it_order;not null;default:2" json:"what_is_it_order"`
	WhatIsItTitle               string `gorm:"column:what_is_it_title;size:200" json:"what_is_it_title"`
	WhatIsItSubtitle            string `gorm:"column:what_is_it_subtitle;size:300" json:"what_is_it_subtitle"`
	WhatIsItFeature1Title       string `gorm:"column:what_is_it_feature_1_title;size:200" json:"what_is_it_feature_1_title"`
	WhatIsItFeature1Description string `gorm:"column:what_is_it_feature_1_description;type:text" json:"what_is_it_feature_1_description"`
	WhatIsItFeature2Title       string `gorm:"column:what_is_it_feature_2_title;size:200" json:"what_is_it_feature_2_title"`
	WhatIsItFeature2Description string `gorm:"column:what_is_it_feature_2_description;type:text" json:"what_is_it_feature_2_description"`
	WhatIsItFeature3Title       string `gorm:"column:what_is_it_feature_3_title;size:200" json:"what_is_it_feature_3_title"`
	WhatIsItFeature3Description string `gorm:"column:what_is_it_feature_3_description;type:text" json:"what_is_it_feature_3_description"`

	// SKU Section
	SKUEnabled   bool   `gorm:"column:sku_enabled;not null;default:true" json:"sku_enabled"`
	SKUOrder     int    `gorm:"column:sku_order;not null;default:3" json:"sku_order"`
	SKUTitle     string `gorm:"column:sku_title;size:200" json:"sku_title"`
	SKUSubtitle  string `gorm:"column:sku_subtitle;size:300" json:"sku_subtitle"`
	SKUCardTitle string `gorm:"column:sku_card_title;size:200" json:"sku_card_title"`

	// Card Labels
	SKUCard1Label string `gorm:"column:sku_card_1_label;size:100" json:"sku_card_1_label"`
	SKUCard2Label string `gorm:"column:sku_card_2_label;size:100" json:"sku_card_2_label"`
	SKUCard3Label string `gorm:"column:sku_card_3_label;size:100" json:"sku_card_3_label"`

	// Express Card
	SKUExpressEnabled     bool   `gorm:"column:sku_express_enabled;not null;default:true" json:"sku_express_enabled"`
	SKUExpressBadgeText   string `gorm:"column:sku_express_badge_text;size:50" json:"sku_express_badge_text"`
	SKUExpressBadgeIcon   string `gorm:"column:sku_express_badge_icon;size:50" json:"sku_express_badge_icon"`
	SKUExpressBadgeColor  string `gorm:"column:sku_express_badge_color;size:20" json:"sku_express_badge_color"`
	SKUExpressEmoji       string `gorm:"column:sku_express_emoji;size:10" json:"sku_express_emoji"`
	SKUExpressName        string `gorm:"column:sku_express_name;size:100" json:"sku_express_name"`
	SKUExpressTagline     string `gorm:"column:sku_express_tagline;size:200" json:"sku_express_tagline"`
	SKUExpressDescription string `gorm:"column:sku_express_description;type:text" json:"sku_express_description"`
	SKUExpressFeature1    string `gorm:"column:sku_express_feature_1;size:200" json:"sku_express_feature_1"`
	SKUExpressFeature2    string `gorm:"column:sku_express_feature_2;size:200" json:"sku_express_feature_2"`
	SKUExpressFeature3    string `gorm:"column:sku_express_feature_3;size:200" json:"sku_express_feature_3"`
	SKUExpressFeature4    string `gorm:"column:sku_express_feature_4;size:200" json:"sku_express_feature_4"`
	SKUExpressButtonText  string `gorm:"column:sku_express_button_text;size:100" json:"sku_express_button_text"`
	SKUExpressButtonLink  string `gorm:"column:sku_express_button_link;size:200" json:"sku_express_button_link"`
	SKUExpressFooterText  string `gorm:"column:sku_express_footer_text;size:200" json:"sku_express_footer_text"`

	// Squad Card
	SKUSquadEnabled     bool   `gorm:"column:sku_squad_enabled;not null;default:true" json:"sku_squad_enabled"`
	SKUSquadBadgeText   string `gorm:"column:sku_squad_badge_text;size:50" json:"sku_squad_badge_text"`
	SKUSquadBadgeIcon   string `gorm:"column:sku_squad_badge_icon;size:50" json:"sku_squad_badge_icon"`
	SKUSquadBadgeColor  string `gorm:"column:sku_squad_badge_color;size:20" json:"sku_squad_badge_color"`
	SKUSquadEmoji       string `gorm:"column:sku_squad_emoji;size:10" json:"sku_squad_emoji"`
	SKUSquadName        string `gorm:"column:sku_squad_name;size:100" json:"sku_squad_name"`
	SKUSquadTagline     string `gorm:"column:sku_squad_tagline;size:200" json:"sku_squad_tagline"`
	SKUSquadDescription string `gorm:"column:sku_squad_description;type:text" json:"sku_squad_description"`
	SKUSquadFeature1    string `gorm:"column:sku_squad_feature_1;size:200" json:"sku_squad_feature_1"`
	SKUSquadFeature2    string `gorm:"column:sku_squad_feature_2;size:200" json:"sku_squad_feature_2"`
	SKUSquadFeature3    string `gorm:"column:sku_squad_feature_3;size:200" json:"sku_squad_feature_3"`
	SKUSquadFeature4    string `gorm:"column:sku_squad_feature_4;size:200" json:"sku_squad_feature_4"`
	SKUSquadButtonText  string `gorm:"column:sku_squad_button_text;size:100" json:"sku_squad_button_text"`
	SKUSquadButtonLink  string `gorm:"column:sku_squad_button_link;size:200" json:"sku_squad_button_link"`
	SKUSquadFooterText  string `gorm:"column:sku_squad_footer_text;size:200" json:"sku_squad_footer_text"`

	// Greeting Card
	SKUGreetingEnabled     bool   `gorm:"column:sku_greeting_enabled;not null;default:true" json:"sku_greeting_enabled"`
	SKUGreetingBadgeText   string `gorm:"column:sku_greeting_badge_text;size:50" json:"sku_greeting_badge_text"`
	SKUGreetingBadgeIcon   string `gorm:"column:sku_greeting_badge_icon;size:50" json:"sku_greeting_badge_icon"`
	SKUGreetingBadgeColor  string `gorm:"column:sku_greeting_badge_color;size:20" json:"sku_greeting_badge_color"`
	SKUGreetingEmoji       string `gorm:"column:sku_greeting_emoji;size:10" json:"sku_greeting_emoji"`
	SKUGreetingName        string `gorm:"column:sku_greeting_name;size:100" json:"sku_greeting_name"`
	SKUGreetingTagline     string `gorm:"column:sku_greeting_tagline;size:200" json:"sku_greeting_tagline"`
	SKUGreetingDescription string `gorm:"column:sku_greeting_description;type:text" json:"sku_greeting_description"`
	SKUGreetingFeature1    string `gorm:"column:sku_greeting_feature_1;size:200" json:"sku_greeting_feature_1"`
	SKUGreetingFeature2    string `gorm:"column:sku_greeting_feature_2;size:200" json:"sku_greeting_feature_2"`
	SKUGreetingFeature3    string `gorm:"column:sku_greeting_feature_3;size:200" json:"sku_greeting_feature_3"`
	SKUGreetingFeature4    string `gorm:"column:sku_greeting_feature_4;size:200" json:"sku_greeting_feature_4"`
	SKUGreetingButtonText  string `gorm:"column:sku_greeting_button_text;size:100" json:"sku_greeting_button_text"`
	SKUGreetingButtonLink  string `gorm:"column:sku_greeting_button_link;size:200" json:"sku_greeting_button_link"`
	SKUGreetingFooterText  string `gorm:"column:sku_greeting_footer_text;size:200" json:"sku_greeting_footer_text"`

	// How It Works Section
	HowItWorksEnabled          bool   `gorm:"column:how_it_works_enabled;not null;default:true" json:"how_it_works_enabled"`
	HowItWorksOrder            int    `gorm:"column:how_it_works_order;not null;default:4" json:"how_it_works_order"`
	HowItWorksTitle            string `gorm:"column:how_it_works_title;size:200" json:"how_it_works_title"`
	HowItWorksSubtitle         string `gorm:"column:how_it_works_subtitle;size:300" json:"how_it_works_subtitle"`
	HowItWorksStep1Title       string `gorm:"column:how_it_works_step_1_title;size:200" json:"how_it_works_step_1_title"`
	HowItWorksStep1Description string `gorm:"column:how_it_works_step_1_description;type:text" json:"how_it_works_step_1_description"`
	HowItWorksStep2Title       string `gorm:"column:how_it_works_step_2_title;size:200" json:"how_it_works_step_2_title"`
	HowItWorksStep2Description string `gorm:"column:how_it_works_step_2_description;type:text" json:"how_it_works_step_2_description"`
	HowItWorksStep3Title       string `gorm:"column:how_it_works_step_3_title;size:200" json:"how_it_works_step_3_title"`
	HowItWorksStep3Description string `gorm:"column:how_it_works_step_3_description;type:text" json:"how_it_works_step_3_description"`

	// Occasions Section
	OccasionsEnabled       bool   `gorm:"column:occasions_enabled;not null;default:true" json:"occasions_enabled"`
	OccasionsOrder         int    `gorm:"column:occasions_order;not null;default:5" json:"occasions_order"`
	OccasionsTitle         string `gorm:"column:occasions_title;size:200" json:"occasions_title"`
	OccasionsSubtitle      string `gorm:"column:occasions_subtitle;size:300" json:"occasions_subtitle"`
	OccasionsOccasion1     string `gorm:"column:occasions_occasion_1;size:100" json:"occasions_occasion_1"`
	OccasionsOccasion1Icon string `gorm:"column:occasions_occasion_1_icon;size:50" json:"occasions_occasion_1_icon"`
	OccasionsOccasion2     string `gorm:"column:occasions_occasion_2;size:100" json:"occasions_occasion_2"`
	OccasionsOccasion2Icon string `gorm:"column:occasions_occasion_2_icon;size:50" json:"occasions_occasion_2_icon"`
	OccasionsOccasion3     string `gorm:"column:occasions_occasion_3;size:100" json:"occasions_occasion_3"`
	OccasionsOccasion3Icon string `gorm:"column:occasions_occasion_3_icon;size:50" json:"occasions_occasion_3_icon"`
	OccasionsOccasion4     string `gorm:"column:occasions_occasion_4;size:100" json:"occasions_occasion_4"`
	OccasionsOccasion4Icon string `gorm:"column:occasions_occasion_4_icon;size:50" json:"occasions_occasion_4_icon"`
	OccasionsOccasion5     string `gorm:"column:occasions_occasion_5;size:100" json:"occasions_occasion_5"`
	OccasionsOccasion5Icon string `gorm:"column:occasions_occasion_5_icon;size:50" json:"occasions_occasion_5_icon"`
	OccasionsOccasion6     string `gorm:"column:occasions_occasion_6;size:100" json:"occasions_occasion_6"`
	OccasionsOccasion6Icon string `gorm:"column:occasions_occasion_6_icon;size:50" json:"occasions_occasion_6_icon"`
	OccasionsOccasion7     string `gorm:"column:occasions_occasion_7;size:100" json:"occasions_occasion_7"`
	OccasionsOccasion7Icon string `gorm:"column:occasions_occasion_7_icon;size:50" json:"occasions_occasion_7_icon"`
	OccasionsOccasion8     string `gorm:"column:occasions_occasion_8;size:100" json:"occasions_occasion_8"`
	OccasionsOccasion8Icon string `gorm:"column:occasions_occasion_8_icon;size:50" json:"occasions_occasion_8_icon"`
	OccasionsOccasion9     string `gorm:"column:occasions_occasion_9;size:100" json:"occasions_occasion_9"`
	OccasionsOccasion9Icon string `gorm:"column:occasions_occasion_9_icon;size:50" json:"occasions_occasion_9_icon"`

	// Why NFC Section
	WhyNFCEnabled             bool   `gorm:"column:why_nfc_enabled;not null;default:true" json:"why_nfc_enabled"`
	WhyNFCOrder               int    `gorm:"column:why_nfc_order;not null;default:6" json:"why_nfc_order"`
	WhyNFCTitle               string `gorm:"column:why_nfc_title;size:200" json:"why_nfc_title"`
	WhyNFCSubtitle            string `gorm:"column:why_nfc_subtitle;size:300" json:"why_nfc_subtitle"`
	WhyNFCBenefit1Title       string `gorm:"column:why_nfc_benefit_1_title;size:200" json:"why_nfc_benefit_1_title"`
	WhyNFCBenefit1Description string `gorm:"column:why_nfc_benefit_1_description;type:text" json:"why_nfc_benefit_1_description"`
	WhyNFCBenefit2Title       string `gorm:"column:why_nfc_benefit_2_title;size:200" json:"why_nfc_benefit_2_title"`
	WhyNFCBenefit2Description string `gorm:"column:why_nfc_benefit_2_description;type:text" json:"why_nfc_benefit_2_description"`
	WhyNFCBenefit3Title       string `gorm:"column:why_nfc_benefit_3_title;size:200" json:"why_nfc_benefit_3_title"`
	WhyNFCBenefit3Description string `gorm:"column:why_nfc_benefit_3_description;type:text" json:"why_nfc_benefit_3_description"`
	WhyNFCBenefit4Title       string `gorm:"column:why_nfc_benefit_4_title;size:200" json:"why_nfc_benefit_4_title"`
	WhyNFCBenefit4Description string `gorm:"column:why_nfc_benefit_4_description;type:text" json:"why_nfc_benefit_4_description"`

	// Why Us Section
	WhyUsEnabled             bool   `gorm:"column:why_us_enabled;not null;default:true" json:"why_us_enabled"`
	WhyUsOrder               int    `gorm:"column:why_us_order;not null;default:7" json:"why_us_order"`
	WhyUsTitle               string `gorm:"column:why_us_title;size:200" json:"why_us_title"`
	WhyUsSubtitle            string `gorm:"column:why_us_subtitle;size:300" json:"why_us_subtitle"`
	WhyUsFeature1Title       string `gorm:"column:why_us_feature_1_title;size:200" json:"why_us_feature_1_title"`
	WhyUsFeature1Description string `gorm:"column:why_us_feature_1_description;type:text" json:"why_us_feature_1_description"`
	WhyUsFeature2Title       string `gorm:"column:why_us_feature_2_title;size:200" json:"why_us_feature_2_title"`
	WhyUsFeature2Description string `gorm:"column:why_us_feature_2_description;type:text" json:"why_us_feature_2_description"`
	WhyUsFeature3Title       string `gorm:"column:why_us_feature_3_title;size:200" json:"why_us_feature_3_title"`
	WhyUsFeature3Description string `gorm:"column:why_us_feature_3_description;type:text" json:"why_us_feature_3_description"`

	// Preview Section
	PreviewEnabled     bool   `gorm:"column:preview_enabled;not null;default:true" json:"preview_enabled"`
	PreviewOrder       int    `gorm:"column:preview_order;not null;default:8" json:"preview_order"`
	PreviewTitle       string `gorm:"column:preview_title;size:200" json:"preview_title"`
	PreviewSubtitle    string `gorm:"column:preview_subtitle;size:300" json:"preview_subtitle"`
	PreviewDescription string `gorm:"column:preview_description;type:text" json:"preview_description"`

	// FAQ Section
	FAQEnabled      bool   `gorm:"column:faq_enabled;not null;default:true" json:"faq_enabled"`
	FAQOrder        int    `gorm:"column:faq_order;not null;default:9" json:"faq_order"`
	FAQTitle        string `gorm:"column:faq_title;size:200" json:"faq_title"`
	FAQSubtitle     string `gorm:"column:faq_subtitle;size:300" json:"faq_subtitle"`
	FAQFAQ1Question string `gorm:"column:faq_faq_1_question;size:300" json:"faq_faq_1_question"`
	FAQFAQ1Answer   string `gorm:"column:faq_faq_1_answer;type:text" json:"faq_faq_1_answer"`
	FAQFAQ2Question string `gorm:"column:faq_faq_2_question;size:300" json:"faq_faq_2_question"`
	FAQFAQ2Answer   string `gorm:"column:faq_faq_2_answer;type:text" json:"faq_faq_2_answer"`
	FAQFAQ3Question string `gorm:"column:faq_faq_3_question;size:300" json:"faq_faq_3_question"`
	FAQFAQ3Answer   string `gorm:"column:faq_faq_3_answer;type:text" json:"faq_faq_3_answer"`
	FAQFAQ4Question string `gorm:"column:faq_faq_4_question;size:300" json:"faq_faq_4_question"`
	FAQFAQ4Answer   string `gorm:"column:faq_faq_4_answer;type:text" json:"faq_faq_4_answer"`

	// Final CTA Section
	FinalCTAEnabled    bool   `gorm:"column:final_cta_enabled;not null;default:true" json:"final_cta_enabled"`
	FinalCTAOrder      int    `gorm:"column:final_cta_order;not null;default:10" json:"final_cta_order"`
	FinalCTATitle      string `gorm:"column:final_cta_title;size:200" json:"final_cta_title"`
	FinalCTASubtitle   string `gorm:"column:final_cta_subtitle;size:300" json:"final_cta_subtitle"`
	FinalCTAButtonText string `gorm:"column:final_cta_button_text;size:100" json:"final_cta_button_text"`

	// SEO & OG Meta
	MetaTitle       string `gorm:"column:meta_title;size:200" json:"meta_title"`
	MetaDescription string `gorm:"column:meta_description;type:text" json:"meta_description"`
	OGTitle         string `gorm:"column:og_title;size:200" json:"og_title"`
	OGDescription   string `gorm:"column:og_description;type:text" json:"og_description"`
	OGImage         string `gorm:"column:og_image;size:500" json:"og_image"`

	// Metadata
	CreatedAt time.Time `gorm:"column:created_at;autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"column:updated_at;autoUpdateTime" json:"updated_at"`
	UpdatedBy string    `gorm:"column:updated_by;size:100" json:"updated_by"`
}

// TableName specifies the custom table name for HomeSettingsModel
func (HomeSettingsModel) TableName() string {
	return "home_settings"
}

// ToEntity converts GORM model to domain entity
func ToEntity(m *HomeSettingsModel) *entity.HomeSettings {
	return &entity.HomeSettings{
		ID: m.ID,
		Hero: entity.HeroSection{
			Section:        entity.Section{Enabled: m.HeroEnabled, Order: m.HeroOrder},
			BadgeText:      m.HeroBadgeText,
			BadgeIcon:      m.HeroBadgeIcon,
			TitleHighlight: m.HeroTitleHighlight,
			TitleRest:      m.HeroTitleRest,
			Subtitle:       m.HeroSubtitle,
			Feature1:       m.HeroFeature1,
			Feature2:       m.HeroFeature2,
			Feature3:       m.HeroFeature3,
			CTAPrimary:     m.HeroCTAPrimary,
			CTASecondary:   m.HeroCTASecondary,
			CTATertiary:    m.HeroCTATertiary,
		},
		WhatIsIt: entity.WhatIsItSection{
			Section:             entity.Section{Enabled: m.WhatIsItEnabled, Order: m.WhatIsItOrder},
			Title:               m.WhatIsItTitle,
			Subtitle:            m.WhatIsItSubtitle,
			Feature1Title:       m.WhatIsItFeature1Title,
			Feature1Description: m.WhatIsItFeature1Description,
			Feature2Title:       m.WhatIsItFeature2Title,
			Feature2Description: m.WhatIsItFeature2Description,
			Feature3Title:       m.WhatIsItFeature3Title,
			Feature3Description: m.WhatIsItFeature3Description,
		},
		SKU: entity.SKUSection{
			Section:   entity.Section{Enabled: m.SKUEnabled, Order: m.SKUOrder},
			Title:     m.SKUTitle,
			Subtitle:  m.SKUSubtitle,
			CardTitle: m.SKUCardTitle,

			Card1Label: m.SKUCard1Label,
			Card2Label: m.SKUCard2Label,
			Card3Label: m.SKUCard3Label,

			ExpressEnabled:     m.SKUExpressEnabled,
			ExpressBadgeText:   m.SKUExpressBadgeText,
			ExpressBadgeIcon:   m.SKUExpressBadgeIcon,
			ExpressBadgeColor:  m.SKUExpressBadgeColor,
			ExpressEmoji:       m.SKUExpressEmoji,
			ExpressName:        m.SKUExpressName,
			ExpressTagline:     m.SKUExpressTagline,
			ExpressDescription: m.SKUExpressDescription,
			ExpressFeature1:    m.SKUExpressFeature1,
			ExpressFeature2:    m.SKUExpressFeature2,
			ExpressFeature3:    m.SKUExpressFeature3,
			ExpressFeature4:    m.SKUExpressFeature4,
			ExpressButtonText:  m.SKUExpressButtonText,
			ExpressButtonLink:  m.SKUExpressButtonLink,
			ExpressFooterText:  m.SKUExpressFooterText,

			SquadEnabled:     m.SKUSquadEnabled,
			SquadBadgeText:   m.SKUSquadBadgeText,
			SquadBadgeIcon:   m.SKUSquadBadgeIcon,
			SquadBadgeColor:  m.SKUSquadBadgeColor,
			SquadEmoji:       m.SKUSquadEmoji,
			SquadName:        m.SKUSquadName,
			SquadTagline:     m.SKUSquadTagline,
			SquadDescription: m.SKUSquadDescription,
			SquadFeature1:    m.SKUSquadFeature1,
			SquadFeature2:    m.SKUSquadFeature2,
			SquadFeature3:    m.SKUSquadFeature3,
			SquadFeature4:    m.SKUSquadFeature4,
			SquadButtonText:  m.SKUSquadButtonText,
			SquadButtonLink:  m.SKUSquadButtonLink,
			SquadFooterText:  m.SKUSquadFooterText,

			GreetingEnabled:     m.SKUGreetingEnabled,
			GreetingBadgeText:   m.SKUGreetingBadgeText,
			GreetingBadgeIcon:   m.SKUGreetingBadgeIcon,
			GreetingBadgeColor:  m.SKUGreetingBadgeColor,
			GreetingEmoji:       m.SKUGreetingEmoji,
			GreetingName:        m.SKUGreetingName,
			GreetingTagline:     m.SKUGreetingTagline,
			GreetingDescription: m.SKUGreetingDescription,
			GreetingFeature1:    m.SKUGreetingFeature1,
			GreetingFeature2:    m.SKUGreetingFeature2,
			GreetingFeature3:    m.SKUGreetingFeature3,
			GreetingFeature4:    m.SKUGreetingFeature4,
			GreetingButtonText:  m.SKUGreetingButtonText,
			GreetingButtonLink:  m.SKUGreetingButtonLink,
			GreetingFooterText:  m.SKUGreetingFooterText,
		},
		HowItWorks: entity.HowItWorksSection{
			Section:          entity.Section{Enabled: m.HowItWorksEnabled, Order: m.HowItWorksOrder},
			Title:            m.HowItWorksTitle,
			Subtitle:         m.HowItWorksSubtitle,
			Step1Title:       m.HowItWorksStep1Title,
			Step1Description: m.HowItWorksStep1Description,
			Step2Title:       m.HowItWorksStep2Title,
			Step2Description: m.HowItWorksStep2Description,
			Step3Title:       m.HowItWorksStep3Title,
			Step3Description: m.HowItWorksStep3Description,
		},
		Occasions: entity.OccasionsSection{
			Section:       entity.Section{Enabled: m.OccasionsEnabled, Order: m.OccasionsOrder},
			Title:         m.OccasionsTitle,
			Subtitle:      m.OccasionsSubtitle,
			Occasion1:     m.OccasionsOccasion1,
			Occasion1Icon: m.OccasionsOccasion1Icon,
			Occasion2:     m.OccasionsOccasion2,
			Occasion2Icon: m.OccasionsOccasion2Icon,
			Occasion3:     m.OccasionsOccasion3,
			Occasion3Icon: m.OccasionsOccasion3Icon,
			Occasion4:     m.OccasionsOccasion4,
			Occasion4Icon: m.OccasionsOccasion4Icon,
			Occasion5:     m.OccasionsOccasion5,
			Occasion5Icon: m.OccasionsOccasion5Icon,
			Occasion6:     m.OccasionsOccasion6,
			Occasion6Icon: m.OccasionsOccasion6Icon,
			Occasion7:     m.OccasionsOccasion7,
			Occasion7Icon: m.OccasionsOccasion7Icon,
			Occasion8:     m.OccasionsOccasion8,
			Occasion8Icon: m.OccasionsOccasion8Icon,
			Occasion9:     m.OccasionsOccasion9,
			Occasion9Icon: m.OccasionsOccasion9Icon,
		},
		WhyNFC: entity.WhyNFCSection{
			Section:             entity.Section{Enabled: m.WhyNFCEnabled, Order: m.WhyNFCOrder},
			Title:               m.WhyNFCTitle,
			Subtitle:            m.WhyNFCSubtitle,
			Benefit1Title:       m.WhyNFCBenefit1Title,
			Benefit1Description: m.WhyNFCBenefit1Description,
			Benefit2Title:       m.WhyNFCBenefit2Title,
			Benefit2Description: m.WhyNFCBenefit2Description,
			Benefit3Title:       m.WhyNFCBenefit3Title,
			Benefit3Description: m.WhyNFCBenefit3Description,
			Benefit4Title:       m.WhyNFCBenefit4Title,
			Benefit4Description: m.WhyNFCBenefit4Description,
		},
		WhyUs: entity.WhyUsSection{
			Section:             entity.Section{Enabled: m.WhyUsEnabled, Order: m.WhyUsOrder},
			Title:               m.WhyUsTitle,
			Subtitle:            m.WhyUsSubtitle,
			Feature1Title:       m.WhyUsFeature1Title,
			Feature1Description: m.WhyUsFeature1Description,
			Feature2Title:       m.WhyUsFeature2Title,
			Feature2Description: m.WhyUsFeature2Description,
			Feature3Title:       m.WhyUsFeature3Title,
			Feature3Description: m.WhyUsFeature3Description,
		},
		Preview: entity.PreviewSection{
			Section:     entity.Section{Enabled: m.PreviewEnabled, Order: m.PreviewOrder},
			Title:       m.PreviewTitle,
			Subtitle:    m.PreviewSubtitle,
			Description: m.PreviewDescription,
		},
		FAQ: entity.FAQSection{
			Section:      entity.Section{Enabled: m.FAQEnabled, Order: m.FAQOrder},
			Title:        m.FAQTitle,
			Subtitle:     m.FAQSubtitle,
			FAQ1Question: m.FAQFAQ1Question,
			FAQ1Answer:   m.FAQFAQ1Answer,
			FAQ2Question: m.FAQFAQ2Question,
			FAQ2Answer:   m.FAQFAQ2Answer,
			FAQ3Question: m.FAQFAQ3Question,
			FAQ3Answer:   m.FAQFAQ3Answer,
			FAQ4Question: m.FAQFAQ4Question,
			FAQ4Answer:   m.FAQFAQ4Answer,
		},
		FinalCTA: entity.FinalCTASection{
			Section:    entity.Section{Enabled: m.FinalCTAEnabled, Order: m.FinalCTAOrder},
			Title:      m.FinalCTATitle,
			Subtitle:   m.FinalCTASubtitle,
			ButtonText: m.FinalCTAButtonText,
		},
		MetaTitle:       m.MetaTitle,
		MetaDescription: m.MetaDescription,
		OGTitle:         m.OGTitle,
		OGDescription:   m.OGDescription,
		OGImage:         m.OGImage,
		UpdatedBy:       m.UpdatedBy,
	}
}

// FromEntity converts domain entity to GORM model
func FromEntity(e *entity.HomeSettings) *HomeSettingsModel {
	return &HomeSettingsModel{
		ID: e.ID,
		// Hero
		HeroEnabled:        e.Hero.Enabled,
		HeroOrder:          e.Hero.Order,
		HeroBadgeText:      e.Hero.BadgeText,
		HeroBadgeIcon:      e.Hero.BadgeIcon,
		HeroTitleHighlight: e.Hero.TitleHighlight,
		HeroTitleRest:      e.Hero.TitleRest,
		HeroSubtitle:       e.Hero.Subtitle,
		HeroFeature1:       e.Hero.Feature1,
		HeroFeature2:       e.Hero.Feature2,
		HeroFeature3:       e.Hero.Feature3,
		HeroCTAPrimary:     e.Hero.CTAPrimary,
		HeroCTASecondary:   e.Hero.CTASecondary,
		HeroCTATertiary:    e.Hero.CTATertiary,
		// What Is It
		WhatIsItEnabled:             e.WhatIsIt.Enabled,
		WhatIsItOrder:               e.WhatIsIt.Order,
		WhatIsItTitle:               e.WhatIsIt.Title,
		WhatIsItSubtitle:            e.WhatIsIt.Subtitle,
		WhatIsItFeature1Title:       e.WhatIsIt.Feature1Title,
		WhatIsItFeature1Description: e.WhatIsIt.Feature1Description,
		WhatIsItFeature2Title:       e.WhatIsIt.Feature2Title,
		WhatIsItFeature2Description: e.WhatIsIt.Feature2Description,
		WhatIsItFeature3Title:       e.WhatIsIt.Feature3Title,
		WhatIsItFeature3Description: e.WhatIsIt.Feature3Description,
		// SKU
		SKUEnabled:   e.SKU.Enabled,
		SKUOrder:     e.SKU.Order,
		SKUTitle:     e.SKU.Title,
		SKUSubtitle:  e.SKU.Subtitle,
		SKUCardTitle: e.SKU.CardTitle,

		SKUCard1Label: e.SKU.Card1Label,
		SKUCard2Label: e.SKU.Card2Label,
		SKUCard3Label: e.SKU.Card3Label,

		SKUExpressEnabled:     e.SKU.ExpressEnabled,
		SKUExpressBadgeText:   e.SKU.ExpressBadgeText,
		SKUExpressBadgeIcon:   e.SKU.ExpressBadgeIcon,
		SKUExpressBadgeColor:  e.SKU.ExpressBadgeColor,
		SKUExpressEmoji:       e.SKU.ExpressEmoji,
		SKUExpressName:        e.SKU.ExpressName,
		SKUExpressTagline:     e.SKU.ExpressTagline,
		SKUExpressDescription: e.SKU.ExpressDescription,
		SKUExpressFeature1:    e.SKU.ExpressFeature1,
		SKUExpressFeature2:    e.SKU.ExpressFeature2,
		SKUExpressFeature3:    e.SKU.ExpressFeature3,
		SKUExpressFeature4:    e.SKU.ExpressFeature4,
		SKUExpressButtonText:  e.SKU.ExpressButtonText,
		SKUExpressButtonLink:  e.SKU.ExpressButtonLink,
		SKUExpressFooterText:  e.SKU.ExpressFooterText,

		SKUSquadEnabled:     e.SKU.SquadEnabled,
		SKUSquadBadgeText:   e.SKU.SquadBadgeText,
		SKUSquadBadgeIcon:   e.SKU.SquadBadgeIcon,
		SKUSquadBadgeColor:  e.SKU.SquadBadgeColor,
		SKUSquadEmoji:       e.SKU.SquadEmoji,
		SKUSquadName:        e.SKU.SquadName,
		SKUSquadTagline:     e.SKU.SquadTagline,
		SKUSquadDescription: e.SKU.SquadDescription,
		SKUSquadFeature1:    e.SKU.SquadFeature1,
		SKUSquadFeature2:    e.SKU.SquadFeature2,
		SKUSquadFeature3:    e.SKU.SquadFeature3,
		SKUSquadFeature4:    e.SKU.SquadFeature4,
		SKUSquadButtonText:  e.SKU.SquadButtonText,
		SKUSquadButtonLink:  e.SKU.SquadButtonLink,
		SKUSquadFooterText:  e.SKU.SquadFooterText,

		SKUGreetingEnabled:     e.SKU.GreetingEnabled,
		SKUGreetingBadgeText:   e.SKU.GreetingBadgeText,
		SKUGreetingBadgeIcon:   e.SKU.GreetingBadgeIcon,
		SKUGreetingBadgeColor:  e.SKU.GreetingBadgeColor,
		SKUGreetingEmoji:       e.SKU.GreetingEmoji,
		SKUGreetingName:        e.SKU.GreetingName,
		SKUGreetingTagline:     e.SKU.GreetingTagline,
		SKUGreetingDescription: e.SKU.GreetingDescription,
		SKUGreetingFeature1:    e.SKU.GreetingFeature1,
		SKUGreetingFeature2:    e.SKU.GreetingFeature2,
		SKUGreetingFeature3:    e.SKU.GreetingFeature3,
		SKUGreetingFeature4:    e.SKU.GreetingFeature4,
		SKUGreetingButtonText:  e.SKU.GreetingButtonText,
		SKUGreetingButtonLink:  e.SKU.GreetingButtonLink,
		SKUGreetingFooterText:  e.SKU.GreetingFooterText,
		// How It Works
		HowItWorksEnabled:          e.HowItWorks.Enabled,
		HowItWorksOrder:            e.HowItWorks.Order,
		HowItWorksTitle:            e.HowItWorks.Title,
		HowItWorksSubtitle:         e.HowItWorks.Subtitle,
		HowItWorksStep1Title:       e.HowItWorks.Step1Title,
		HowItWorksStep1Description: e.HowItWorks.Step1Description,
		HowItWorksStep2Title:       e.HowItWorks.Step2Title,
		HowItWorksStep2Description: e.HowItWorks.Step2Description,
		HowItWorksStep3Title:       e.HowItWorks.Step3Title,
		HowItWorksStep3Description: e.HowItWorks.Step3Description,
		// Occasions
		OccasionsEnabled:       e.Occasions.Enabled,
		OccasionsOrder:         e.Occasions.Order,
		OccasionsTitle:         e.Occasions.Title,
		OccasionsSubtitle:      e.Occasions.Subtitle,
		OccasionsOccasion1:     e.Occasions.Occasion1,
		OccasionsOccasion1Icon: e.Occasions.Occasion1Icon,
		OccasionsOccasion2:     e.Occasions.Occasion2,
		OccasionsOccasion2Icon: e.Occasions.Occasion2Icon,
		OccasionsOccasion3:     e.Occasions.Occasion3,
		OccasionsOccasion3Icon: e.Occasions.Occasion3Icon,
		OccasionsOccasion4:     e.Occasions.Occasion4,
		OccasionsOccasion4Icon: e.Occasions.Occasion4Icon,
		OccasionsOccasion5:     e.Occasions.Occasion5,
		OccasionsOccasion5Icon: e.Occasions.Occasion5Icon,
		OccasionsOccasion6:     e.Occasions.Occasion6,
		OccasionsOccasion6Icon: e.Occasions.Occasion6Icon,
		OccasionsOccasion7:     e.Occasions.Occasion7,
		OccasionsOccasion7Icon: e.Occasions.Occasion7Icon,
		OccasionsOccasion8:     e.Occasions.Occasion8,
		OccasionsOccasion8Icon: e.Occasions.Occasion8Icon,
		OccasionsOccasion9:     e.Occasions.Occasion9,
		OccasionsOccasion9Icon: e.Occasions.Occasion9Icon,
		// Why NFC
		WhyNFCEnabled:             e.WhyNFC.Enabled,
		WhyNFCOrder:               e.WhyNFC.Order,
		WhyNFCTitle:               e.WhyNFC.Title,
		WhyNFCSubtitle:            e.WhyNFC.Subtitle,
		WhyNFCBenefit1Title:       e.WhyNFC.Benefit1Title,
		WhyNFCBenefit1Description: e.WhyNFC.Benefit1Description,
		WhyNFCBenefit2Title:       e.WhyNFC.Benefit2Title,
		WhyNFCBenefit2Description: e.WhyNFC.Benefit2Description,
		WhyNFCBenefit3Title:       e.WhyNFC.Benefit3Title,
		WhyNFCBenefit3Description: e.WhyNFC.Benefit3Description,
		WhyNFCBenefit4Title:       e.WhyNFC.Benefit4Title,
		WhyNFCBenefit4Description: e.WhyNFC.Benefit4Description,
		// Why Us
		WhyUsEnabled:             e.WhyUs.Enabled,
		WhyUsOrder:               e.WhyUs.Order,
		WhyUsTitle:               e.WhyUs.Title,
		WhyUsSubtitle:            e.WhyUs.Subtitle,
		WhyUsFeature1Title:       e.WhyUs.Feature1Title,
		WhyUsFeature1Description: e.WhyUs.Feature1Description,
		WhyUsFeature2Title:       e.WhyUs.Feature2Title,
		WhyUsFeature2Description: e.WhyUs.Feature2Description,
		WhyUsFeature3Title:       e.WhyUs.Feature3Title,
		WhyUsFeature3Description: e.WhyUs.Feature3Description,
		// Preview
		PreviewEnabled:     e.Preview.Enabled,
		PreviewOrder:       e.Preview.Order,
		PreviewTitle:       e.Preview.Title,
		PreviewSubtitle:    e.Preview.Subtitle,
		PreviewDescription: e.Preview.Description,
		// FAQ
		FAQEnabled:      e.FAQ.Enabled,
		FAQOrder:        e.FAQ.Order,
		FAQTitle:        e.FAQ.Title,
		FAQSubtitle:     e.FAQ.Subtitle,
		FAQFAQ1Question: e.FAQ.FAQ1Question,
		FAQFAQ1Answer:   e.FAQ.FAQ1Answer,
		FAQFAQ2Question: e.FAQ.FAQ2Question,
		FAQFAQ2Answer:   e.FAQ.FAQ2Answer,
		FAQFAQ3Question: e.FAQ.FAQ3Question,
		FAQFAQ3Answer:   e.FAQ.FAQ3Answer,
		FAQFAQ4Question: e.FAQ.FAQ4Question,
		FAQFAQ4Answer:   e.FAQ.FAQ4Answer,
		// Final CTA
		FinalCTAEnabled:    e.FinalCTA.Enabled,
		FinalCTAOrder:      e.FinalCTA.Order,
		FinalCTATitle:      e.FinalCTA.Title,
		FinalCTASubtitle:   e.FinalCTA.Subtitle,
		FinalCTAButtonText: e.FinalCTA.ButtonText,
		// Meta
		MetaTitle:       e.MetaTitle,
		MetaDescription: e.MetaDescription,
		OGTitle:         e.OGTitle,
		OGDescription:   e.OGDescription,
		OGImage:         e.OGImage,
		UpdatedBy:       e.UpdatedBy,
	}
}
