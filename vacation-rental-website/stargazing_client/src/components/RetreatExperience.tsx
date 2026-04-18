"use client";

import { ScrollTelling } from "@/components/scrollytelling";
import { MapPin, Wind, Compass, Camera } from "lucide-react";
import SmoothScroll from "@/components/SmoothScroll";
import StorySection from "@/components/StorySection";
import MagazineSection from "@/components/MagazineSection";
import Hero from "@/components/Hero";

interface RetreatExperienceProps {
  frames: string[];
}

export default function RetreatExperience({ frames }: RetreatExperienceProps) {
  // Pacing: ~720 frames over 1200vh provides an epic, long-form cinematic journey.
  return (
    <SmoothScroll>
      <main className="bg-black">
        <ScrollTelling frames={frames} scrollHeight="1200vh">
          {/* Global Cinematic Overlays */}
          <div className="absolute inset-0 bg-black/20 pointer-events-none z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_70%,rgba(0,0,0,0.8)_100%)] pointer-events-none z-20" />
          <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-20" />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-20" />

          {/* --- SCENES --- */}

          <Hero />

          <MagazineSection
            start={0.15}
            end={0.35}
            headline="What is Stargazing?"
            subheadline="A sanctuary for the soul, carved into silence."
            copy={[
              "Stargazing is an invitation to reconnect with the archaic rhythms of the universe. Here, architectural elegance meets the raw landscape, where every moment is curated to evoke wonder under a canopy of infinite light. Look out. Look up.",
            ]}
          />

          <StorySection
            start={0.3}
            end={0.45}
            icon={Wind}
            headline="Bespoke Luxury"
            subheadline="Experience interiors that breathe. Every detail curated to bridge the gap between human comfort and wild nature."
          />

          <StorySection
            start={0.5}
            end={0.65}
            icon={Compass}
            headline="Vast Exploration"
            subheadline="Venture beyond the retreat. Guided journeys into the untouched wilderness of the high Sierras."
          />

          <StorySection
            start={0.7}
            end={0.85}
            icon={Camera}
            headline="Timeless Perspectives"
            subheadline="Capture the fleeting beauty of the wild. A space designed for creators to reconnect with their vision."
          />

          {/* Final CTA */}
          <StorySection
            start={0.9}
            end={0.98}
            headline="Your Journey Awaits"
            subheadline="Secure your stay for the 2026 Stargazing season."
          />

          {/* Progress Indicator */}
          <div className="fixed bottom-1 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-40 opacity-100">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#ffd95f]">
              Scroll to Explore
            </p>
            <div className="w-[1px] h-20 bg-gradient-to-b from-[#ffd95f] to-transparent" />
          </div>
        </ScrollTelling>

        {/* Footer */}
        <section className="relative z-50 bg-neutral-950 py-32 px-6 border-t border-white/5">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
              Begin Your Story
            </h2>
            <div className="flex justify-center gap-8 text-sm text-neutral-500">
              <span>© 2026 Stargazing Retreat</span>
              <a href="#" className="hover:text-white transition">
                Instagram
              </a>
              <a href="#" className="hover:text-white transition">
                Contact
              </a>
            </div>
          </div>
        </section>
      </main>
    </SmoothScroll>
  );
}
