"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform } from "framer-motion";
import { ScrollTellingContext } from "./context";

interface ScrollTellingProps {
  frames: string[];
  scrollHeight?: string;
  children?: React.ReactNode;
}

export default function ScrollTelling({ 
  frames, 
  scrollHeight = "420vh",
  children 
}: ScrollTellingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const lastDrawnIndexRef = useRef<number>(-1);
  
  const [loadedCount, setLoadedCount] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Map progress to frame index
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, frames.length - 1]);

  useEffect(() => {
    // Reset load count when frames change to fix "200% loaded" bug
    setLoadedCount(0);
    lastDrawnIndexRef.current = -1;
    
    const preload = async () => {
      imagesRef.current = new Array(frames.length).fill(null);
      
      const loadImg = (idx: number) => {
        if (imagesRef.current[idx]) return Promise.resolve();
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.src = frames[idx];
          img.onload = () => {
            imagesRef.current[idx] = img;
            setLoadedCount(prev => prev + 1);
            resolve();
          };
          img.onerror = () => {
            console.error(`Failed to load frame ${idx}: ${frames[idx]}`);
            resolve();
          };
        });
      };

      // Load first frame immediately
      await loadImg(0);
      draw(0);

      // Load initial chunk (first 30 frames)
      const initialChunk = [];
      for(let i=1; i < Math.min(frames.length, 30); i++) {
        initialChunk.push(loadImg(i));
      }
      await Promise.all(initialChunk);

      // Background load the rest
      for(let i=30; i < frames.length; i++) {
        loadImg(i);
        if (i % 20 === 0) await new Promise(r => setTimeout(r, 50));
      }
    };

    preload();
  }, [frames]);

  const draw = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[index];
    
    // Hardened Logic: Don't clear if image isn't ready
    if (!img || img.naturalWidth === 0) return; 

    if (index === lastDrawnIndexRef.current && canvas.width > 0) return;
    lastDrawnIndexRef.current = index;

    const cw = window.innerWidth;
    const ch = window.innerHeight;
    
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw;
      canvas.height = ch;
    }

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = cw / ch;
    let drawWidth, drawHeight, x, y;

    if (canvasRatio > imgRatio) {
      drawWidth = cw;
      drawHeight = cw / imgRatio;
      x = 0;
      y = (ch - drawHeight) / 2;
    } else {
      drawWidth = ch * imgRatio;
      drawHeight = ch;
      x = (cw - drawWidth) / 2;
      y = 0;
    }

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, x, y, drawWidth, drawHeight);
  };

  useEffect(() => {
    return frameIndex.on("change", (v) => {
      const idx = Math.round(v);
      requestAnimationFrame(() => draw(idx));
    });
  }, [frameIndex]);

  return (
    <ScrollTellingContext.Provider value={scrollYProgress}>
      <section 
        ref={containerRef} 
        style={{ height: scrollHeight }} 
        className="relative w-full overflow-visible"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-black z-0 will-change-transform">
          <canvas 
            ref={canvasRef} 
            className="w-full h-full object-cover" 
          />
          
          <div className="absolute inset-0 z-10 pointer-events-none">
            {children}
          </div>

          {/* Diagnostic Overlay */}
          <div className="absolute bottom-4 right-4 text-[10px] font-mono text-white/20 select-none pointer-events-none z-20">
            ENGINE: HARDENED_V3 | LOADED: {Math.round((loadedCount / frames.length) * 100)}%
          </div>
        </div>
      </section>
    </ScrollTellingContext.Provider>
  );
}
