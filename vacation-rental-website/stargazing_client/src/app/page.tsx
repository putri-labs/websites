import { getFramePaths } from "scroll-telling/server";
import RetreatExperience from "@/components/RetreatExperience";
import { getWebsiteContent, getListings } from "@/lib/api";

export default async function Home() {
  // Fetch scroll frames and CMS data in parallel for optimal performance.
  const [footage1, footage2, footage3, content, listings] = await Promise.all([
    getFramePaths("assets/footage1", /^ezgif-frame-\d+\.jpg$/),
    getFramePaths("assets/footage2", /^ezgif-frame-\d+\.jpg$/),
    getFramePaths("assets/footage3", /^ezgif-frame-\d+\.jpg$/),
    getWebsiteContent(),
    getListings(),
  ]);

  const allFrames = [...footage1, ...footage2, ...footage3];

  return (
    <RetreatExperience
      frames={allFrames}
      content={content}
      listings={listings}
    />
  );
}
