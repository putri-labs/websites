import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

// Only create the client if a project ID is configured
export const sanityClient = projectId
  ? createClient({ projectId, dataset, apiVersion: "2024-01-01", useCdn: true })
  : null;
