/**
 * Type definitions for the VacayStack Public API responses.
 *
 * These types mirror the sanitized Pydantic schemas exposed by
 * the /public endpoints. They are the contract between the CRM
 * backend and this client website.
 */

// ── Website Content (CMS) ──────────────────────────────────────────────

export interface PublicHeroContent {
  heroHeadline: string | null;
  heroSubheadline: string | null;
  heroCtaText: string | null;
  heroBackgroundImageUrl: string | null;
  heroVisible: boolean;
}

export interface PublicAboutContent {
  aboutTitle: string | null;
  aboutBody: string | null;
  aboutImageUrl: string | null;
  aboutVisible: boolean;
}

export interface PublicContactContent {
  contactEmail: string | null;
  contactPhone: string | null;
  contactWhatsapp: string | null;
  contactAddress: string | null;
  contactVisible: boolean;
}

export interface PublicSocialContent {
  socialFacebook: string | null;
  socialInstagram: string | null;
  socialTwitter: string | null;
  socialYoutube: string | null;
  socialTiktok: string | null;
  socialVisible: boolean;
}

export interface PublicSeoContent {
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  seoOgImageUrl: string | null;
}

export interface PublicBrandingContent {
  brandName: string | null;
  brandLogoUrl: string | null;
  brandFaviconUrl: string | null;
  brandPrimaryColor: string | null;
  brandSecondaryColor: string | null;
}

export interface PublicTestimonialsContent {
  testimonialsTitle: string | null;
  testimonialsSubtitle: string | null;
  testimonialsVisible: boolean;
}

export interface PublicFooterContent {
  footerTagline: string | null;
  footerCopyrightText: string | null;
  footerShowSocialLinks: boolean;
  footerShowSitemap: boolean;
  footerVisible: boolean;
}

export interface PublicNavContent {
  navShowBookNowButton: boolean;
  navBookNowButtonText: string | null;
  navVisible: boolean;
}

export interface PublicWhyBookDirectContent {
  whyBookDirectTitle: string | null;
  whyBookDirectBody: string | null;
  whyBookDirectVisible: boolean;
}

export interface PublicWebsiteContent {
  clientId: string;
  hero: PublicHeroContent;
  about: PublicAboutContent;
  contact: PublicContactContent;
  social: PublicSocialContent;
  seo: PublicSeoContent;
  branding: PublicBrandingContent;
  testimonials: PublicTestimonialsContent;
  footer: PublicFooterContent;
  nav: PublicNavContent;
  whyBookDirect: PublicWhyBookDirectContent;
}

// ── Listings ────────────────────────────────────────────────────────────

export interface PublicListingImage {
  url: string;
  caption: string | null;
  isCover: boolean;
  sortOrder: number;
}

export interface PublicAmenity {
  name: string;
  category: string | null;
  iconKey: string | null;
}

export interface PublicHouseRule {
  rule: string;
  sortOrder: number;
}

export interface PublicPricing {
  basePrice: number;
  currency: string;
}

export interface PublicListing {
  id: string;
  title: string;
  description: string | null;
  propertyType: string;
  status: string;
  city: string;
  state: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  maxGuests: number;
  numBedrooms: number;
  numBathrooms: number;
  numBeds: number;
  checkInTime: string;
  checkOutTime: string;
  minStayNights: number;
  maxStayNights: number | null;
  pricing: PublicPricing | null;
  images: PublicListingImage[];
  amenities: PublicAmenity[];
  houseRules: PublicHouseRule[];
}
