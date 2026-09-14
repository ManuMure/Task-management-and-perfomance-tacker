const palette = [
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
];

function initialsOf(name: string) {
  const parts = name.trim().split(" ");
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

function colorFor(name: string) {
  const sum = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return palette[sum % palette.length];
}

export default function AssigneeAvatar({ name }: { name?: string }) {
  if (!name) {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-400">
          —
        </span>
        <span className="text-sm text-slate-400">Unassigned</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${colorFor(
          name
        )}`}
      >
        {initialsOf(name)}
      </span>
      <span className="text-sm text-slate-600">{name}</span>
    </span>
  );
}