import Form from "next/form";
import { post } from "@/actions/post";
// import ListSelect from "./ListSelect";

export default function PostForm({
  parent,
}: {
  parent?: { uri: string; list: string };
}) {
  return (
    <Form action={post}>
      <textarea name="content" />
      <textarea name="open" />
      <input
        type="hidden"
        name="list"
        value={parent ? parent.list : "followings"}
      />
      {parent && <input type="hidden" name="parent" value={parent.uri} />}
      <button type="submit">Post</button>
    </Form>
  );
}
