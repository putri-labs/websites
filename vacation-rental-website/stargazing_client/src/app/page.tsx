import { getFramePaths } from "scroll-telling/server";
import RetreatExperience from "@/components/RetreatExperience";

export default async function Home() {
  const footage1 = await getFramePaths("assets/footage1", /^ezgif-frame-\d+\.jpg$/);
  const footage2 = await getFramePaths("assets/footage2", /^ezgif-frame-\d+\.jpg$/);
  const footage3 = await getFramePaths("assets/footage3", /^ezgif-frame-\d+\.jpg$/);
  
  const allFrames = [...footage1, ...footage2, ...footage3];

  return <RetreatExperience frames={allFrames} />;
}
