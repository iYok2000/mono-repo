package dto

// HomeSettingsDTO represents the data transfer object for home settings
type HomeSettingsDTO struct {
	ID string `json:"id"`

	// Hero Section
	Hero HeroSectionDTO `json:"hero"`

	// What Is It Section
	WhatIsIt WhatIsItSectionDTO `json:"what_is_it"`

	// SKU Section
	SKU SKUSectionDTO `json:"sku"`

	// How It Works Section
	HowItWorks HowItWorksSectionDTO `json:"how_it_works"`

	// Occasions Section
	Occasions OccasionsSectionDTO `json:"occasions"`

	// Why NFC Section
	WhyNFC WhyNFCSectionDTO `json:"why_nfc"`

	// Why Us Section
	WhyUs WhyUsSectionDTO `json:"why_us"`

	// Preview Section
	Preview PreviewSectionDTO `json:"preview"`

	// FAQ Section
	FAQ FAQSectionDTO `json:"faq"`

	// Final CTA Section
	FinalCTA FinalCTASectionDTO `json:"final_cta"`

	// SEO & OG Meta
	MetaTitle       string `json:"meta_title"`
	MetaDescription string `json:"meta_description"`
	OGTitle         string `json:"og_title"`
	OGDescription   string `json:"og_description"`
	OGImage         string `json:"og_image"`

	UpdatedBy string `json:"updated_by"`
}

type HeroSectionDTO struct {
	Enabled        bool   `json:"enabled"`
	Order          int    `json:"order"`
	BadgeText      string `json:"badge_text"`
	BadgeIcon      string `json:"badge_icon"`
	TitleHighlight string `json:"title_highlight"`
	TitleRest      string `json:"title_rest"`
	Subtitle       string `json:"subtitle"`
	Feature1       string `json:"feature_1"`
	Feature2       string `json:"feature_2"`
	Feature3       string `json:"feature_3"`
	CTAPrimary     string `json:"cta_primary"`
	CTASecondary   string `json:"cta_secondary"`
	CTATertiary    string `json:"cta_tertiary"`
}

type WhatIsItSectionDTO struct {
	Enabled             bool   `json:"enabled"`
	Order               int    `json:"order"`
	Title               string `json:"title"`
	Subtitle            string `json:"subtitle"`
	Feature1Title       string `json:"feature_1_title"`
	Feature1Description string `json:"feature_1_description"`
	Feature2Title       string `json:"feature_2_title"`
	Feature2Description string `json:"feature_2_description"`
	Feature3Title       string `json:"feature_3_title"`
	Feature3Description string `json:"feature_3_description"`
}

type SKUSectionDTO struct {
	Enabled   bool   `json:"enabled"`
	Order     int    `json:"order"`
	Title     string `json:"title"`
	Subtitle  string `json:"subtitle"`
	CardTitle string `json:"card_title"`

	// Card Labels
	Card1Label string `json:"card_1_label"`
	Card2Label string `json:"card_2_label"`
	Card3Label string `json:"card_3_label"`

	// Express Card (Card 1)
	ExpressEnabled     bool   `json:"express_enabled"`
	ExpressBadgeText   string `json:"express_badge_text"`
	ExpressBadgeIcon   string `json:"express_badge_icon"`
	ExpressBadgeColor  string `json:"express_badge_color"` // primary, violet, amber
	ExpressEmoji       string `json:"express_emoji"`
	ExpressName        string `json:"express_name"`
	ExpressTagline     string `json:"express_tagline"`
	ExpressDescription string `json:"express_description"`
	ExpressFeature1    string `json:"express_feature_1"`
	ExpressFeature2    string `json:"express_feature_2"`
	ExpressFeature3    string `json:"express_feature_3"`
	ExpressFeature4    string `json:"express_feature_4"`
	ExpressButtonText  string `json:"express_button_text"`
	ExpressButtonLink  string `json:"express_button_link"`
	ExpressFooterText  string `json:"express_footer_text"`

	// Squad Card (Card 2)
	SquadEnabled     bool   `json:"squad_enabled"`
	SquadBadgeText   string `json:"squad_badge_text"`
	SquadBadgeIcon   string `json:"squad_badge_icon"`
	SquadBadgeColor  string `json:"squad_badge_color"` // gradient
	SquadEmoji       string `json:"squad_emoji"`
	SquadName        string `json:"squad_name"`
	SquadTagline     string `json:"squad_tagline"`
	SquadDescription string `json:"squad_description"`
	SquadFeature1    string `json:"squad_feature_1"`
	SquadFeature2    string `json:"squad_feature_2"`
	SquadFeature3    string `json:"squad_feature_3"`
	SquadFeature4    string `json:"squad_feature_4"`
	SquadButtonText  string `json:"squad_button_text"`
	SquadButtonLink  string `json:"squad_button_link"`
	SquadFooterText  string `json:"squad_footer_text"`

	// Greeting Card (Card 3)
	GreetingEnabled     bool   `json:"greeting_enabled"`
	GreetingBadgeText   string `json:"greeting_badge_text"`
	GreetingBadgeIcon   string `json:"greeting_badge_icon"`
	GreetingBadgeColor  string `json:"greeting_badge_color"` // amber
	GreetingEmoji       string `json:"greeting_emoji"`
	GreetingName        string `json:"greeting_name"`
	GreetingTagline     string `json:"greeting_tagline"`
	GreetingDescription string `json:"greeting_description"`
	GreetingFeature1    string `json:"greeting_feature_1"`
	GreetingFeature2    string `json:"greeting_feature_2"`
	GreetingFeature3    string `json:"greeting_feature_3"`
	GreetingFeature4    string `json:"greeting_feature_4"`
	GreetingButtonText  string `json:"greeting_button_text"`
	GreetingButtonLink  string `json:"greeting_button_link"`
	GreetingFooterText  string `json:"greeting_footer_text"`
}

type HowItWorksSectionDTO struct {
	Enabled          bool   `json:"enabled"`
	Order            int    `json:"order"`
	Title            string `json:"title"`
	Subtitle         string `json:"subtitle"`
	Step1Title       string `json:"step_1_title"`
	Step1Description string `json:"step_1_description"`
	Step2Title       string `json:"step_2_title"`
	Step2Description string `json:"step_2_description"`
	Step3Title       string `json:"step_3_title"`
	Step3Description string `json:"step_3_description"`
}

type OccasionsSectionDTO struct {
	Enabled       bool   `json:"enabled"`
	Order         int    `json:"order"`
	Title         string `json:"title"`
	Subtitle      string `json:"subtitle"`
	Occasion1     string `json:"occasion_1"`
	Occasion1Icon string `json:"occasion_1_icon"`
	Occasion2     string `json:"occasion_2"`
	Occasion2Icon string `json:"occasion_2_icon"`
	Occasion3     string `json:"occasion_3"`
	Occasion3Icon string `json:"occasion_3_icon"`
	Occasion4     string `json:"occasion_4"`
	Occasion4Icon string `json:"occasion_4_icon"`
	Occasion5     string `json:"occasion_5"`
	Occasion5Icon string `json:"occasion_5_icon"`
	Occasion6     string `json:"occasion_6"`
	Occasion6Icon string `json:"occasion_6_icon"`
	Occasion7     string `json:"occasion_7"`
	Occasion7Icon string `json:"occasion_7_icon"`
	Occasion8     string `json:"occasion_8"`
	Occasion8Icon string `json:"occasion_8_icon"`
	Occasion9     string `json:"occasion_9"`
	Occasion9Icon string `json:"occasion_9_icon"`
}

type WhyNFCSectionDTO struct {
	Enabled             bool   `json:"enabled"`
	Order               int    `json:"order"`
	Title               string `json:"title"`
	Subtitle            string `json:"subtitle"`
	Benefit1Title       string `json:"benefit_1_title"`
	Benefit1Description string `json:"benefit_1_description"`
	Benefit2Title       string `json:"benefit_2_title"`
	Benefit2Description string `json:"benefit_2_description"`
	Benefit3Title       string `json:"benefit_3_title"`
	Benefit3Description string `json:"benefit_3_description"`
	Benefit4Title       string `json:"benefit_4_title"`
	Benefit4Description string `json:"benefit_4_description"`
}

type WhyUsSectionDTO struct {
	Enabled             bool   `json:"enabled"`
	Order               int    `json:"order"`
	Title               string `json:"title"`
	Subtitle            string `json:"subtitle"`
	Feature1Title       string `json:"feature_1_title"`
	Feature1Description string `json:"feature_1_description"`
	Feature2Title       string `json:"feature_2_title"`
	Feature2Description string `json:"feature_2_description"`
	Feature3Title       string `json:"feature_3_title"`
	Feature3Description string `json:"feature_3_description"`
}

type PreviewSectionDTO struct {
	Enabled     bool   `json:"enabled"`
	Order       int    `json:"order"`
	Title       string `json:"title"`
	Subtitle    string `json:"subtitle"`
	Description string `json:"description"`
}

type FAQSectionDTO struct {
	Enabled      bool   `json:"enabled"`
	Order        int    `json:"order"`
	Title        string `json:"title"`
	Subtitle     string `json:"subtitle"`
	FAQ1Question string `json:"faq_1_question"`
	FAQ1Answer   string `json:"faq_1_answer"`
	FAQ2Question string `json:"faq_2_question"`
	FAQ2Answer   string `json:"faq_2_answer"`
	FAQ3Question string `json:"faq_3_question"`
	FAQ3Answer   string `json:"faq_3_answer"`
	FAQ4Question string `json:"faq_4_question"`
	FAQ4Answer   string `json:"faq_4_answer"`
}

type FinalCTASectionDTO struct {
	Enabled    bool   `json:"enabled"`
	Order      int    `json:"order"`
	Title      string `json:"title"`
	Subtitle   string `json:"subtitle"`
	ButtonText string `json:"button_text"`
}

// UpdateHomeSettingsDTO represents the update request payload
type UpdateHomeSettingsDTO struct {
	Hero       *HeroSectionDTO       `json:"hero,omitempty"`
	WhatIsIt   *WhatIsItSectionDTO   `json:"what_is_it,omitempty"`
	SKU        *SKUSectionDTO        `json:"sku,omitempty"`
	HowItWorks *HowItWorksSectionDTO `json:"how_it_works,omitempty"`
	Occasions  *OccasionsSectionDTO  `json:"occasions,omitempty"`
	WhyNFC     *WhyNFCSectionDTO     `json:"why_nfc,omitempty"`
	WhyUs      *WhyUsSectionDTO      `json:"why_us,omitempty"`
	Preview    *PreviewSectionDTO    `json:"preview,omitempty"`
	FAQ        *FAQSectionDTO        `json:"faq,omitempty"`
	FinalCTA   *FinalCTASectionDTO   `json:"final_cta,omitempty"`

	MetaTitle       *string `json:"meta_title,omitempty"`
	MetaDescription *string `json:"meta_description,omitempty"`
	OGTitle         *string `json:"og_title,omitempty"`
	OGDescription   *string `json:"og_description,omitempty"`
	OGImage         *string `json:"og_image,omitempty"`
}
