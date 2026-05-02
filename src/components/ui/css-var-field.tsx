import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { OklchPicker } from "#/components/ui/oklch-picker";
import { Slider } from "#/components/ui/slider";
import { cn } from "#/lib/utils";
import type { VariableKind } from "#/hooks/use-theme-variables";

type CssVarFieldProps = {
  name: string;
  value: string;
  kind: VariableKind;
  onChange: (next: string) => void;
  className?: string;
};

const LENGTH_RE = /^(-?\d*\.?\d+)(rem|em|px|%|vh|vw|ch|pt)$/;

function CssVarField({ name, value, kind, onChange, className }: CssVarFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label className="font-mono text-[0.7rem] text-muted-foreground">{name}</Label>
      <FieldEditor value={value} kind={kind} onChange={onChange} />
    </div>
  );
}

function FieldEditor({
  value,
  kind,
  onChange,
}: {
  value: string;
  kind: VariableKind;
  onChange: (next: string) => void;
}) {
  if (kind === "color") {
    return <OklchPicker value={value} onChange={onChange} />;
  }
  if (kind === "length") {
    return <LengthEditor value={value} onChange={onChange} />;
  }
  if (kind === "number") {
    return <NumberEditor value={value} onChange={onChange} />;
  }
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      className="font-mono text-[0.7rem]"
      spellCheck={false}
    />
  );
}

function LengthEditor({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  const m = LENGTH_RE.exec(value.trim());
  if (!m) {
    return (
      <Input
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        className="font-mono text-[0.7rem]"
      />
    );
  }
  const num = parseFloat(m[1]);
  const unit = m[2];
  const max = unit === "px" ? 64 : unit === "%" ? 100 : 8;
  const step = unit === "px" ? 1 : 0.05;

  return (
    <div className="flex items-center gap-2">
      <Slider
        min={0}
        max={max}
        step={step}
        value={num}
        onValueChange={(next) => {
          if (typeof next === "number") {
            onChange(`${formatNum(next)}${unit}`);
          }
        }}
        className="flex-1"
      />
      <Input
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        className="w-20 font-mono text-[0.7rem]"
      />
    </div>
  );
}

function NumberEditor({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  return (
    <Input
      type="number"
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      className="font-mono text-[0.7rem]"
    />
  );
}

function formatNum(n: number): string {
  return Number.isInteger(n) ? n.toString() : n.toFixed(3).replace(/\.?0+$/, "");
}

export { CssVarField };
