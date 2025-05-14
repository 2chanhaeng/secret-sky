import { UserListChoice } from "../types";
import ChoiceBadge from "./ChoiceBadge";
import AllowChoiceInfo from "./Info";

export default function AllowChoice({ lists }: { lists: UserListChoice[] }) {
  return (
    <fieldset className="flex gap-2 flex-wrap">
      <legend className="text-sm text-foreground/60 mb-2">
        비밀글을 누구와 공유할까요?
        <AllowChoiceInfo />
      </legend>
      {lists.map(({ name, value, checked }) => (
        <ChoiceBadge
          key={`choice-badge-${value}-${name}`}
          value={value}
          name={name}
          checked={checked}
        />
      ))}
    </fieldset>
  );
}
