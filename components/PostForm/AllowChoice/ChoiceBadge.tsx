import { UserListChoice } from "../types";

export default function ChoiceBadge({ name, value, checked }: UserListChoice) {
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
