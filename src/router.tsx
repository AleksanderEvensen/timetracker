import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { NotFound } from "#/components/shells/not-found";
import { DefaultCatchBoundary } from "#/components/shells/catch-boundary";

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: false,
    defaultNotFoundComponent: () => <NotFound />,
    defaultErrorComponent: DefaultCatchBoundary,
  });

  return router;
}
