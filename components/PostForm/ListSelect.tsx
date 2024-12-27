export default function ListSelect({
  lists,
}: {
  lists: { uri: string; name: string }[];
}) {
  return (
    <select defaultValue={lists[0].uri} name="list">
      {lists.map(({ uri, name }) => (
        <option key={uri} value={uri}>
          {name}
        </option>
      ))}
    </select>
  );
}

const ROOT_LISTS = [
  { name: "팔로잉 / 내가 팔로우하는 사람들", uri: `followings` },
  { name: "팔로워 / 나를 팔로우하는 사람들", uri: `followers` },
];

export const getList = (uri?: string) =>
  uri
    ? [
        { name: "윗글과 동일하게", uri },
        { name: "타래를 포함된 계정", uri: "current" },
      ]
    : ROOT_LISTS;
