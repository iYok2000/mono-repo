# Digital Business Card Feature

## Overview
Digital business card system that enables users to create, share, and manage interactive business cards through a web interface. Users can generate shareable URLs containing their contact information, professional details, and social media links. Recipients can view the card, interact with contact fields (click-to-call, click-to-email), and save contacts directly to their devices via vCard export.

## Why

**Business Requirements**:
- Contactless networking solution for modern business interactions
- Eco-friendly alternative to paper business cards
- Easy sharing via QR code, URL, or direct link
- Instant contact saving without manual data entry
- Support for multiple languages (Thai/English) for international business
- Professional social media integration (LINE, Instagram, Facebook, LinkedIn)
- Zero infrastructure cost with client-side only implementation

**Technical Reasoning**:
- **URL-based data storage**: Eliminates need for backend database and user authentication. All data encoded in shareable URL for maximum portability and privacy
- **Base64 encoding with compression**: Short key mapping (e.g., `n` for name, `e` for email) reduces URL length while maintaining readability
- **Client-side only architecture**: No server-side processing means instant page loads, no hosting costs, and complete user privacy
- **vCard standard**: Ensures compatibility with all devices (iOS, Android, desktop) for contact saving
- **Responsive design**: Single codebase serves both desktop and mobile with optimized layouts for each

**Alternatives Considered**:
- Backend database storage → Rejected: Adds complexity, cost, and privacy concerns
- JWT tokens for data → Rejected: Unnecessary overhead for public data
- Server-side rendering → Rejected: Client-side only meets requirements and reduces complexity

## How

**Architecture**:
```
User Input (Form) → Data Encoding → URL Generation → Shareable Link
                                                           ↓
                                                   Recipient Opens URL
                                                           ↓
                                            URL Decoding → Card Display
                                                           ↓
                                            Interactive Actions (Call/Email/Save)
```

**Components**:
1. **Card Creation Page** (`/create/greeting`): Form for entering business card data
2. **Card Display Page** (`/card/[data]`): Renders the business card from encoded URL
3. **URL Encoder/Decoder**: Handles data compression and base64 transformation
4. **vCard Generator**: Creates `.vcf` files for contact export

**Data Flow**:
1. User fills form with personal/professional information
2. Client validates required fields (email format, required fields)
3. Data mapped to short keys and JSON stringified
4. UTF-8 encoding → Base64 → URL-safe transformation
5. Shareable URL generated and copied to clipboard
6. Recipient opens URL → Reverse transformation → Card rendered
7. Interactive elements trigger native actions (tel:, mailto:, vCard download)

**Implementation Details**:
- Next.js 14+ with App Router for file-based routing
- TypeScript for type safety on data structures
- Tailwind CSS for responsive design and brand color consistency
- Lucide React for consistent iconography
- Native browser APIs (TextEncoder, btoa/atob) for encoding
- No external API dependencies

## Code Examples

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
  lineId: string;         // LINE ID
  instagram: string;      // Instagram handle
  facebook: string;       // Facebook username
  linkedin: string;       // LinkedIn username
}
```

### URL Encoding (Create Page)
```typescript
// Compress data with short keys
const shortData = {
  n: formData.name,
  ne: formData.nameEn,
  p: formData.position,
  pe: formData.positionEn,
  c: formData.company,
  l: formData.logo,
  tc: formData.themeColor,
  e: formData.email,
  ph: formData.phone,
  w: formData.website,
  li: formData.lineId,
  ig: formData.instagram,
  fb: formData.facebook,
  ln: formData.linkedin
};

// JSON → UTF-8 → Base64 → URL-safe
const jsonString = JSON.stringify(shortData);
const utf8Bytes = new TextEncoder().encode(jsonString);
let base64 = btoa(String.fromCharCode(...utf8Bytes));
base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '~');

const shareableUrl = `${window.location.origin}/card/${base64}`;
```

### URL Decoding (Card Page)
```typescript
// URL-safe → Standard Base64
let base64 = encodedData
  .replace(/-/g, '+')
  .replace(/_/g, '/')
  .replace(/~/g, '=');

// Base64 → UTF-8 → JSON → Data
const binaryString = atob(base64);
const bytes = new Uint8Array(binaryString.length);
for (let i = 0; i < binaryString.length; i++) {
  bytes[i] = binaryString.charCodeAt(i);
}
const jsonString = new TextDecoder().decode(bytes);
const cardData = JSON.parse(jsonString);
```

### Email Validation
```typescript
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
```

### vCard Generation
```typescript
function generateVCard(data: BusinessCardData): string {
  return `BEGIN:VCARD
VERSION:3.0
FN:${data.name}
TITLE:${data.position}
ORG:${data.company}
EMAIL:${data.email}
TEL:${data.phone}
URL:${data.website}
END:VCARD`;
}

// Trigger download
const blob = new Blob([vCardContent], { type: 'text/vcard' });
const url = window.URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = `${data.name}.vcf`;
link.click();
```

### Interactive Contact Elements
```typescript
// Click-to-call
<a href={`tel:${cardData.phone}`} className="...">
  <Phone className="h-4 w-4" />
  {cardData.phone}
</a>

// Click-to-email
<a href={`mailto:${cardData.email}`} className="...">
  <Mail className="h-4 w-4" />
  {cardData.email}
</a>

// Social media links with brand colors
<a 
  href={`https://line.me/ti/p/~${cardData.lineId}`}
  className="bg-[#00B900] hover:bg-[#00A000]"
  target="_blank"
  rel="noopener noreferrer"
>
  <LineIcon /> LINE
</a>
```

## Dependencies

### Internal Dependencies
- `apps/web/src/app/card/[data]/page.tsx` - Card display component
- `apps/web/src/app/create/greeting/page.tsx` - Card creation form
- Shared Tailwind configuration for consistent styling

### External Dependencies
- `next@14+` - App Router for dynamic routes and server components
- `react@18+` - UI component framework
- `lucide-react@latest` - Icon library (Mail, Phone, Globe, Instagram, Facebook, Linkedin)
- `tailwindcss@3+` - Utility-first CSS framework

### Browser APIs
- `TextEncoder/TextDecoder` - UTF-8 encoding/decoding
- `btoa/atob` - Base64 encoding/decoding
- `Blob` - vCard file generation
- `window.URL.createObjectURL` - File download

## API Endpoints
No backend API endpoints. All functionality is client-side only.

## Database Schema
No database required. All data stored in URL parameters.

## Configuration

**Environment Variables**:
None required. Fully client-side implementation.

**Key Settings**:
- **Route paths**: 
  - Display: `/card/[data]` (dynamic route)
  - Creation: `/create/greeting` (static route)
- **Brand Colors** (hardcoded):
  - LINE: `#00B900`
  - Instagram: `#E4405F` with gradient
  - Facebook: `#1877F2`
  - LinkedIn: `#0A66C2`
- **Validation Rules**:
  - Email: Standard regex pattern
  - Required fields: name, position, company, email, phone
- **URL Length Limit**: ~2000 characters (browser limitation)

**Responsive Breakpoints**:
- Mobile: default (< 1024px)
- Desktop: `lg:` breakpoint (≥ 1024px)

## Testing

**Unit Tests**: 
- Location: Not yet implemented
- Coverage needed:
  - Email validation function
  - URL encoding/decoding functions
  - vCard generation
  - Short key mapping correctness

**Integration Tests**:
- Location: Not yet implemented
- Scenarios to cover:
  - Full flow: Create card → Generate URL → Decode → Display
  - Copy to clipboard functionality
  - vCard download trigger
  - Social media link construction

**Manual Testing**:
1. Navigate to `/create/greeting`
2. Fill all form fields with test data
3. Verify email validation on invalid input
4. Click "Generate Card" button
5. Verify URL is copied to clipboard
6. Open generated URL in new tab/browser
7. Verify all fields display correctly
8. Test all interactive elements:
   - Click email → Opens mail app
   - Click phone → Opens dialer
   - Click website → Opens in new tab
   - Click social media → Opens correct platform
9. Click "Save Contact" → Downloads `.vcf` file
10. Import `.vcf` to phone contacts → Verify data
11. Test on mobile device for responsive layout
12. Test with Thai/Unicode characters
13. Test with very long data (near URL limit)
14. Test with missing optional fields

## Notes

### Important Considerations

**Security**:
- All user input auto-escaped by React JSX rendering (XSS prevention)
- No use of `dangerouslySetInnerHTML`
- External links validated before rendering
- Client-side only = no server-side attack surface
- Users advised not to include sensitive information in cards

**Performance**:
- Zero backend calls = instant page loads
- Static generation possible for create page
- Encoding/decoding operations are O(n) on data size
- No database queries or API latency

**Privacy**:
- No tracking or analytics
- No data sent to servers
- No cookies or local storage
- User controls all information
- Shareable URL is only copy of data

**Browser Compatibility**:
- Requires modern browsers with TextEncoder/TextDecoder support
- Base64 encoding supported in all major browsers
- vCard download works on all platforms

### Known Issues

**Current Limitations**:
1. URL length limited to ~2000 characters (browser constraint)
2. No way to edit card after URL is generated (must create new)
3. No analytics on card views or link clicks
4. No backend persistence or user accounts
5. No QR code generation (planned enhancement)
6. Thai text may increase encoded URL length significantly

**Edge Cases Handled**:
- ✅ Invalid email format → Form validation error
- ✅ Empty required fields → Submit button disabled
- ✅ Invalid base64 data in URL → Graceful error handling
- ✅ Missing optional fields → Fields hidden in display
- ✅ Very long data → Warning shown during creation
- ✅ Special characters in URLs → Properly URL-encoded

### Trade-offs Made

**Client-Side Only vs Backend**:
- ✅ Benefit: Zero cost, instant deployment, complete privacy
- ❌ Sacrifice: No analytics, no user accounts, no edit functionality
- Why: Meets core requirements without unnecessary complexity

**URL-based vs Database Storage**:
- ✅ Benefit: Portable, shareable, no infrastructure
- ❌ Sacrifice: URL length limitations, no version history
- Why: Simplicity and privacy outweigh advanced features for this use case

**No Edit Feature**:
- ✅ Benefit: Simpler implementation, no state management
- ❌ Sacrifice: Must generate new URL for updates
- Why: Stateless design aligns with URL-based architecture

### Future Enhancements

**High Priority**:
- [ ] QR code generation for each card
- [ ] Copy individual field values (email, phone)
- [ ] Custom themes/templates selection
- [ ] Multi-language auto-detection

**Medium Priority**:
- [ ] Backend API for analytics (opt-in)
- [ ] Custom short URLs (e.g., `/c/john-doe`)
- [ ] Password protection for sensitive cards
- [ ] Expiration dates for temporary sharing
- [ ] Profile photo/avatar upload

**Low Priority**:
- [ ] NFC tag integration
- [ ] Calendar integration (schedule meeting button)
- [ ] Multiple email addresses/phone numbers

---

**Created**: 2026-01-29  
**Last Updated**: 2026-02-03  
**Author**: AI Agent (Claude)  
**Status**: Active
- [ ] Address with map integration
- [ ] Skills badges and certifications display

---

**Created**: 2026-01-29  
**Last Updated**: 2026-02-03  
**Author**: AI Agent (Claude)  
**Status**: Active
