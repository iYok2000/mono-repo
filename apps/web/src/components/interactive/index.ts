// Interactive Components for Enhanced User Experience

// Live Scan Demo
export { LiveScanDemo } from "./LiveScanDemo";

// 3D Card Preview (Web3D for International users)
export { Card3DPreview, NFCCardFront, NFCCardBack } from "./Card3DPreview";

// Scrollytelling Components
export { 
  ScrollytellingSection, 
  ScrollReveal, 
  Parallax,
  FloatingCard,
  FlyingByte,
  useScrollProgress 
} from "./Scrollytelling";

// Adaptive Theme System
export { 
  AdaptiveThemeProvider,
  AdaptiveContentWrapper,
  ContentTypeSelector,
  useAdaptiveTheme,
  useContentTypeDetection,
  type ContentType
} from "./AdaptiveTheme";

// Interactive Byte Mascot (Phase 1: The First Sight)
export { 
  InteractiveByte, 
  useByteControl,
  type ByteMood,
  type ByteAction 
} from "./InteractiveByte";

// Byte + Card Interaction with Hologram
export { ByteCardInteraction } from "./ByteCardInteraction";

// Byte Category Selector (mood changes based on gift type)
export { ByteCategorySelector, type GiftCategory } from "./ByteCategorySelector";
