# Digital Business Card Feature

> Interactive digital business card with QR code, vCard export, and social media integration

**Created**: 2026-01-29  
**Status**: ✅ Active  
**Route**: `/card/[data]`, `/create/greeting`

---

## 📋 Overview

### What
Digital business card system that allows users to create shareable business cards with:
- Personal/professional information
- Contact details (email, phone, website)
- Social media links (LINE, Instagram, Facebook, LinkedIn)
- QR code generation for easy sharing
- vCard (.vcf) export for contact saving

### Why
- **Contactless sharing**: Share business information via QR code or URL
- **Interactive contacts**: Click-to-call, click-to-email, social media links
- **Modern networking**: Eco-friendly alternative to paper business cards
- **Easy updates**: Update card information without reprinting

### How
1. User fills out business card form at `/create/greeting`
2. Data encoded in URL-safe base64 format
3. Shareable URL generated: `/card/[encoded-data]`
4. Recipients can view card, click contacts, save to phone

---

## 🎨 Features

### 1. Business Card Display (`/card/[data]`)

**Information Fields**:
- Name (Thai/English)
- Position/Title
- Company name
- Company logo
- Email (validated, click to send)
- Phone (click to call)
- Website (click to open)
- Social media handles

**Interactive Elements**:
- **Email**: 
  - ✅ Email validation (regex pattern)
  - Click → Opens mail app
  - Hover → Copy button appears
- **Phone**: 
  - Click → Opens phone dialer
  - Hover → "Save Contact" button (downloads .vcf)
- **Website**: Click → Opens in new tab
- **Social Media**: Click → Opens respective platform

**Social Media Styling**:
- LINE: Official LINE icon, green brand color (#00B900)
- Instagram: Gradient background (pink to purple)
- Facebook: Blue brand color (#1877F2)
- LinkedIn: Blue brand color (#0A66C2)
- All cards have hover effects with brand colors

### 2. Card Creation (`/create/greeting`)

**Form Fields**:
- Name (Thai)
- Name (English) - optional
- Position (Thai)
- Position (English) - optional
- Company name
- Company logo URL
- Theme color picker
- Email (required, validated)
- Phone (required)
- Website
- LINE ID
- Instagram handle
- Facebook handle
- LinkedIn handle

**URL Generation**:
- Data compressed using short keys (e.g., `n` for name, `e` for email)
- UTF-8 encoded → Base64 → URL-safe format (`-` for `+`, `_` for `/`, `~` for `=`)
- One-click copy to clipboard
- Live preview on desktop/mobile

**Preview Modes**:
- Desktop view (landscape)
- Mobile view (portrait)
- Real-time updates as user types

### 3. Contact Export

**vCard Generation**:
```vcard
BEGIN:VCARD
VERSION:3.0
FN:Name
TITLE:Position
ORG:Company
EMAIL:email@example.com
TEL:+66812345678
URL:website.com
END:VCARD
```

**Download**: Saves as `[Name].vcf` file, compatible with all devices

---

## 🔧 Technical Implementation

### Data Structure

```typescript
interface BusinessCardData {
  name: string;           // Full name (Thai)
  nameEn?: string;        // Full name (English)
  position: string;       // Job title (Thai)
  positionEn?: string;    // Job title (English)
  company: string;        // Company name
  logo?: string;          // Logo URL
  themeColor: string;     // Hex color code
  email: string;          // Email (validated)
  phone: string;          // Phone number
  website: string;        // Website URL
  lineId: string;         // LINE ID (with or without @)
  instagram: string;      // Instagram handle
  facebook: string;       // Facebook username
  linkedin: string;       // LinkedIn username
}
```

### URL Encoding/Decoding

**Encoding Process** (Create page):
```typescript
// 1. Map to short keys
const shortData = {
  n: formData.name,
  p: formData.position,
  e: formData.email,
  ph: formData.phone,
  // ... other fields
};

// 2. JSON → UTF-8 → Base64 → URL-safe
const jsonString = JSON.stringify(shortData);
const utf8Bytes = new TextEncoder().encode(jsonString);
let base64 = btoa(String.fromCharCode(...utf8Bytes));
base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '~');

// 3. Generate URL
const url = `${window.location.origin}/card/${base64}`;
```

**Decoding Process** (Card page):
```typescript
// 1. URL-safe → Standard Base64
let base64 = encodedData.replace(/-/g, '+').replace(/_/g, '/').replace(/~/g, '=');

// 2. Base64 → UTF-8 → JSON
const binaryString = atob(base64);
const bytes = new Uint8Array(binaryString.length);
for (let i = 0; i < binaryString.length; i++) {
  bytes[i] = binaryString.charCodeAt(i);
}
const jsonString = new TextDecoder().decode(bytes);
const data = JSON.parse(jsonString);
```

### Components

**Files**:
- `/apps/web/src/app/card/[data]/page.tsx` - Card display page
- `/apps/web/src/app/create/greeting/page.tsx` - Card creation form

**Icons**:
- Lucide icons: Mail, Phone, Globe, Instagram, Facebook, Linkedin
- Custom LINE icon (SVG component with official logo)

---

## 🔒 Security Considerations

### Input Validation

**Email Validation**:
```typescript
const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
```

**XSS Prevention**:
- ✅ All user data rendered via JSX (auto-escaped)
- ✅ No use of `dangerouslySetInnerHTML`
- ✅ URL validation for external links

**Data Size**:
- URL length limited by browser (typically ~2000 chars)
- Consider backend storage for larger datasets

### Privacy

**Client-Side Only**:
- ✅ No data sent to backend/server
- ✅ No database storage
- ✅ User controls all information
- ✅ Data only in URL (shareable link)

**Recommendations**:
- Users should not include sensitive information
- Consider encryption for sensitive use cases
- Option to add password protection (future enhancement)

---

## 🎨 UI/UX Details

### Color Scheme

**Brand Colors**:
- LINE: `#00B900` (Green)
- Instagram: `#E4405F` (Pink) with gradient effect
- Facebook: `#1877F2` (Blue)
- LinkedIn: `#0A66C2` (Blue)

**Theme Colors**:
- User-selectable theme color for accents
- Applied to icons, headings, and interactive elements

### Responsive Design

**Desktop** (`lg:` breakpoint):
- Landscape layout
- Two-column design
- Larger text and spacing

**Mobile** (default):
- Portrait layout
- Single column
- Touch-optimized buttons
- Stacked information

### Accessibility

**Interactive Elements**:
- ✅ Clickable phone numbers (`tel:` links)
- ✅ Clickable emails (`mailto:` links)
- ✅ External links open in new tabs
- ✅ Clear hover states on all interactive elements
- ✅ Copy/Save buttons appear on hover for discoverability

**Visual Feedback**:
- Hover effects on all clickable items
- Button state changes (Copy → ✓ Copied)
- Smooth transitions

---

## 📱 Use Cases

### 1. Business Networking
- Generate card after meeting
- Share via QR code at events
- Email link after video calls

### 2. Job Applications
- Include in email signatures
- Add to LinkedIn profile
- Share with recruiters

### 3. Freelancers/Consultants
- Quick client onboarding
- Portfolio integration
- Easy contact sharing

### 4. Sales/Marketing
- Lead generation
- Event networking
- Follow-up materials

---

## 🚀 Future Enhancements

### Potential Features

**Backend Integration**:
- [ ] Database storage for analytics
- [ ] Click tracking (how many views)
- [ ] QR code generator API
- [ ] Custom short URLs (e.g., `/c/john-doe`)

**Additional Fields**:
- [ ] Multiple phone numbers
- [ ] Address with map integration
- [ ] Business hours
- [ ] Profile photo/avatar
- [ ] Multiple email addresses

**Advanced Features**:
- [ ] Password-protected cards
- [ ] Expiration dates for temporary sharing
- [ ] Custom themes/templates
- [ ] Multi-language support (auto-detect)
- [ ] NFC tag integration
- [ ] Calendar integration (schedule meeting button)

**Analytics** (with user consent):
- [ ] View count
- [ ] Click tracking per field
- [ ] Geographic location of viewers
- [ ] Device type statistics

**Social Proof**:
- [ ] Testimonials section
- [ ] Portfolio/work samples
- [ ] Certificate displays
- [ ] Skills badges

---

## 🐛 Known Issues & Limitations

### Current Limitations

1. **URL Length**: Very long data may exceed browser URL limits
2. **No Edit Feature**: Once shared, can't update (must create new link)
3. **No Analytics**: Can't track who viewed the card
4. **No Backend**: All client-side, no persistence

### Edge Cases Handled

✅ Invalid email format → Validation error shown  
✅ Empty required fields → Form validation  
✅ Invalid base64 data → Fallback to default values  
✅ Missing social media → Fields not displayed  

---

## 📚 Related Documentation

- [Project Context](../PROJECT_CONTEXT.md) - Main project overview
- [Next.js Setup](./nextjs-setup.md) - Frontend architecture

---

**Last Updated**: 2026-01-29  
**Author**: AI Agent (Claude)  
**Version**: 1.0
