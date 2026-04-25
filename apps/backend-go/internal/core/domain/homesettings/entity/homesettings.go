package entity

// HomeSettings represents the complete home page settings
type HomeSettings struct {
	ID string

	// Hero Section
	Hero HeroSection

	// What Is It Section
	WhatIsIt WhatIsItSection

	// SKU Section
	SKU SKUSection

	// How It Works Section
	HowItWorks HowItWorksSection

	// Occasions Section
	Occasions OccasionsSection

	// Why NFC Section
	WhyNFC WhyNFCSection

	// Why Us Section
	WhyUs WhyUsSection

	// Preview Section
	Preview PreviewSection

	// FAQ Section
	FAQ FAQSection

	// Final CTA Section
	FinalCTA FinalCTASection

	// SEO & OG Meta
	MetaTitle       string
	MetaDescription string
	OGTitle         string
	OGDescription   string
	OGImage         string

	// Metadata
	UpdatedBy string
}

// Section represents common section properties
type Section struct {
	Enabled bool
	Order   int
}

// HeroSection represents hero section settings
type HeroSection struct {
	Section
	BadgeText      string
	BadgeIcon      string
	TitleHighlight string
	TitleRest      string
	Subtitle       string
	Feature1       string
	Feature2       string
	Feature3       string
	CTAPrimary     string
	CTASecondary   string
	CTATertiary    string
}

// WhatIsItSection represents what is it section settings
type WhatIsItSection struct {
	Section
	Title               string
	Subtitle            string
	Feature1Title       string
	Feature1Description string
	Feature2Title       string
	Feature2Description string
	Feature3Title       string
	Feature3Description string
}

// SKUSection represents SKU/products section settings
type SKUSection struct {
	Section
	Title     string
	Subtitle  string
	CardTitle string

	// Card Labels
	Card1Label string
	Card2Label string
	Card3Label string

	// Express Card
	ExpressEnabled     bool
	ExpressBadgeText   string
	ExpressBadgeIcon   string
	ExpressBadgeColor  string
	ExpressEmoji       string
	ExpressName        string
	ExpressTagline     string
	ExpressDescription string
	ExpressFeature1    string
	ExpressFeature2    string
	ExpressFeature3    string
	ExpressFeature4    string
	ExpressButtonText  string
	ExpressButtonLink  string
	ExpressFooterText  string

	// Squad Card
	SquadEnabled     bool
	SquadBadgeText   string
	SquadBadgeIcon   string
	SquadBadgeColor  string
	SquadEmoji       string
	SquadName        string
	SquadTagline     string
	SquadDescription string
	SquadFeature1    string
	SquadFeature2    string
	SquadFeature3    string
	SquadFeature4    string
	SquadButtonText  string
	SquadButtonLink  string
	SquadFooterText  string

	// Greeting Card
	GreetingEnabled     bool
	GreetingBadgeText   string
	GreetingBadgeIcon   string
	GreetingBadgeColor  string
	GreetingEmoji       string
	GreetingName        string
	GreetingTagline     string
	GreetingDescription string
	GreetingFeature1    string
	GreetingFeature2    string
	GreetingFeature3    string
	GreetingFeature4    string
	GreetingButtonText  string
	GreetingButtonLink  string
	GreetingFooterText  string
}

// HowItWorksSection represents how it works section settings
type HowItWorksSection struct {
	Section
	Title            string
	Subtitle         string
	Step1Title       string
	Step1Description string
	Step2Title       string
	Step2Description string
	Step3Title       string
	Step3Description string
}

// OccasionsSection represents occasions section settings
type OccasionsSection struct {
	Section
	Title         string
	Subtitle      string
	Occasion1     string
	Occasion1Icon string
	Occasion2     string
	Occasion2Icon string
	Occasion3     string
	Occasion3Icon string
	Occasion4     string
	Occasion4Icon string
	Occasion5     string
	Occasion5Icon string
	Occasion6     string
	Occasion6Icon string
	Occasion7     string
	Occasion7Icon string
	Occasion8     string
	Occasion8Icon string
	Occasion9     string
	Occasion9Icon string
}

// WhyNFCSection represents why NFC section settings
type WhyNFCSection struct {
	Section
	Title               string
	Subtitle            string
	Benefit1Title       string
	Benefit1Description string
	Benefit2Title       string
	Benefit2Description string
	Benefit3Title       string
	Benefit3Description string
	Benefit4Title       string
	Benefit4Description string
}

// WhyUsSection represents why us section settings
type WhyUsSection struct {
	Section
	Title               string
	Subtitle            string
	Feature1Title       string
	Feature1Description string
	Feature2Title       string
	Feature2Description string
	Feature3Title       string
	Feature3Description string
}

// PreviewSection represents preview section settings
type PreviewSection struct {
	Section
	Title       string
	Subtitle    string
	Description string
}

// FAQSection represents FAQ section settings
type FAQSection struct {
	Section
	Title        string
	Subtitle     string
	FAQ1Question string
	FAQ1Answer   string
	FAQ2Question string
	FAQ2Answer   string
	FAQ3Question string
	FAQ3Answer   string
	FAQ4Question string
	FAQ4Answer   string
}

// FinalCTASection represents final CTA section settings
type FinalCTASection struct {
	Section
	Title      string
	Subtitle   string
	ButtonText string
}
