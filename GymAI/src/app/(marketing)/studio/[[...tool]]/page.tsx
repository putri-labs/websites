/**
 * Sanity Studio embedded in Next.js at /studio
 * Access is restricted in production — add auth middleware as needed.
 */
import { NextStudio } from "next-sanity/studio";
import config from "../../../../../sanity.config";

export const dynamic = "force-dynamic";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
