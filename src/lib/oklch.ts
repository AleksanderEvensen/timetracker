export type Oklch = { l: number; c: number; h: number; a: number };

const OKLCH_RE = /^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+)(%?))?\s*\)$/i;

export function parseOklch(value: string): Oklch | null {
  const m = OKLCH_RE.exec(value.trim());
  if (!m) return null;

  let l = parseFloat(m[1]);
  if (m[2] === "%") l /= 100;

  const c = parseFloat(m[3]);
  const h = parseFloat(m[4]);

  let a = m[5] !== undefined ? parseFloat(m[5]) : 1;
  if (m[6] === "%") a /= 100;

  return { l, c, h, a };
}

export function formatOklch({ l, c, h, a }: Oklch): string {
  const parts = `${round(l, 4)} ${round(c, 4)} ${round(h, 3)}`;
  if (a >= 1) return `oklch(${parts})`;
  return `oklch(${parts} / ${round(a, 3)})`;
}

function round(n: number, decimals: number) {
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}
