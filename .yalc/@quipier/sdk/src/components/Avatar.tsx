import { avatarColor } from "../util.js";

interface Props {
  seed: string;
  label: string | null;
  size?: number;
}

export function Avatar({ seed, label, size = 32 }: Props) {
  const color = avatarColor(seed);
  const letter = (label || seed || "?").trim().charAt(0).toUpperCase() || "?";
  const style = {
    backgroundColor: color,
    width: `${size}px`,
    height: `${size}px`,
    fontSize: `${Math.round(size * 0.45)}px`,
  };
  return (
    <div class="quipier-avatar" data-quipier-part="avatar" style={style} aria-hidden="true">
      {letter}
    </div>
  );
}
