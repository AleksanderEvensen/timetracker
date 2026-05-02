/// <reference types="vite/client" />
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import "#/styles.css";
import { ThemeEditor } from "#/components/compositions/theme-editor";
import { TooltipProvider } from "#/components/ui/tooltip";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: RootComponent,
  },
);

function RootComponent() {
  return (
    <>
      <TooltipProvider>
        <Outlet />
        <ThemeEditor />
      </TooltipProvider>
      <TanStackDevtools
        config={{
          inspectHotkey: ["Meta", "Shift", "Alt"],
          defaultOpen: false,
        }}
        plugins={[
          {
            name: "TanStack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
          {
            name: "TanStack Query",
            render: <ReactQueryDevtoolsPanel />,
          },
        ]}
      />
    </>
  );
}
