"use client";

import { useState, useCallback } from "react";
import { Smartphone, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

type ByteAnimation = 
  | "idle" 
  | "wave" 
  | "jump" 
  | "spin" 
  | "wiggle" 
  | "blink" 
  | "excited";

const animations: ByteAnimation[] = ["wave", "jump", "spin", "wiggle", "excited"];

interface LiveScanDemoProps {
  variant?: "thai" | "international";
  className?: string;
}

export function LiveScanDemo({ 
  variant = "thai", 
  className = "" 
}: LiveScanDemoProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [byteAnimation, setByteAnimation] = useState<ByteAnimation>("idle");
  const [scanCount, setScanCount] = useState(0);

  const getAnimationClass = (anim: ByteAnimation) => {
    switch (anim) {
      case "wave": return "animate-byte-wave";
      case "jump": return "animate-byte-jump";
      case "spin": return "animate-byte-spin";
      case "wiggle": return "animate-byte-wiggle";
      case "blink": return "animate-byte-blink";
      case "excited": return "animate-byte-excited";
      default: return "";
    }
  };

  const handleScan = useCallback(() => {
    if (isScanning) return;
    
    setIsScanning(true);
    
    // Start scanning animation
    setTimeout(() => {
      // Pick a random animation based on scan count
      const animIndex = scanCount % animations.length;
      setByteAnimation(animations[animIndex]);
      setScanCount(prev => prev + 1);
      
      // Reset after animation
      setTimeout(() => {
        setByteAnimation("idle");
        setIsScanning(false);
      }, 1000);
    }, 1500);
  }, [isScanning, scanCount]);

  const resetDemo = () => {
    setIsScanning(false);
    setByteAnimation("idle");
    setScanCount(0);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Demo Container */}
      <div className="relative bg-[var(--surface)] rounded-3xl p-8 border border-[var(--border)] shadow-lg overflow-hidden">
        {/* Title */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
            {variant === "thai" ? "ลองสแกนจำลอง" : "Try Live Scan"}
          </h3>
          <p className="text-sm text-[var(--muted)]">
            {variant === "thai" 
              ? "กดปุ่มด้านล่างเพื่อดูการทำงาน" 
              : "Press the button to see how it works"}
          </p>
        </div>

        {/* Demo Area */}
        <div className="relative flex items-center justify-center gap-8 min-h-[280px]">
          {/* NFC Card */}
          <div className="relative w-48 h-28 card-premium rounded-xl border border-[var(--primary)]/20 overflow-hidden">
            {/* Card Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-[var(--primary)] flex items-center justify-center">
                  <span className="text-white text-xs">NFC</span>
                </div>
                <div className="text-[10px] text-[var(--muted)]">Gift Card</div>
              </div>
            </div>
            
            {/* Scan Line */}
            {isScanning && <div className="scan-line" />}
            
            {/* Scan Glow */}
            {isScanning && (
              <div className="absolute inset-0 bg-[var(--primary)]/10 animate-pulse" />
            )}
          </div>

          {/* Connection Line */}
          <div className={`w-16 h-0.5 transition-all duration-500 ${
            isScanning 
              ? "bg-gradient-to-r from-[var(--primary)] to-[var(--primary)] animate-pulse" 
              : "bg-[var(--border)]"
          }`}>
            {isScanning && (
              <div className="absolute inset-0 bg-[var(--primary)] blur-sm" />
            )}
          </div>

          {/* Byte Mascot */}
          <div className={`relative transition-transform duration-300 ${getAnimationClass(byteAnimation)}`}>
            {/* Byte Body */}
            <div className="byte-soft w-24 h-24 rounded-[1.5rem] flex items-center justify-center relative">
              {/* Glow when active */}
              {byteAnimation !== "idle" && (
                <div className="absolute -inset-4 bg-[var(--primary)]/20 rounded-full blur-xl animate-pulse" />
              )}
              
              {/* LED Eye */}
              <div 
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  byteAnimation !== "idle" 
                    ? "bg-[var(--primary)] shadow-lg" 
                    : "bg-[var(--byte-led)] opacity-60"
                }`}
                style={{
                  boxShadow: byteAnimation !== "idle" 
                    ? "0 0 30px rgba(16, 185, 129, 0.5)" 
                    : "none"
                }}
              >
                {/* Eye Inner */}
                <div className={`w-6 h-6 bg-black/20 rounded-lg ${
                  byteAnimation === "blink" ? "animate-byte-blink" : ""
                }`} />
              </div>
              
              {/* Antenna */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  byteAnimation !== "idle" 
                    ? "bg-[var(--primary)]/30" 
                    : "bg-[var(--surface-muted)]"
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    byteAnimation !== "idle" 
                      ? "bg-[var(--primary)] animate-pulse" 
                      : "bg-[var(--primary)]/50"
                  }`} />
                </div>
              </div>
            </div>

            {/* Speech Bubble */}
            {byteAnimation !== "idle" && (
              <div className="absolute -top-12 -right-4 bg-[var(--card)] px-3 py-2 rounded-xl shadow-lg border border-[var(--border)] animate-fade-in">
                <span className="text-lg">
                  {byteAnimation === "wave" && "👋"}
                  {byteAnimation === "jump" && "🎉"}
                  {byteAnimation === "spin" && "🌟"}
                  {byteAnimation === "wiggle" && "😊"}
                  {byteAnimation === "excited" && "💚"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center gap-3 mt-6">
          <Button
            onClick={handleScan}
            disabled={isScanning}
            icon={<Smartphone className="w-4 h-4" />}
            variant="large"
          >
            {isScanning 
              ? (variant === "thai" ? "กำลังสแกน..." : "Scanning...") 
              : (variant === "thai" ? "แตะเพื่อสแกน" : "Tap to Scan")}
          </Button>
          
          {scanCount > 0 && (
            <Button
              onClick={resetDemo}
              variant="secondary"
              icon={<RotateCcw className="w-4 h-4" />}
            >
              {variant === "thai" ? "รีเซ็ต" : "Reset"}
            </Button>
          )}
        </div>

        {/* Scan Counter */}
        {scanCount > 0 && (
          <div className="text-center mt-4">
            <span className="text-xs text-[var(--muted)]">
              {variant === "thai" 
                ? `สแกนแล้ว ${scanCount} ครั้ง` 
                : `Scanned ${scanCount} times`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
