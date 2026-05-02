/**
 * VacayStack Public API Client.
 *
 * Centralized data-fetching utility for the stargazing_client website.
 * Uses Next.js ISR (Incremental Static Regeneration) via the `revalidate`
 * option so the site remains statically fast but auto-refreshes when
 * CRM content changes.
 *
 * Environment Variables:
 *   VACAYSTACK_API_URL — Base URL of the VacayStack backend (e.g. http://localhost:8000)
 *   VACAYSTACK_CLIENT_ID — UUID of this client in VacayStack
 */

import type { PublicWebsiteContent, PublicListing } from "./types";

const API_URL = process.env.VACAYSTACK_API_URL || "http://localhost:8000";
const CLIENT_ID = process.env.VACAYSTACK_CLIENT_ID || "";

/** ISR revalidation interval in seconds (1 hour). */
const REVALIDATE_SECONDS = 3600;

/**
 * Convert snake_case API keys to camelCase for TypeScript consumption.
 *
 * The VacayStack API returns snake_case JSON (Python convention).
 * The frontend uses camelCase (TypeScript convention). This utility
 * bridges the gap without requiring backend changes.
 */
function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Recursively transform all keys in an object from snake_case to camelCase.
 */
function transformKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(transformKeys);
  }
  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([key, value]) => [
        snakeToCamel(key),
        transformKeys(value),
      ])
    );
  }
  return obj;
}

/**
 * Fetch the CMS-managed website content for this client.
 *
 * Uses ISR so the page is statically generated but refreshes
 * every REVALIDATE_SECONDS. Falls back to null on failure so
 * the website can render gracefully with default/hardcoded content.
 */
export async function getWebsiteContent(): Promise<PublicWebsiteContent | null> {
  if (!CLIENT_ID) {
    console.warn(
      "[api] VACAYSTACK_CLIENT_ID is not set. Using default content."
    );
    return null;
  }

  try {
    const res = await fetch(
      `${API_URL}/public/content/${CLIENT_ID}`,
      { next: { revalidate: REVALIDATE_SECONDS } }
    );

    if (!res.ok) {
      console.error(
        `[api] Failed to fetch website content: ${res.status} ${res.statusText}`
      );
      return null;
    }

    const raw = await res.json();
    return transformKeys(raw) as PublicWebsiteContent;
  } catch (error) {
    console.error("[api] Error fetching website content:", error);
    return null;
  }
}

/**
 * Fetch the active property listings for this client.
 *
 * Returns an empty array on failure so the website can still render.
 */
export async function getListings(): Promise<PublicListing[]> {
  if (!CLIENT_ID) {
    console.warn(
      "[api] VACAYSTACK_CLIENT_ID is not set. Returning empty listings."
    );
    return [];
  }

  try {
    const res = await fetch(
      `${API_URL}/public/listings/${CLIENT_ID}`,
      { next: { revalidate: REVALIDATE_SECONDS } }
    );

    if (!res.ok) {
      console.error(
        `[api] Failed to fetch listings: ${res.status} ${res.statusText}`
      );
      return [];
    }

    const raw = await res.json();
    return transformKeys(raw) as PublicListing[];
  } catch (error) {
    console.error("[api] Error fetching listings:", error);
    return [];
  }
}
