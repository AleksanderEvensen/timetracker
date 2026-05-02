/// <reference types="vite/client" />
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import "#/styles.css";
import { ThemeEditor } from "#/components/compositions/theme-editor";
import { TooltipProvider } from "#/components/ui/tooltip";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

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
        ]}
      />
    </>
  );
}
