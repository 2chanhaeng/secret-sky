import client from "@/lib/client";
import Form from "next/form";
import { getAgent } from "@/lib/agent";
import { post } from "@/actions/post";

export default async function Home() {
  const agent = await getAgent(client);
  const { did } = agent;
  const { data } = await agent.getProfile({ actor: agent.did! });
  const { handle, avatar, displayName } = data;
  const lists = [
    { name: "팔로잉 / 내가 팔로우하는 사람들", uri: `${did}/followings` },
    { name: "팔로워 / 나를 팔로우하는 사람들", uri: `${did}/followers` },
  ];
  return (
    <main>
      <h1>{displayName ?? handle}</h1>
      <img src={avatar} alt={displayName} />
      <p>{handle}</p>
      <a href={`https://bsky.app/profile/${did}`}>프로필</a>
      <Form action={post}>
        <textarea name="content" />
        <textarea name="open" />
        <select defaultValue={lists[0].uri} name="list">
          {lists.map(({ uri, name }) => (
            <option key={uri} value={uri}>
              {name}
            </option>
          ))}
        </select>
        <button type="submit">Post</button>
      </Form>
    </main>
  );
}
