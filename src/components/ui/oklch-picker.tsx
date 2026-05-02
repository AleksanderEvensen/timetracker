import { Input } from "#/components/ui/input";
import { Slider } from "#/components/ui/slider";
import { cn } from "#/lib/utils";
import { formatOklch, parseOklch, type Oklch } from "#/lib/oklch";

type OklchPickerProps = {
  value: string;
  onChange: (next: string) => void;
  className?: string;
};

const CHANNELS: ReadonlyArray<{
  key: keyof Oklch;
  label: string;
  min: number;
  max: number;
  step: number;
}> = [
  { key: "l", label: "L", min: 0, max: 1, step: 0.001 },
  { key: "c", label: "C", min: 0, max: 0.4, step: 0.001 },
  { key: "h", label: "H", min: 0, max: 360, step: 0.1 },
  { key: "a", label: "A", min: 0, max: 1, step: 0.01 },
];

function OklchPicker({ value, onChange, className }: OklchPickerProps) {
  const parsed = parseOklch(value);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="size-7 shrink-0 rounded-md border border-border bg-clip-padding shadow-inner"
          style={{ backgroundColor: value }}
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.currentTarget.value)}
          className="font-mono text-[0.7rem]"
          spellCheck={false}
        />
      </div>
      {parsed ? (
        <div className="grid gap-1.5">
          {CHANNELS.map((ch) => (
            <ChannelRow
              key={ch.key}
              label={ch.label}
              min={ch.min}
              max={ch.max}
              step={ch.step}
              value={parsed[ch.key]}
              onChange={(next) => onChange(formatOklch({ ...parsed, [ch.key]: next }))}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ChannelRow({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="grid grid-cols-[1.25rem_1fr_3rem] items-center gap-2">
      <span className="font-mono text-[0.65rem] text-muted-foreground">{label}</span>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={(next) => {
          if (typeof next === "number") onChange(next);
        }}
      />
      <span className="text-right font-mono text-[0.65rem] tabular-nums text-muted-foreground">
        {value.toFixed(label === "H" ? 1 : 3)}
      </span>
    </div>
  );
}

export { OklchPicker };
