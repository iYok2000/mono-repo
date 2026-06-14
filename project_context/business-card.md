# Digital Business Card

> Last updated: 2026-04-28

## What
Client-side-only digital business card system. Data encoded in URL (no backend DB). Supports QR sharing, vCard export, click-to-call/email, social links (LINE, Instagram, Facebook, LinkedIn). Thai/English bilingual.

## Where

- Create form: `app/create/greeting/page.tsx`
- Card display: `app/card/[data]/page.tsx`
- No backend — all data in URL

## How It Works
1. User fills form → data mapped to short keys (`n`=name, `e`=email, etc.)
2. JSON → UTF-8 → Base64 → URL-safe encoding (`+→-`, `/→_`, `=→~`)
3. Shareable URL: `/card/{encoded-data}`
4. Recipient opens → reverse decode → render card
5. Interactive: `tel:`, `mailto:`, vCard download, social links

## Data Shape
```typescript
interface BusinessCardData {
  name: string; nameEn?: string;
  position: string; positionEn?: string;
  company: string; logo?: string; themeColor: string;
  email: string; phone: string; website: string;
  lineId: string; instagram: string; facebook: string; linkedin: string;
}
```

## Key Details
- Short key mapping reduces URL length: `{ n, ne, p, pe, c, l, tc, e, ph, w, li, ig, fb, ln }`
- vCard 3.0 standard for contact export
- Email validation: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- No external API dependencies — uses native browser APIs (TextEncoder, btoa/atob)
- Icons: lucide-react
