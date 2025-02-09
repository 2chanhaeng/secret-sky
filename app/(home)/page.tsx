import NewPost from "@/components/NewPost";
import Timeline from "./components/Timeline";

export default async function Home() {
  return (
    <main>
      <Timeline />
      <NewPost />
    </main>
  );
}
