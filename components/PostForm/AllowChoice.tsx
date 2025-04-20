import { UserListChoice } from "./types";

export default function AllowChoice({ lists }: { lists: UserListChoice[] }) {
  return (
    <fieldset className="flex gap-2 flex-wrap">
      <legend className="text-sm text-foreground/60 mb-2">
        비밀글을 누구와 공유할까요?
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

function ChoiceBadge({ name, value, checked }: UserListChoice) {
  return (
    <label className="text-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs transition-colors border has-[:checked]:bg-foreground has-[:checked]:text-background has-[:checked]:font-bold">
      <input
        type="checkbox"
        name="allow"
        value={value}
        className="hidden"
        defaultChecked={checked}
      />
      {name}
    </label>
  );
}
