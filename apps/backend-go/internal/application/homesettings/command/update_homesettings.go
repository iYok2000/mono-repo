package command

import (
	"context"

	"monorepo/backend-go/internal/application/homesettings/dto"
	"monorepo/backend-go/internal/application/homesettings/mapper"
	"monorepo/backend-go/internal/core/domain/homesettings/repository"
)

// UpdateHomeSettingsHandler handles updating home settings
type UpdateHomeSettingsHandler struct {
	repo repository.HomeSettingsRepository
}

// NewUpdateHomeSettingsHandler creates a new UpdateHomeSettingsHandler
func NewUpdateHomeSettingsHandler(repo repository.HomeSettingsRepository) *UpdateHomeSettingsHandler {
	return &UpdateHomeSettingsHandler{repo: repo}
}

// Handle executes the command to update home settings
func (h *UpdateHomeSettingsHandler) Handle(ctx context.Context, updateDTO *dto.UpdateHomeSettingsDTO, updatedBy string) (*dto.HomeSettingsDTO, error) {
	// Get existing settings
	existing, err := h.repo.Get(ctx)
	if err != nil {
		return nil, err
	}

	// Apply partial updates
	if updateDTO.Hero != nil {
		existing.Hero.Enabled = updateDTO.Hero.Enabled
		existing.Hero.Order = updateDTO.Hero.Order
		existing.Hero.BadgeText = updateDTO.Hero.BadgeText
		existing.Hero.BadgeIcon = updateDTO.Hero.BadgeIcon
		existing.Hero.TitleHighlight = updateDTO.Hero.TitleHighlight
		existing.Hero.TitleRest = updateDTO.Hero.TitleRest
		existing.Hero.Subtitle = updateDTO.Hero.Subtitle
		existing.Hero.Feature1 = updateDTO.Hero.Feature1
		existing.Hero.Feature2 = updateDTO.Hero.Feature2
		existing.Hero.Feature3 = updateDTO.Hero.Feature3
		existing.Hero.CTAPrimary = updateDTO.Hero.CTAPrimary
		existing.Hero.CTASecondary = updateDTO.Hero.CTASecondary
		existing.Hero.CTATertiary = updateDTO.Hero.CTATertiary
	}

	if updateDTO.WhatIsIt != nil {
		existing.WhatIsIt.Enabled = updateDTO.WhatIsIt.Enabled
		existing.WhatIsIt.Order = updateDTO.WhatIsIt.Order
		existing.WhatIsIt.Title = updateDTO.WhatIsIt.Title
		existing.WhatIsIt.Subtitle = updateDTO.WhatIsIt.Subtitle
		existing.WhatIsIt.Feature1Title = updateDTO.WhatIsIt.Feature1Title
		existing.WhatIsIt.Feature1Description = updateDTO.WhatIsIt.Feature1Description
		existing.WhatIsIt.Feature2Title = updateDTO.WhatIsIt.Feature2Title
		existing.WhatIsIt.Feature2Description = updateDTO.WhatIsIt.Feature2Description
		existing.WhatIsIt.Feature3Title = updateDTO.WhatIsIt.Feature3Title
		existing.WhatIsIt.Feature3Description = updateDTO.WhatIsIt.Feature3Description
	}

	if updateDTO.SKU != nil {
		existing.SKU.Enabled = updateDTO.SKU.Enabled
		existing.SKU.Order = updateDTO.SKU.Order
		existing.SKU.Title = updateDTO.SKU.Title
		existing.SKU.Subtitle = updateDTO.SKU.Subtitle
		existing.SKU.CardTitle = updateDTO.SKU.CardTitle

		existing.SKU.Card1Label = updateDTO.SKU.Card1Label
		existing.SKU.Card2Label = updateDTO.SKU.Card2Label
		existing.SKU.Card3Label = updateDTO.SKU.Card3Label

		existing.SKU.ExpressEnabled = updateDTO.SKU.ExpressEnabled
		existing.SKU.ExpressBadgeText = updateDTO.SKU.ExpressBadgeText
		existing.SKU.ExpressBadgeIcon = updateDTO.SKU.ExpressBadgeIcon
		existing.SKU.ExpressBadgeColor = updateDTO.SKU.ExpressBadgeColor
		existing.SKU.ExpressEmoji = updateDTO.SKU.ExpressEmoji
		existing.SKU.ExpressName = updateDTO.SKU.ExpressName
		existing.SKU.ExpressTagline = updateDTO.SKU.ExpressTagline
		existing.SKU.ExpressDescription = updateDTO.SKU.ExpressDescription
		existing.SKU.ExpressFeature1 = updateDTO.SKU.ExpressFeature1
		existing.SKU.ExpressFeature2 = updateDTO.SKU.ExpressFeature2
		existing.SKU.ExpressFeature3 = updateDTO.SKU.ExpressFeature3
		existing.SKU.ExpressFeature4 = updateDTO.SKU.ExpressFeature4
		existing.SKU.ExpressButtonText = updateDTO.SKU.ExpressButtonText
		existing.SKU.ExpressButtonLink = updateDTO.SKU.ExpressButtonLink
		existing.SKU.ExpressFooterText = updateDTO.SKU.ExpressFooterText

		existing.SKU.SquadEnabled = updateDTO.SKU.SquadEnabled
		existing.SKU.SquadBadgeText = updateDTO.SKU.SquadBadgeText
		existing.SKU.SquadBadgeIcon = updateDTO.SKU.SquadBadgeIcon
		existing.SKU.SquadBadgeColor = updateDTO.SKU.SquadBadgeColor
		existing.SKU.SquadEmoji = updateDTO.SKU.SquadEmoji
		existing.SKU.SquadName = updateDTO.SKU.SquadName
		existing.SKU.SquadTagline = updateDTO.SKU.SquadTagline
		existing.SKU.SquadDescription = updateDTO.SKU.SquadDescription
		existing.SKU.SquadFeature1 = updateDTO.SKU.SquadFeature1
		existing.SKU.SquadFeature2 = updateDTO.SKU.SquadFeature2
		existing.SKU.SquadFeature3 = updateDTO.SKU.SquadFeature3
		existing.SKU.SquadFeature4 = updateDTO.SKU.SquadFeature4
		existing.SKU.SquadButtonText = updateDTO.SKU.SquadButtonText
		existing.SKU.SquadButtonLink = updateDTO.SKU.SquadButtonLink
		existing.SKU.SquadFooterText = updateDTO.SKU.SquadFooterText

		existing.SKU.GreetingEnabled = updateDTO.SKU.GreetingEnabled
		existing.SKU.GreetingBadgeText = updateDTO.SKU.GreetingBadgeText
		existing.SKU.GreetingBadgeIcon = updateDTO.SKU.GreetingBadgeIcon
		existing.SKU.GreetingBadgeColor = updateDTO.SKU.GreetingBadgeColor
		existing.SKU.GreetingEmoji = updateDTO.SKU.GreetingEmoji
		existing.SKU.GreetingName = updateDTO.SKU.GreetingName
		existing.SKU.GreetingTagline = updateDTO.SKU.GreetingTagline
		existing.SKU.GreetingDescription = updateDTO.SKU.GreetingDescription
		existing.SKU.GreetingFeature1 = updateDTO.SKU.GreetingFeature1
		existing.SKU.GreetingFeature2 = updateDTO.SKU.GreetingFeature2
		existing.SKU.GreetingFeature3 = updateDTO.SKU.GreetingFeature3
		existing.SKU.GreetingFeature4 = updateDTO.SKU.GreetingFeature4
		existing.SKU.GreetingButtonText = updateDTO.SKU.GreetingButtonText
		existing.SKU.GreetingButtonLink = updateDTO.SKU.GreetingButtonLink
		existing.SKU.GreetingFooterText = updateDTO.SKU.GreetingFooterText
	}

	if updateDTO.HowItWorks != nil {
		existing.HowItWorks.Enabled = updateDTO.HowItWorks.Enabled
		existing.HowItWorks.Order = updateDTO.HowItWorks.Order
		existing.HowItWorks.Title = updateDTO.HowItWorks.Title
		existing.HowItWorks.Subtitle = updateDTO.HowItWorks.Subtitle
		existing.HowItWorks.Step1Title = updateDTO.HowItWorks.Step1Title
		existing.HowItWorks.Step1Description = updateDTO.HowItWorks.Step1Description
		existing.HowItWorks.Step2Title = updateDTO.HowItWorks.Step2Title
		existing.HowItWorks.Step2Description = updateDTO.HowItWorks.Step2Description
		existing.HowItWorks.Step3Title = updateDTO.HowItWorks.Step3Title
		existing.HowItWorks.Step3Description = updateDTO.HowItWorks.Step3Description
	}

	if updateDTO.Occasions != nil {
		existing.Occasions.Enabled = updateDTO.Occasions.Enabled
		existing.Occasions.Order = updateDTO.Occasions.Order
		existing.Occasions.Title = updateDTO.Occasions.Title
		existing.Occasions.Subtitle = updateDTO.Occasions.Subtitle
		existing.Occasions.Occasion1 = updateDTO.Occasions.Occasion1
		existing.Occasions.Occasion1Icon = updateDTO.Occasions.Occasion1Icon
		existing.Occasions.Occasion2 = updateDTO.Occasions.Occasion2
		existing.Occasions.Occasion2Icon = updateDTO.Occasions.Occasion2Icon
		existing.Occasions.Occasion3 = updateDTO.Occasions.Occasion3
		existing.Occasions.Occasion3Icon = updateDTO.Occasions.Occasion3Icon
		existing.Occasions.Occasion4 = updateDTO.Occasions.Occasion4
		existing.Occasions.Occasion4Icon = updateDTO.Occasions.Occasion4Icon
		existing.Occasions.Occasion5 = updateDTO.Occasions.Occasion5
		existing.Occasions.Occasion5Icon = updateDTO.Occasions.Occasion5Icon
		existing.Occasions.Occasion6 = updateDTO.Occasions.Occasion6
		existing.Occasions.Occasion6Icon = updateDTO.Occasions.Occasion6Icon
		existing.Occasions.Occasion7 = updateDTO.Occasions.Occasion7
		existing.Occasions.Occasion7Icon = updateDTO.Occasions.Occasion7Icon
		existing.Occasions.Occasion8 = updateDTO.Occasions.Occasion8
		existing.Occasions.Occasion8Icon = updateDTO.Occasions.Occasion8Icon
		existing.Occasions.Occasion9 = updateDTO.Occasions.Occasion9
		existing.Occasions.Occasion9Icon = updateDTO.Occasions.Occasion9Icon
	}

	if updateDTO.WhyNFC != nil {
		existing.WhyNFC.Enabled = updateDTO.WhyNFC.Enabled
		existing.WhyNFC.Order = updateDTO.WhyNFC.Order
		existing.WhyNFC.Title = updateDTO.WhyNFC.Title
		existing.WhyNFC.Subtitle = updateDTO.WhyNFC.Subtitle
		existing.WhyNFC.Benefit1Title = updateDTO.WhyNFC.Benefit1Title
		existing.WhyNFC.Benefit1Description = updateDTO.WhyNFC.Benefit1Description
		existing.WhyNFC.Benefit2Title = updateDTO.WhyNFC.Benefit2Title
		existing.WhyNFC.Benefit2Description = updateDTO.WhyNFC.Benefit2Description
		existing.WhyNFC.Benefit3Title = updateDTO.WhyNFC.Benefit3Title
		existing.WhyNFC.Benefit3Description = updateDTO.WhyNFC.Benefit3Description
		existing.WhyNFC.Benefit4Title = updateDTO.WhyNFC.Benefit4Title
		existing.WhyNFC.Benefit4Description = updateDTO.WhyNFC.Benefit4Description
	}

	if updateDTO.WhyUs != nil {
		existing.WhyUs.Enabled = updateDTO.WhyUs.Enabled
		existing.WhyUs.Order = updateDTO.WhyUs.Order
		existing.WhyUs.Title = updateDTO.WhyUs.Title
		existing.WhyUs.Subtitle = updateDTO.WhyUs.Subtitle
		existing.WhyUs.Feature1Title = updateDTO.WhyUs.Feature1Title
		existing.WhyUs.Feature1Description = updateDTO.WhyUs.Feature1Description
		existing.WhyUs.Feature2Title = updateDTO.WhyUs.Feature2Title
		existing.WhyUs.Feature2Description = updateDTO.WhyUs.Feature2Description
		existing.WhyUs.Feature3Title = updateDTO.WhyUs.Feature3Title
		existing.WhyUs.Feature3Description = updateDTO.WhyUs.Feature3Description
	}

	if updateDTO.Preview != nil {
		existing.Preview.Enabled = updateDTO.Preview.Enabled
		existing.Preview.Order = updateDTO.Preview.Order
		existing.Preview.Title = updateDTO.Preview.Title
		existing.Preview.Subtitle = updateDTO.Preview.Subtitle
		existing.Preview.Description = updateDTO.Preview.Description
	}

	if updateDTO.FAQ != nil {
		existing.FAQ.Enabled = updateDTO.FAQ.Enabled
		existing.FAQ.Order = updateDTO.FAQ.Order
		existing.FAQ.Title = updateDTO.FAQ.Title
		existing.FAQ.Subtitle = updateDTO.FAQ.Subtitle
		existing.FAQ.FAQ1Question = updateDTO.FAQ.FAQ1Question
		existing.FAQ.FAQ1Answer = updateDTO.FAQ.FAQ1Answer
		existing.FAQ.FAQ2Question = updateDTO.FAQ.FAQ2Question
		existing.FAQ.FAQ2Answer = updateDTO.FAQ.FAQ2Answer
		existing.FAQ.FAQ3Question = updateDTO.FAQ.FAQ3Question
		existing.FAQ.FAQ3Answer = updateDTO.FAQ.FAQ3Answer
		existing.FAQ.FAQ4Question = updateDTO.FAQ.FAQ4Question
		existing.FAQ.FAQ4Answer = updateDTO.FAQ.FAQ4Answer
	}

	if updateDTO.FinalCTA != nil {
		existing.FinalCTA.Enabled = updateDTO.FinalCTA.Enabled
		existing.FinalCTA.Order = updateDTO.FinalCTA.Order
		existing.FinalCTA.Title = updateDTO.FinalCTA.Title
		existing.FinalCTA.Subtitle = updateDTO.FinalCTA.Subtitle
		existing.FinalCTA.ButtonText = updateDTO.FinalCTA.ButtonText
	}

	if updateDTO.MetaTitle != nil {
		existing.MetaTitle = *updateDTO.MetaTitle
	}
	if updateDTO.MetaDescription != nil {
		existing.MetaDescription = *updateDTO.MetaDescription
	}
	if updateDTO.OGTitle != nil {
		existing.OGTitle = *updateDTO.OGTitle
	}
	if updateDTO.OGDescription != nil {
		existing.OGDescription = *updateDTO.OGDescription
	}
	if updateDTO.OGImage != nil {
		existing.OGImage = *updateDTO.OGImage
	}

	existing.UpdatedBy = updatedBy

	// Save updated settings
	if err := h.repo.Update(ctx, existing); err != nil {
		return nil, err
	}

	return mapper.ToDTO(existing), nil
}
