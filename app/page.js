import HomeClient from "./HomeClient";
import { getBioData } from "@/lib/api/server-fetch";

export default async function Home() {
  const bioData = await getBioData();

  return <HomeClient bioData={bioData} />;
}
