"use client";

import { 
  useRef, 
  useState, 
  useEffect, 
  useCallback,
  memo,
  useMemo
} from "react";

// Types
type ByteMood = "default" | "happy" | "love" | "excited" | "thinking" | "surprised" | "wink";
type ByteAction = "idle" | "wave" | "tap" | "fly" | "bounce";

interface Position {
  x: number;
  y: number;
}

interface InteractiveByteProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  followMouse?: boolean;
  followScroll?: boolean;
  initialMood?: ByteMood;
  onTap?: () => void;
}

// Memoized Eye Component for performance
const ByteEye = memo(function ByteEye({ 
  mood, 
  isBlinking 
}: { 
  mood: ByteMood; 
  isBlinking: boolean;
}) {
  const getEyeContent = () => {
    if (isBlinking) {
      return <div className="w-full h-1 bg-black/20 rounded-full" />;
    }
    
    switch (mood) {
      case "love":
        return <span className="text-2xl">❤️</span>;
      case "happy":
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-4 border-b-4 border-black/20 rounded-b-full" />
          </div>
        );
      case "wink":
        return <span className="text-xl">😉</span>;
      case "surprised":
        return (
          <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center">
            <div className="w-4 h-4 bg-[var(--byte-led)] rounded-full animate-pulse" />
          </div>
        );
      case "thinking":
        return (
          <div className="w-full h-full flex items-end justify-end p-2">
            <div className="w-4 h-4 bg-black/20 rounded-full" />
          </div>
        );
      default:
        return <div className="w-8 h-8 bg-black/20 rounded-lg" />;
    }
  };

  return (
    <div 
      className="w-16 h-16 bg-[var(--byte-led)] rounded-2xl flex items-center justify-center transition-all duration-200"
      style={{ 
        boxShadow: "0 0 30px rgba(16, 185, 129, 0.4)",
        transform: isBlinking ? "scaleY(0.1)" : "scaleY(1)"
      }}
    >
      {getEyeContent()}
    </div>
  );
});

// Main Interactive Byte Component
export const InteractiveByte = memo(function InteractiveByte({
  className = "",
  size = "md",
  followMouse = true,
  followScroll = true,
  initialMood = "default",
  onTap,
}: InteractiveByteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const lastScrollY = useRef(0);
  
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [mood, setMood] = useState<ByteMood>(initialMood);
  const [action, setAction] = useState<ByteAction>("idle");
  const [isBlinking, setIsBlinking] = useState(false);
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);

  // Size mapping
  const sizeClasses = useMemo(() => ({
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  }), []);

  const eyeSizes = useMemo(() => ({
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  }), []);

  // Mouse follow effect with RAF for performance
  useEffect(() => {
    if (!followMouse) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate offset (limited range for subtle effect)
        const maxOffset = 20;
        const deltaX = Math.max(-maxOffset, Math.min(maxOffset, (e.clientX - centerX) * 0.05));
        const deltaY = Math.max(-maxOffset, Math.min(maxOffset, (e.clientY - centerY) * 0.05));

        setPosition({ x: deltaX, y: deltaY });
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [followMouse]);

  // Scroll follow effect
  useEffect(() => {
    if (!followScroll) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const deltaY = (scrollY - lastScrollY.current) * 0.1;
      lastScrollY.current = scrollY;

      setPosition(prev => ({
        ...prev,
        y: Math.max(-30, Math.min(30, prev.y + deltaY))
      }));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [followScroll]);

  // Random blinking effect
  useEffect(() => {
    const blink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.7) blink();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Action handlers
  const playAction = useCallback((newAction: ByteAction, duration = 600) => {
    setAction(newAction);
    setTimeout(() => setAction("idle"), duration);
  }, []);

  const showSpeech = useCallback((text: string, duration = 2000) => {
    setSpeechBubble(text);
    setTimeout(() => setSpeechBubble(null), duration);
  }, []);

  const handleClick = useCallback(() => {
    playAction("bounce");
    setMood("happy");
    showSpeech("สวัสดี! 👋");
    setTimeout(() => setMood(initialMood), 1500);
    onTap?.();
  }, [playAction, showSpeech, initialMood, onTap]);

  // Public methods via ref (for parent control)
  const changeMood = useCallback((newMood: ByteMood) => {
    setMood(newMood);
  }, []);

  const triggerTap = useCallback(() => {
    playAction("tap");
    setMood("excited");
    setTimeout(() => setMood(initialMood), 1000);
  }, [playAction, initialMood]);

  // Get action animation class
  const getActionClass = () => {
    switch (action) {
      case "wave": return "animate-byte-wave";
      case "bounce": return "animate-byte-jump";
      case "tap": return "animate-byte-excited";
      case "fly": return "animate-gentle-float";
      default: return "";
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative inline-block ${className}`}
      style={{ 
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: "transform 0.1s ease-out",
        willChange: "transform"
      }}
    >
      {/* Speech Bubble */}
      {speechBubble && (
        <div 
          className="absolute -top-12 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap animate-fade-in"
        >
          <div className="bg-[var(--card)] px-3 py-2 rounded-xl shadow-lg border border-[var(--border)] text-sm">
            {speechBubble}
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--card)] border-r border-b border-[var(--border)] rotate-45" />
        </div>
      )}

      {/* Byte Body */}
      <button
        onClick={handleClick}
        className={`
          relative gpu-accelerate cursor-pointer
          byte-soft rounded-[1.5rem] flex items-center justify-center
          transition-all duration-200 hover:scale-105
          ${sizeClasses[size]}
          ${getActionClass()}
        `}
        aria-label="Interactive Byte mascot"
      >
        {/* Glow Effect */}
        <div 
          className="absolute -inset-2 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{ 
            background: "radial-gradient(circle, var(--byte-glow) 0%, transparent 70%)" 
          }}
        />

        {/* Eye */}
        <div className={eyeSizes[size]}>
          <ByteEye mood={mood} isBlinking={isBlinking} />
        </div>

        {/* Antenna */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div className="w-6 h-6 rounded-full bg-[var(--surface-muted)] flex items-center justify-center shadow-sm">
            <div 
              className="w-3 h-3 rounded-full bg-[var(--primary)] animate-pulse-led"
              style={{ boxShadow: "0 0 10px var(--byte-glow)" }}
            />
          </div>
        </div>

        {/* LED Strips (Dark mode only) */}
        <div className="absolute inset-0 rounded-[1.5rem] overflow-hidden pointer-events-none dark:block hidden">
          <div className="absolute top-1 left-4 right-4 h-[2px] byte-led-strip rounded-full opacity-50" />
          <div className="absolute bottom-1 left-4 right-4 h-[2px] byte-led-strip rounded-full opacity-50" />
        </div>
      </button>
    </div>
  );
});

// Export utilities for parent component control
export const useByteControl = () => {
  const byteRef = useRef<{
    changeMood: (mood: ByteMood) => void;
    triggerTap: () => void;
    showSpeech: (text: string) => void;
  } | null>(null);

  return {
    ref: byteRef,
    changeMood: (mood: ByteMood) => byteRef.current?.changeMood(mood),
    triggerTap: () => byteRef.current?.triggerTap(),
    showSpeech: (text: string) => byteRef.current?.showSpeech(text),
  };
};

export type { ByteMood, ByteAction };
