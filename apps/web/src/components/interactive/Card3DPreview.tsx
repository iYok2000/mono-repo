"use client";

import { useRef, useState, useEffect, useCallback, MouseEvent, TouchEvent } from "react";

interface Card3DPreviewProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  className?: string;
  width?: number;
  height?: number;
}

export function Card3DPreview({
  frontContent,
  backContent,
  className = "",
  width = 320,
  height = 200,
}: Card3DPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const dragStart = useRef({ x: 0, y: 0 });
  const lastRotation = useRef({ x: 0, y: 0 });

  // Auto-rotate effect
  useEffect(() => {
    if (!autoRotate || isHovering || isDragging) return;

    const interval = setInterval(() => {
      setRotation(prev => ({
        x: Math.sin(Date.now() / 2000) * 10,
        y: prev.y + 0.5,
      }));
    }, 50);

    return () => clearInterval(interval);
  }, [autoRotate, isHovering, isDragging]);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    if (isDragging) {
      const deltaX = e.clientX - dragStart.current.x;
      const deltaY = e.clientY - dragStart.current.y;
      
      setRotation({
        x: lastRotation.current.x - deltaY * 0.5,
        y: lastRotation.current.y + deltaX * 0.5,
      });
    } else if (isHovering) {
      // Subtle tilt based on mouse position
      const rotateY = ((e.clientX - centerX) / rect.width) * 20;
      const rotateX = -((e.clientY - centerY) / rect.height) * 20;

      setRotation({ x: rotateX, y: rotateY });
    }
  }, [isDragging, isHovering]);

  const handleTouchMove = useCallback((e: TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || !isDragging) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStart.current.x;
    const deltaY = touch.clientY - dragStart.current.y;

    setRotation({
      x: lastRotation.current.x - deltaY * 0.5,
      y: lastRotation.current.y + deltaX * 0.5,
    });
  }, [isDragging]);

  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    setIsDragging(true);
    setAutoRotate(false);
    dragStart.current = { x: clientX, y: clientY };
    lastRotation.current = rotation;
  }, [rotation]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    lastRotation.current = rotation;
  }, [rotation]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    setAutoRotate(false);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setIsDragging(false);
    // Smooth return to center
    setRotation({ x: 0, y: 0 });
    setTimeout(() => setAutoRotate(true), 500);
  };

  const flipCard = () => {
    setRotation(prev => ({ ...prev, y: prev.y + 180 }));
  };

  const isShowingBack = Math.abs(rotation.y % 360) > 90 && Math.abs(rotation.y % 360) < 270;

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* 3D Card Container */}
      <div
        ref={containerRef}
        className="card-3d-container cursor-grab active:cursor-grabbing"
        style={{ width, height }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
        onMouseUp={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleDragEnd}
      >
        <div
          className="card-3d w-full h-full relative"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Front Face */}
          <div
            className="card-3d-front absolute inset-0 rounded-2xl overflow-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            {frontContent}
            {/* Shine Effect */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(
                  ${105 + rotation.y}deg,
                  transparent 40%,
                  rgba(255, 255, 255, 0.2) 45%,
                  rgba(255, 255, 255, 0.4) 50%,
                  rgba(255, 255, 255, 0.2) 55%,
                  transparent 60%
                )`,
                opacity: isHovering || isDragging ? 1 : 0,
                transition: "opacity 0.3s",
              }}
            />
          </div>

          {/* Back Face */}
          <div
            className="card-3d-back absolute inset-0 rounded-2xl overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {backContent}
            {/* Shine Effect */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(
                  ${105 - rotation.y}deg,
                  transparent 40%,
                  rgba(255, 255, 255, 0.2) 45%,
                  rgba(255, 255, 255, 0.4) 50%,
                  rgba(255, 255, 255, 0.2) 55%,
                  transparent 60%
                )`,
                opacity: isHovering || isDragging ? 1 : 0,
                transition: "opacity 0.3s",
              }}
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={flipCard}
          className="px-4 py-2 text-sm font-medium text-[var(--primary)] bg-[var(--primary-soft)] rounded-lg hover:bg-[var(--primary)]/20 transition-colors"
        >
          {isShowingBack ? "View Front" : "View Back"}
        </button>
        
        <span className="text-xs text-[var(--muted)]">
          Drag to rotate • Click to flip
        </span>
      </div>
    </div>
  );
}

// Pre-built Card Face Components
export function NFCCardFront({ 
  title = "Gift Card",
  logoEmoji = "🎁" 
}: { 
  title?: string;
  logoEmoji?: string;
}) {
  return (
    <div className="w-full h-full card-premium bg-gradient-to-br from-[#0A0A0A] to-[#1F2937] p-6 flex flex-col justify-between">
      {/* Logo Area */}
      <div className="flex items-start justify-between">
        <span className="text-3xl">{logoEmoji}</span>
        <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center shadow-lg shadow-[var(--primary)]/30">
          <span className="text-white text-xs font-bold">NFC</span>
        </div>
      </div>

      {/* Title */}
      <div>
        <p className="text-[var(--primary)] text-sm font-medium mb-1">Tap to open</p>
        <h4 className="text-white text-lg font-bold">{title}</h4>
      </div>

      {/* Emerald Accent Line */}
      <div className="w-full h-1 rounded-full bg-gradient-to-r from-[var(--primary)] via-[var(--primary)]/50 to-transparent" />
    </div>
  );
}

export function NFCCardBack({ 
  qrPlaceholder = true,
  message = "Scan QR if NFC unavailable" 
}: { 
  qrPlaceholder?: boolean;
  message?: string;
}) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#1F2937] to-[#0A0A0A] p-6 flex flex-col items-center justify-center">
      {qrPlaceholder && (
        <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center mb-3">
          <div className="w-16 h-16 bg-[var(--primary)]/10 rounded grid grid-cols-3 grid-rows-3 gap-0.5 p-1">
            {[...Array(9)].map((_, i) => (
              <div 
                key={i} 
                className={`rounded-sm ${
                  [0, 2, 4, 6, 8].includes(i) 
                    ? "bg-[var(--foreground)]" 
                    : "bg-transparent"
                }`}
              />
            ))}
          </div>
        </div>
      )}
      <p className="text-[var(--muted)] text-xs text-center">{message}</p>
    </div>
  );
}
