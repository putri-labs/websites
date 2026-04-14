import { sanityClient } from "./client";

export interface SanityPricingPlan {
  _id: string;
  name: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
  order: number;
}

export interface SanityFaqItem {
  _id: string;
  question: string;
  answer: string;
  order: number;
}

export async function getPricingPlans(): Promise<SanityPricingPlan[]> {
  if (!sanityClient) return [];
  return sanityClient.fetch(
    `*[_type == "pricingPlan"] | order(order asc) {
      _id, name, monthlyPrice, yearlyPrice, description, features, cta, highlighted, order
    }`
  );
}

export async function getFaqItems(): Promise<SanityFaqItem[]> {
  if (!sanityClient) return [];
  return sanityClient.fetch(
    `*[_type == "faqItem"] | order(order asc) {
      _id, question, answer, order
    }`
  );
}
