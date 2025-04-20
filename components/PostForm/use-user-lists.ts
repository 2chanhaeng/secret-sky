import { useProfile } from "@/hooks/use-profile";
import { getLists } from "@/lib/api";
import { useEffect, useState } from "react";
import { FOLLOWING_RULE, MENTION_RULE } from "@/types/threadgate";
import { UserListChoice } from "./types";

const DEFAULT_LISTS = [
  { name: "팔로잉", value: FOLLOWING_RULE, checked: true },
  { name: "멘션", value: MENTION_RULE, checked: false },
];

const useUserLists = () => {
  const [lists, setLists] = useState<UserListChoice[]>([]);
  const did = useProfile().profile?.did;

  useEffect(() => {
    if (!did) return;
    getLists(did) //
      .then((lists) =>
        lists.map(({ name, uri }) => ({ name, value: uri, checked: false }))
      ) //
      .then((lists) => setLists([...DEFAULT_LISTS, ...lists])) //
      .catch((error) => {
        console.error("Error fetching lists:", error);
      });
  }, [did]);

  return lists;
};

export default useUserLists;
