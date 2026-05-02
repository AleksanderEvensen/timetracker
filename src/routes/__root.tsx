/// <reference types="vite/client" />
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import appCss from "#/styles.css?url";
import { ThemeEditor } from "#/components/compositions/theme-editor";
import { TooltipProvider } from "#/components/ui/tooltip";

export const Route = createRootRoute({
  ssr: false,
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootDocument,
  pendingComponent: () => <div>Loading...</div>,
});

function RootDocument() {
  return (
    <html className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
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
        <Scripts />
      </body>
    </html>
  );
}
