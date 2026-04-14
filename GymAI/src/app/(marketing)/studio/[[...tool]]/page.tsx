/**
 * Sanity Studio embedded in Next.js at /studio
 * Access is restricted in production — add auth middleware as needed.
 */
import { Studio } from "./Studio";

export const dynamic = "force-dynamic";

export default function StudioPage() {
  return <Studio />;
}
