import { useState } from "react";
import { Moon, Palette, RefreshCw, RotateCcw, Sun, X } from "lucide-react";

import { Button } from "#/components/ui/button";
import { CssVarField } from "#/components/ui/css-var-field";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { ScrollArea } from "#/components/ui/scroll-area";
import { Slider } from "#/components/ui/slider";
import { useThemeVariables, type ThemeVariable } from "#/hooks/use-theme-variables";

const DEFAULT_ROOT_FONT_SIZE = 16;

function readRootFontSize() {
  if (typeof document === "undefined") return DEFAULT_ROOT_FONT_SIZE;
  const cs = getComputedStyle(document.documentElement).fontSize;
  return parseFloat(cs) || DEFAULT_ROOT_FONT_SIZE;
}

export function ThemeEditor() {
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(() =>
    typeof document !== "undefined" ? document.documentElement.classList.contains("dark") : false,
  );
  const [rootFontSize, setRootFontSize] = useState(readRootFontSize);
  const { vars, setVar, reset, rescan } = useThemeVariables();

  const toggleDark = () => {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    setIsDark(next);
    rescan();
  };

  const updateRootFontSize = (px: number) => {
    document.documentElement.style.fontSize = `${px}px`;
    setRootFontSize(px);
  };

  const handleReset = () => {
    reset();
    document.documentElement.style.removeProperty("font-size");
    setRootFontSize(readRootFontSize());
  };

  if (!open) {
    return (
      <Button
        size="icon-lg"
        variant="default"
        onClick={() => setOpen(true)}
        aria-label="Open theme editor"
        className="fixed top-4 right-4 z-50 rounded-full shadow-lg"
      >
        <Palette />
      </Button>
    );
  }

  const groups = groupByPrefix(vars);

  return (
    <aside className="fixed top-4 right-4 bottom-4 z-50 flex w-96 flex-col overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-2xl">
      <header className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <div className="flex items-center gap-2">
          <Palette className="size-4" />
          <span className="font-heading text-sm font-medium">Theme</span>
          <span className="font-mono text-[0.65rem] text-muted-foreground">{vars.length} vars</span>
        </div>
        <div className="flex items-center gap-1">
          <Button size="icon-sm" variant="ghost" onClick={toggleDark} aria-label="Toggle dark mode">
            {isDark ? <Sun /> : <Moon />}
          </Button>
          <Button size="icon-sm" variant="ghost" onClick={rescan} aria-label="Rescan stylesheets">
            <RefreshCw />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={handleReset}
            aria-label="Reset to defaults"
          >
            <RotateCcw />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => setOpen(false)}
            aria-label="Close theme editor"
          >
            <X />
          </Button>
        </div>
      </header>
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-5 p-3">
          <section className="flex flex-col gap-3">
            <h3 className="font-heading text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Display
            </h3>
            <div className="flex flex-col gap-1.5">
              <Label className="font-mono text-[0.7rem] text-muted-foreground">
                Root font size
                <span className="ml-auto font-mono text-[0.65rem] tabular-nums">
                  {Math.round((rootFontSize / DEFAULT_ROOT_FONT_SIZE) * 100)}%
                </span>
              </Label>
              <div className="flex items-center gap-2">
                <Slider
                  min={8}
                  max={32}
                  step={0.5}
                  value={rootFontSize}
                  onValueChange={(next) => {
                    if (typeof next === "number") updateRootFontSize(next);
                  }}
                  className="flex-1"
                />
                <Input
                  type="number"
                  min={8}
                  max={48}
                  step={0.5}
                  value={rootFontSize}
                  onChange={(e) => {
                    const next = parseFloat(e.currentTarget.value);
                    if (!Number.isNaN(next)) updateRootFontSize(next);
                  }}
                  className="w-16 font-mono text-[0.7rem]"
                />
              </div>
            </div>
          </section>
          {groups.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No CSS variables discovered. Try Rescan once styles have loaded.
            </p>
          ) : null}
          {groups.map((group) => (
            <section key={group.label} className="flex flex-col gap-3">
              <h3 className="font-heading text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {group.label}
              </h3>
              <div className="flex flex-col gap-3">
                {group.items.map((v) => (
                  <CssVarField
                    key={v.name}
                    name={v.name}
                    value={v.value}
                    kind={v.kind}
                    onChange={(next) => setVar(v.name, next)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}

function groupByPrefix(vars: ReadonlyArray<ThemeVariable>) {
  const buckets = new Map<string, ThemeVariable[]>();
  for (const v of vars) {
    const stripped = v.name.replace(/^--/, "");
    const prefix = stripped.split("-")[0] || "other";
    const existing = buckets.get(prefix);
    if (existing) {
      existing.push(v);
    } else {
      buckets.set(prefix, [v]);
    }
  }
  return Array.from(buckets, ([label, items]) => ({ label, items })).sort((a, b) =>
    a.label.localeCompare(b.label),
  );
}
