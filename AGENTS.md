# Rules for Coding Agents

CLAUDE.md is a symlink to the AGENTS.md file. This means that if you edit AGENTS.md, you will also edit CLAUDE.md

Strict rules for working in this codebase. These are not suggestions.

## Architecture

- `src/components/ui/` — primitive, reusable UI components (shadcn-style). Owns all visual styling.
- `src/components/shells/` — shells that wrap pages (page-level shells, error boundaries, empty states).
- `src/components/compositions/` — compositions that compose pages (header, toolbar, lists, navbars, etc...).
- `src/routes/` — TanStack Router route files. **Composition only.** No visual styling.
- `src/lib/` — utilities (`cn`, helpers).
- `src/hooks/` — custom React hooks.

## The Iron Rule

> **Files in `src/routes/` are pure composition. They wire components together. They do not style.**

A route file describes _what_ is on the page using existing components, not _how_ it looks.

## Dumb Components

> **Components in `src/components/**` are as dumb as possible. They render what they're told.\*\*

Components receive props and render. They do not fetch. They do not own business logic. Pages (route files) own data fetching and pass results down as props.

### Forbidden in `src/components/**`

- `fetch`, `axios`, or any direct network call. Ever.
- Query hooks that trigger fetches (`useQuery`, `useSuspenseQuery`, loaders, etc.). Data is fetched in the route and passed down.
- Reaching into global stores or context for values that could just as easily be a prop. Prefer props.

### State and effects

- Keep component state to a minimum. Most components should be stateless and driven entirely by props.
- `useEffect` is **strongly discouraged**. There is almost always a way to do it without one:
  - Deriving values from props/state → compute during render, don't sync in an effect.
  - Resetting state when a prop changes → use `key` to remount, don't watch in an effect.
  - Reacting to user events → put the logic in the event handler, not in an effect that watches state.
  - Subscribing to an external store → `useSyncExternalStore`.
  - Fetching data → fetch in the route, not in the component.
- If you reach for `useEffect`, stop and justify it in a comment. The bar is high.

### Where logic lives

- **Routes (`src/routes/**`)\*\*: data fetching, mutations, route-level state, navigation.
- **Hooks (`src/hooks/**`)\*\*: reusable stateful behavior shared across routes.
- **Components (`src/components/**`)\*\*: render props. That's it.

## Allowed in `src/routes/**`

Tailwind classes in route files are restricted to **layout primitives only**:

- **Flex / Grid**: `flex`, `grid`, `flex-col`, `flex-row`, `grid-cols-*`, `grid-rows-*`, `flex-1`, `flex-wrap`, `flex-nowrap`, `shrink-0`, `grow`, `basis-*`
- **Alignment**: `items-*`, `justify-*`, `place-*`, `self-*`, `content-*`
- **Gap & spacing between layout children**: `gap-*`, `gap-x-*`, `gap-y-*`, `space-x-*`, `space-y-*`
- **Sizing for layout**: `w-full`, `h-full`, `min-w-0`, `min-h-0`, `max-w-*` (only for layout containers, e.g., `max-w-screen-lg`)
- **Positioning**: `relative`, `absolute`, `fixed`, `sticky`, `inset-*`, `top-*`, `right-*`, `bottom-*`, `left-*`, `z-*`
- **Overflow** for scroll containers: `overflow-*`
- **Container queries / responsive prefixes** on the above: `sm:`, `md:`, `lg:`, `@container`, etc.

## Forbidden in `src/routes/**`

If you find yourself reaching for any of these in a route file, **stop and build (or extend) a component instead**:

- Colors of any kind: `bg-*`, `text-*` (color), `border-*` (color), `ring-*`, `from-*`, `to-*`, `via-*`, `fill-*`, `stroke-*`, `divide-*`, `outline-*`, `accent-*`, `caret-*`, `decoration-*`, `placeholder:*` colors, `shadow-*` with color
- Typography: `text-xs|sm|base|lg|xl|...`, `font-*`, `leading-*`, `tracking-*`, `uppercase`, `lowercase`, `capitalize`, `italic`, `underline`, `line-through`, `font-heading`
- Borders & radius: `rounded-*`, `border` (any width), `border-t|r|b|l`, `divide-*`
- Effects: `shadow-*`, `opacity-*` (unless conditional layout), `blur-*`, `backdrop-*`
- Padding inside a "card-like" surface: `p-*`, `px-*`, `py-*` used to give visual breathing room _inside_ a styled element. Padding to compose layout (`p-4` on the outer page container) is allowed; padding meant to make something _look_ nice is not — that belongs in the component.
- Hover / focus / active visual states: `hover:bg-*`, `hover:text-*`, `focus:*`, `active:*` (any visual change). Interactive visuals live in components.
- Arbitrary values like `bg-[#fff]` or `text-[14px]`
- Inline `style={{ color, background, ... }}`

## How to add styling

If a page needs a visual treatment that no component provides:

1. **First**, check `src/components/ui/` for an existing primitive (Card, Button, Badge, Empty, Field, etc.).
2. **Second**, check `src/components/compositions/` for an existing composition.
3. **Third**, if nothing fits, build a new component:
   - A new visual primitive → `src/components/ui/<name>.tsx`
   - A new page-level composition (header, toolbar, list shell, etc.) → `src/components/compositions/<name>.tsx`
4. Then import it into the route and compose.

Never solve a styling need by adding color/typography/border classes to a route file.

## Examples

### Wrong — styling in a route

```tsx
// src/routes/_sidebar-layout/index.tsx
function RouteComponent() {
  return (
    <div className="p-6 bg-card rounded-lg border border-border">
      <h1 className="text-xl font-bold text-foreground mb-4">Today</h1>
      <p className="text-sm text-muted-foreground">No entries yet.</p>
      <button className="mt-4 px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/80">
        Add entry
      </button>
    </div>
  );
}
```

### Right — composition only

```tsx
// src/routes/_sidebar-layout/index.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "#/components/ui/card";
import { Button } from "#/components/ui/button";
import { Empty } from "#/components/ui/empty";

function RouteComponent() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Today</CardTitle>
        </CardHeader>
        <CardContent>
          <Empty>No entries yet.</Empty>
        </CardContent>
        <CardFooter>
          <Button>Add entry</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
```

The route describes structure (`flex flex-col gap-4 p-6` for outer layout). Everything visual — the card surface, the title typography, the button colors — lives in the component.
