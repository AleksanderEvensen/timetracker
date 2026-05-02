import { createFileRoute, linkOptions, Outlet } from "@tanstack/react-router";
import { ListIcon, SquareCheckBig } from "lucide-react";
import { useState } from "react";

import {
  AppSidebar,
  type AppSidebarNavItem,
} from "#/components/compositions/app-sidebar";
import { SidebarInset, SidebarProvider } from "#/components/ui/sidebar";
import { useProjectsStore } from "#/stores/projects";

export const Route = createFileRoute("/_sidebar-layout")({
  component: RouteComponent,
});

const navItems: ReadonlyArray<AppSidebarNavItem> = [
  {
    ...linkOptions({ to: "/" }),
    label: "Tasks",
    icon: SquareCheckBig,
  },
  {
    ...linkOptions({ to: "/timeline" }),
    label: "Timeline",
    icon: ListIcon,
  },
];

const settingsLink = linkOptions({ to: "/settings" });

function RouteComponent() {
  const [isRunning, setIsRunning] = useState(false);
  const currentProject = useProjectsStore((s) =>
    s.currentProjectId
      ? (s.projects.find((p) => p.id === s.currentProjectId) ?? undefined)
      : undefined,
  );

  return (
    <SidebarProvider>
      <AppSidebar
        currentProject={
          currentProject ? { name: currentProject.name } : undefined
        }
        navItems={navItems}
        settingsLink={settingsLink}
        tracker={
          currentProject
            ? {
                subText: currentProject.name,
                isRunning,
                elapsed: "00:00:00",
                onToggle: () => setIsRunning((prev) => !prev),
              }
            : undefined
        }
      />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
