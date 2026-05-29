interface Props {
  seed: string;
  label: string | null;
  size?: number;
}

const PALETTE = [
  "#ff4500",
  "#ff8717",
  "#ffb000",
  "#46d160",
  "#24a0ed",
  "#7193ff",
  "#a55eea",
  "#ea4c89",
  "#3aa57c",
  "#d63a3a",
];

function hash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function Avatar({ seed, label, size = 32 }: Props) {
  const color = PALETTE[hash(seed) % PALETTE.length];
  const letter = (label || seed || "?").trim().charAt(0).toUpperCase() || "?";
  const style = {
    backgroundColor: color,
    width: `${size}px`,
    height: `${size}px`,
    fontSize: `${Math.round(size * 0.45)}px`,
  };
  return (
    <div class="quipier-avatar" style={style} aria-hidden="true">
      {letter}
    </div>
  );
}
