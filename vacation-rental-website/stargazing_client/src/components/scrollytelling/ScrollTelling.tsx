"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
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
  const canvasSizeRef = useRef({ width: 0, height: 0 });
  
  // High-reliability progress tracking
  const [loadedCount, setLoadedCount] = useState(0);
  const loadedIndicesRef = useRef<Set<number>>(new Set());
  const loadCycleRef = useRef<number>(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const frameIndex = useTransform(smoothProgress, [0, 1], [0, frames.length - 1]);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const { width, height } = entry.contentRect;
        const dpr = window.devicePixelRatio || 1;
        const targetWidth = width * dpr;
        const targetHeight = height * dpr;

        canvasSizeRef.current = { width: targetWidth, height: targetHeight };
        
        if (canvasRef.current) {
          canvasRef.current.width = targetWidth;
          canvasRef.current.height = targetHeight;
          if (lastDrawnIndexRef.current >= 0) {
            draw(lastDrawnIndexRef.current);
          }
        }
      }
    });

    observer.observe(canvasRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Increment cycle ID to ignore results from stale preload loops
    const currentCycle = ++loadCycleRef.current;
    
    setLoadedCount(0);
    loadedIndicesRef.current.clear();
    lastDrawnIndexRef.current = -1;
    imagesRef.current = new Array(frames.length).fill(null);
    
    const preload = async () => {
      const loadImg = async (idx: number) => {
        // Guard: Check if cycle is still active
        if (currentCycle !== loadCycleRef.current) return;
        if (imagesRef.current[idx]) return;
        
        try {
          const img = new Image();
          img.src = frames[idx];
          
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });

          // Guard: Verify cycle again after async load
          if (currentCycle !== loadCycleRef.current) return;

          // SUCCESS: Essential state update
          imagesRef.current[idx] = img;
          
          if (!loadedIndicesRef.current.has(idx)) {
            loadedIndicesRef.current.add(idx);
            setLoadedCount(loadedIndicesRef.current.size);
          }

          // Trigger redraw if we just loaded the current or first frame
          const currentIdx = Math.round(frameIndex.get());
          if (idx === currentIdx || (idx === 0 && lastDrawnIndexRef.current === -1)) {
            requestAnimationFrame(() => draw(idx));
          }

          // OPTIONAL: Background decoding as enhancement
          if ("decode" in img) {
            img.decode().catch(() => {
              // Ignore decoding errors; the image is still usable via standard drawImage
            });
          }
        } catch (err) {
          // If a frame fails, we don't block the whole sequence
          console.warn(`Frame ${idx} failed to load, skipping...`);
        }
      };

      // 1. Initial Priority Chunk
      await loadImg(0);
      const initialChunk = [];
      for(let i=1; i < Math.min(frames.length, 30); i++) {
        initialChunk.push(loadImg(i));
      }
      await Promise.all(initialChunk);

      // 2. Background Sequential Load
      for(let i=30; i < frames.length; i++) {
        if (currentCycle !== loadCycleRef.current) break;
        loadImg(i);
        // Throttle requests to avoid saturating the browser's parallel connection limit
        if (i % 10 === 0) await new Promise(r => setTimeout(r, 20));
      }
    };

    preload();
  }, [frames]);

  const draw = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (!img || img.naturalWidth === 0) return; 

    // Avoid redundant draws on the same frame index
    if (index === lastDrawnIndexRef.current) return;
    lastDrawnIndexRef.current = index;

    const { width: cw, height: ch } = canvasSizeRef.current;
    if (cw === 0 || ch === 0) return;

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

    ctx.drawImage(img, x, y, drawWidth, drawHeight);
  };

  useMotionValueEvent(frameIndex, "change", (v) => {
    const idx = Math.round(v);
    requestAnimationFrame(() => draw(idx));
  });

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
            style={{ transform: "translate3d(0,0,0)" }}
            className="w-full h-full object-cover will-change-transform" 
          />
          
          <div className="absolute inset-0 z-10 pointer-events-none">
            {children}
          </div>

          <div className="absolute bottom-4 right-4 text-[10px] font-mono text-white/20 select-none pointer-events-none z-20">
            ENGINE: EMERGENCY_FIX_V5 | LOADED: {Math.round((loadedCount / frames.length) * 100)}%
          </div>
        </div>
      </section>
    </ScrollTellingContext.Provider>
  );
}


