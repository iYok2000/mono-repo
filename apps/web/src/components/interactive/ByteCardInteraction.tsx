"use client";

import { useState, useCallback, useRef, useEffect, memo } from "react";
import { InteractiveByte, ByteMood } from "./InteractiveByte";

interface HologramContent {
  type: "image" | "video" | "text";
  content: string;
  title?: string;
}

interface ByteCardInteractionProps {
  className?: string;
  hologramContent?: HologramContent;
  cardTitle?: string;
  onInteraction?: () => void;
}

// Hologram Display Component
const HologramDisplay = memo(function HologramDisplay({
  content,
  isVisible,
}: {
  content: HologramContent;
  isVisible: boolean;
}) {
  if (!isVisible) return null;

  return (
    <div 
      className="absolute -top-32 left-1/2 -translate-x-1/2 z-20"
      style={{
        animation: isVisible ? "hologram-appear 0.5s ease-out forwards" : "none",
      }}
    >
      {/* Hologram Container */}
      <div className="relative">
        {/* Glow Effect */}
        <div 
          className="absolute -inset-4 rounded-2xl opacity-60"
          style={{
            background: "radial-gradient(ellipse at center, var(--primary-soft) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
        
        {/* Content Frame */}
        <div 
          className="relative bg-[var(--card)]/90 backdrop-blur-md rounded-xl p-4 border border-[var(--primary)]/30 shadow-xl"
          style={{
            boxShadow: "0 0 40px var(--byte-glow), 0 20px 60px rgba(0,0,0,0.2)",
          }}
        >
          {/* Scan Lines Effect */}
          <div 
            className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden"
            style={{
              background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(16, 185, 129, 0.03) 2px, rgba(16, 185, 129, 0.03) 4px)",
            }}
          />
          
          {content.type === "image" && (
            <div className="w-40 h-24 bg-[var(--surface-muted)] rounded-lg flex items-center justify-center">
              <span className="text-3xl">🖼️</span>
            </div>
          )}
          
          {content.type === "video" && (
            <div className="w-40 h-24 bg-[var(--surface-muted)] rounded-lg flex items-center justify-center relative">
              <span className="text-3xl">🎬</span>
              <div className="absolute bottom-2 right-2 bg-[var(--primary)] rounded-full w-6 h-6 flex items-center justify-center">
                <span className="text-white text-xs">▶</span>
              </div>
            </div>
          )}
          
          {content.type === "text" && (
            <div className="w-40 p-2 text-center">
              <p className="text-sm text-[var(--foreground)]">{content.content}</p>
            </div>
          )}
          
          {content.title && (
            <p className="text-xs text-[var(--muted)] text-center mt-2">{content.title}</p>
          )}
        </div>
        
        {/* Connection Line to Card */}
        <div 
          className="absolute -bottom-8 left-1/2 w-0.5 h-8 -translate-x-1/2"
          style={{
            background: "linear-gradient(to bottom, var(--primary), transparent)",
          }}
        />
      </div>
    </div>
  );
});

// NFC Card Component
const NFCCard = memo(function NFCCard({
  title,
  isHovered,
  isTapped,
  onHover,
  onLeave,
}: {
  title: string;
  isHovered: boolean;
  isTapped: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      className={`
        relative w-56 h-36 rounded-xl overflow-hidden cursor-pointer
        transition-all duration-300 gpu-accelerate
        ${isHovered ? "scale-105" : "scale-100"}
        ${isTapped ? "ring-2 ring-[var(--primary)] ring-offset-2" : ""}
      `}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        boxShadow: isHovered 
          ? "0 20px 60px rgba(0,0,0,0.2), 0 0 40px var(--byte-glow)"
          : "0 10px 40px rgba(0,0,0,0.1)",
      }}
    >
      {/* Card Background */}
      <div className="absolute inset-0 card-premium bg-gradient-to-br from-[var(--card-matte,#0A0A0A)] to-[var(--surface,#1F2937)]" />
      
      {/* Shine Effect on Hover */}
      {isHovered && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 55%, transparent 60%)",
            animation: "card-shine 1.5s ease-in-out",
          }}
        />
      )}
      
      {/* Card Content */}
      <div className="relative z-10 h-full p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <span className="text-2xl">🎁</span>
          <div 
            className={`
              w-8 h-8 rounded-full flex items-center justify-center
              transition-all duration-300
              ${isHovered || isTapped ? "bg-[var(--primary)] shadow-lg" : "bg-[var(--primary)]/50"}
            `}
            style={{
              boxShadow: isHovered || isTapped ? "0 0 20px var(--byte-glow)" : "none",
            }}
          >
            <span className="text-white text-[10px] font-bold">NFC</span>
          </div>
        </div>
        
        <div>
          <p className="text-[var(--primary)] text-xs mb-1">Tap to open</p>
          <h4 className="text-[var(--foreground)] text-sm font-semibold">{title}</h4>
        </div>
      </div>
      
      {/* Tap Ripple Effect */}
      {isTapped && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at center, var(--primary-soft) 0%, transparent 70%)",
            animation: "ripple 0.6s ease-out",
          }}
        />
      )}
    </div>
  );
});

// Main Component: Byte Card Interaction
export function ByteCardInteraction({
  className = "",
  hologramContent = { type: "video", content: "", title: "ความทรงจำของคุณ" },
  cardTitle = "Birthday Gift",
  onInteraction,
}: ByteCardInteractionProps) {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);
  const [showHologram, setShowHologram] = useState(false);
  const [byteMood, setByteMood] = useState<ByteMood>("default");
  const [bytePosition, setBytePosition] = useState({ x: 60, y: 0 });
  const tapTimeoutRef = useRef<NodeJS.Timeout>();

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
    };
  }, []);

  const handleCardHover = useCallback(() => {
    setIsCardHovered(true);
    setByteMood("excited");
    
    // Byte moves toward card
    setBytePosition({ x: 30, y: 0 });
  }, []);

  const handleCardLeave = useCallback(() => {
    setIsCardHovered(false);
    setShowHologram(false);
    setByteMood("default");
    setBytePosition({ x: 60, y: 0 });
  }, []);

  const handleByteTap = useCallback(() => {
    if (!isCardHovered) return;
    
    // Byte "taps" the card
    setIsTapped(true);
    setByteMood("happy");
    setBytePosition({ x: 10, y: 0 });
    
    // Show hologram after tap animation
    tapTimeoutRef.current = setTimeout(() => {
      setShowHologram(true);
      setByteMood("love");
      onInteraction?.();
    }, 400);

    // Reset after showing
    setTimeout(() => {
      setIsTapped(false);
    }, 600);
  }, [isCardHovered, onInteraction]);

  return (
    <div className={`relative flex items-center justify-center gap-4 ${className}`}>
      {/* NFC Card */}
      <div className="relative">
        <HologramDisplay content={hologramContent} isVisible={showHologram} />
        <NFCCard
          title={cardTitle}
          isHovered={isCardHovered}
          isTapped={isTapped}
          onHover={handleCardHover}
          onLeave={handleCardLeave}
        />
      </div>

      {/* Interactive Byte */}
      <div 
        className="transition-all duration-500 ease-out"
        style={{ 
          transform: `translateX(${bytePosition.x}px) translateY(${bytePosition.y}px)`,
        }}
      >
        <InteractiveByte
          size="md"
          followMouse={!isCardHovered}
          followScroll={false}
          initialMood={byteMood}
          onTap={handleByteTap}
        />
        
        {/* Instruction Text */}
        {isCardHovered && !showHologram && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <p className="text-xs text-[var(--muted)] animate-pulse">
              กดที่ Byte เพื่อแตะการ์ด
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// CSS Animations (add to globals.css if needed)
export const hologramStyles = `
@keyframes hologram-appear {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(20px) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }
}

@keyframes card-shine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
`;
