import { useCallback, useState } from "react";

export type VariableKind = "color" | "length" | "number" | "text";

export type ThemeVariable = {
  name: string;
  value: string;
  kind: VariableKind;
};

const ROOT_SELECTOR_HINTS = [":root", ":host", ":where(:root)", ":where(:host)"];
const DARK_SELECTOR_HINT = ".dark";

export function detectKind(value: string): VariableKind {
  const v = value.trim();
  if (!v) return "text";
  if (
    v.startsWith("oklch(") ||
    v.startsWith("oklab(") ||
    v.startsWith("rgb(") ||
    v.startsWith("rgba(") ||
    v.startsWith("hsl(") ||
    v.startsWith("hsla(") ||
    v.startsWith("color(") ||
    /^#[0-9a-f]{3,8}$/i.test(v)
  ) {
    return "color";
  }
  if (/^-?\d*\.?\d+(rem|em|px|%|vh|vw|ch|pt)$/.test(v)) return "length";
  if (/^-?\d*\.?\d+$/.test(v)) return "number";
  return "text";
}

function collectVarsFromRules(rules: CSSRuleList, out: Set<string>) {
  for (const rule of Array.from(rules)) {
    if (rule instanceof CSSStyleRule) {
      const sel = rule.selectorText ?? "";
      const isRoot = ROOT_SELECTOR_HINTS.some((s) => sel.includes(s));
      const isDark = sel.includes(DARK_SELECTOR_HINT);
      if (!isRoot && !isDark) continue;
      for (const prop of Array.from(rule.style)) {
        if (prop.startsWith("--")) out.add(prop);
      }
    } else if (rule instanceof CSSGroupingRule) {
      collectVarsFromRules(rule.cssRules, out);
    }
  }
}

function discoverRootVariables(): ThemeVariable[] {
  if (typeof document === "undefined") return [];

  const names = new Set<string>();
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      continue;
    }
    collectVarsFromRules(rules, names);
  }

  const cs = getComputedStyle(document.documentElement);
  const result: ThemeVariable[] = [];
  for (const name of names) {
    const value = cs.getPropertyValue(name).trim();
    if (!value) continue;
    result.push({ name, value, kind: detectKind(value) });
  }
  result.sort((a, b) => a.name.localeCompare(b.name));
  return result;
}

export function useThemeVariables() {
  const [vars, setVars] = useState<ThemeVariable[]>(() => discoverRootVariables());

  const setVar = useCallback((name: string, value: string) => {
    document.documentElement.style.setProperty(name, value);
    setVars((prev) =>
      prev.map((v) =>
        v.name === name ? { ...v, value, kind: detectKind(value) } : v,
      ),
    );
  }, []);

  const reset = useCallback(() => {
    setVars((prev) => {
      for (const v of prev) {
        document.documentElement.style.removeProperty(v.name);
      }
      return discoverRootVariables();
    });
  }, []);

  const rescan = useCallback(() => {
    setVars(discoverRootVariables());
  }, []);

  return { vars, setVar, reset, rescan };
}
