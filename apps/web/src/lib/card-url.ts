// URL Encoding/Decoding utilities for short URLs

export interface CardData {
  theme: "business" | "birthday";
  from: string;
  to: string;
  message: string;
  videoUrl?: string;
  images?: string[];
  animation: boolean;
}

/**
 * Encode card data to base64 string for URL
 * @param data Card data object
 * @returns Base64 encoded string
 */
export function encodeCardData(data: CardData): string {
  const json = JSON.stringify(data);
  return btoa(json);
}

/**
 * Decode base64 string to card data
 * @param encoded Base64 encoded string
 * @returns Card data object or null if invalid
 */
export function decodeCardData(encoded: string): CardData | null {
  try {
    const decoded = atob(encoded);
    const data = JSON.parse(decoded) as CardData;
    
    // Validate required fields
    if (!data.theme || !data.from || !data.to) {
      return null;
    }
    
    return data;
  } catch {
    return null;
  }
}

/**
 * Generate a short scan URL
 * @param data Card data
 * @param baseUrl Base URL (default: current domain)
 * @returns Full scan URL
 */
export function generateScanUrl(data: CardData, baseUrl?: string): string {
  const encoded = encodeCardData(data);
  const base = baseUrl || window.location.origin;
  return `${base}/s?d=${encoded}`;
}

/**
 * Example usage:
 * 
 * const cardData: CardData = {
 *   theme: "birthday",
 *   from: "เพื่อนๆ ทุกคน",
 *   to: "สุขสันต์วันเกิด นุ่น 🎂",
 *   message: "ขอให้มีความสุขมากๆ ในวันพิเศษนี้",
 *   videoUrl: "https://drive.google.com/...",
 *   images: ["https://drive.google.com/..."],
 *   animation: true
 * };
 * 
 * const url = generateScanUrl(cardData);
 * // Result: https://yourdomain.com/s?d=eyJ0aGVtZSI6ImJpcnRoZGF5Ii...
 */
