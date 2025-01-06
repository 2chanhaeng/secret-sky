import client from "@/lib/client";
import Form from "next/form";
import { getAgent } from "@/lib/agent";
import { post } from "@/actions/post";
import AuthorAvatar from "@/components/AuthorAvatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const agent = await getAgent(client, "/");
  const { did } = agent;
  const { data } = await agent.getProfile({ actor: agent.did! });
  // const { handle, avatar, displayName } = data;
  const lists = [
    { name: "팔로잉 / 내가 팔로우하는 사람들", uri: `${did}/followings` },
    { name: "팔로워 / 나를 팔로우하는 사람들", uri: `${did}/followers` },
  ];
  return (
    <main>
      <section className="flex">
        <AuthorAvatar {...data} />
        <Form action={post} className="flex flex-col ml-2 gap-2">
          <Textarea name="content" placeholder="무슨 일이 일어나고 있나요?" />
          <Textarea
            name="open"
            placeholder="어떤 글인지 공개할 내용을 적어주세요."
          />
          <Select name="list" defaultValue={lists[0].uri}>
            <SelectTrigger>
              <SelectValue placeholder="리스트" />
            </SelectTrigger>
            <SelectContent>
              {lists.map(({ uri, name }) => (
                <SelectItem key={uri} value={uri}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="submit"
            className="bg-foreground text-background font-bold"
          >
            Post
          </Button>
        </Form>
      </section>
    </main>
  );
}
