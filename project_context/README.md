# Project Context Documentation

This folder contains detailed documentation for each feature and module in the project.

## Structure

```
project_context
├── README.md           # This file
├── TEMPLATE.md         # Template for new feature docs
└── [feature-name].md   # Individual feature documentation
```

## Naming Convention

- Use `kebab-case.md` for file names
- Be descriptive but concise
- Examples:
  - `user-authentication.md`
  - `payment-processing.md`
  - `real-time-notifications.md`
  - `file-upload-system.md`

## When to Create New Feature Doc

Create a new feature documentation file when:

- ✅ Building a significant new feature
- ✅ The feature has complex business logic
- ✅ Multiple components are involved
- ✅ Future developers (or AI) need to understand the WHY and HOW

Don't create separate doc for:

- ❌ Simple utility functions
- ❌ Minor UI tweaks
- ❌ Small bug fixes (unless they reveal important patterns)

## How AI Agents Should Use This

1. **Before implementing new feature**:

   - Check if similar feature doc exists
   - Read relevant docs to understand patterns
   - Read root `Document.md`, `AGENT.md`, `PROJECT_CONTEXT.md`, `DEVELOPMENT.md` for the mandatory pre-flight rules (rename/migration guard, GORM FK/index requirements, build/type-check expectations)

2. **After implementing feature**:

   - Ask user: "Should I document this in project_context/?"
   - Create new file using TEMPLATE.md
   - Add link to main PROJECT_CONTEXT.md

3. **When modifying existing feature**:
   - Read the feature doc first
   - After changes, ask: "Should I update [feature-name].md?"
   - Keep documentation in sync with code

## Best Practices

- **Keep it current**: Update docs when code changes
- **Be concise**: Focus on WHY and HOW, not every detail
- **Include examples**: Code snippets help understanding
- **Link related docs**: Reference other features when relevant
- **Explain trade-offs**: Document decisions and alternatives considered

## For Humans

These docs are designed to be readable by both humans and AI assistants. They serve as:

- Onboarding material for new developers
- Context for AI coding assistants
- Decision log for architectural choices
- Quick reference for feature functionality

---

**Maintained by**: AI Agents + Human Developers  
**Last Updated**: [Date]
