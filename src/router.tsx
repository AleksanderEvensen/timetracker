import { createRouter } from "@tanstack/solid-router";
import { routeTree } from "./routeTree.gen";
import { NotFound } from "#/components/shells/not-found";
import { DefaultCatchBoundary } from "#/components/shells/catch-boundary";
import { PageLoading } from "#/components/shells/page-loading";

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: false,
    defaultNotFoundComponent: () => <NotFound />,
    defaultErrorComponent: DefaultCatchBoundary,
    defaultPendingComponent: PageLoading,
  });

  return router;
}
