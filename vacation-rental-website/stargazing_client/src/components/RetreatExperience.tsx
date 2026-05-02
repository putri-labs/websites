"use client";

import { ScrollTelling } from "@/components/scrollytelling";
import { MapPin, Wind, Compass, Camera } from "lucide-react";
import SmoothScroll from "@/components/SmoothScroll";
import StorySection from "@/components/StorySection";
import MagazineSection from "@/components/MagazineSection";
import TripleColumnSection from "@/components/TripleColumnSection";
import Hero from "@/components/Hero";
import ReviewSection from "@/components/ReviewSection";
import FooterSection from "@/components/FooterSection";
import type { PublicWebsiteContent, PublicListing } from "@/lib/types";

interface RetreatExperienceProps {
  frames: string[];
  content: PublicWebsiteContent | null;
  listings: PublicListing[];
}

export default function RetreatExperience({
  frames,
  content,
  listings,
}: RetreatExperienceProps) {
  // ── Derive display values from CMS content with hardcoded fallbacks ──

  const heroHeadline =
    content?.hero?.heroHeadline ?? "Celestial";
  const heroSubheadline =
    content?.hero?.heroSubheadline ?? "Clarity";
  const heroDescription =
    content?.about?.aboutBody ??
    "When the sun dips below the horizon, the real performance begins. A private observatory for the soul, perched where time dissolves into the void.";
  const heroCtaText =
    content?.hero?.heroCtaText ?? "Check Availability";

  const magazineHeadline =
    content?.about?.aboutTitle ?? "What is Stargazing?";
  const magazineSubheadline =
    content?.branding?.brandName
      ? `A sanctuary for the soul, curated by ${content.branding.brandName}.`
      : "A sanctuary for the soul, carved into silence.";
  const magazineCopy =
    content?.about?.aboutBody
      ? [content.about.aboutBody]
      : [
          "Stargazing is an invitation to reconnect with the archaic rhythms of the universe. Here, architectural elegance meets the raw landscape, where every moment is curated to evoke wonder under a canopy of infinite light. Look out. Look up.",
        ];

  const tripleColumnItems = [
    {
      title: "Our Mission",
      content:
        content?.whyBookDirect?.whyBookDirectBody ??
        "Provide guests with unforgettable stays designed around the stars. We aim to offer more than just a getaway; we craft experiences where the night sky is at the heart of every moment.",
    },
    {
      title: "Our Values",
      content:
        "Guest experience is our north star. We prioritize doing right by our guests, ensuring every stay is seamless, memorable, and designed around comfort and adventure under the stars.",
    },
    {
      title: "Behind the Homes",
      content:
        "As both architects and manufacturers, we design each home with the guest experience in mind. Every detail is crafted to offer a seamless connection to the stars, ensuring comfort and adventure in a space built specifically for unforgettable stays.",
      link: {
        text: "stargazinghomes.com",
        url: "https://stargazinghomes.com",
      },
    },
  ];

  const reviewsHeadline =
    content?.testimonials?.testimonialsTitle ?? "What our guests have to say";

  const brandName = content?.branding?.brandName ?? "Stargazing";
  const footerCopyright =
    content?.footer?.footerCopyrightText ??
    "© 2026 Stargazing Retreats. All rights reserved.";
  const footerTagline = content?.footer?.footerTagline ?? null;

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

          <Hero
            headline={heroHeadline}
            subheadline={heroSubheadline}
            description={heroDescription}
            ctaText={heroCtaText}
          />

          <MagazineSection
            start={0.13}
            end={0.3}
            headline={magazineHeadline}
            subheadline={magazineSubheadline}
            copy={magazineCopy}
          />

          <TripleColumnSection
            start={0.37}
            end={0.54}
            items={tripleColumnItems}
          />

          <ReviewSection
            start={0.61}
            end={0.78}
            headline={reviewsHeadline}
          />

          <FooterSection
            start={0.82}
            end={1.0}
            brandName={brandName}
            copyrightText={footerCopyright}
            tagline={footerTagline}
            socialLinks={content?.social ?? null}
            contactInfo={content?.contact ?? null}
          />

          {/* Progress Indicator */}
          <div className="fixed bottom-1 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-40 opacity-100">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#ffd95f]">
              Scroll to Explore
            </p>
            <div className="w-[1px] h-20 bg-gradient-to-b from-[#ffd95f] to-transparent" />
          </div>
        </ScrollTelling>
      </main>
    </SmoothScroll>
  );
}
