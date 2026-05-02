import { createFileRoute, linkOptions, Outlet } from "@tanstack/react-router";
import { ListIcon, SquareCheckBig } from "lucide-react";

import {
  AppSidebar,
  type AppSidebarNavItem,
} from "#/components/compositions/app-sidebar";
import { SidebarInset, SidebarProvider } from "#/components/ui/sidebar";
import { useState } from "react";

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
  return (
    <SidebarProvider>
      <AppSidebar
        projectName="Build Pilot"
        navItems={navItems}
        settingsLink={settingsLink}
        tracker={{
          subText: "Acme Inc.",
          isRunning: isRunning,
          elapsed: "00:00:00",
          onToggle: () => {
            setIsRunning((prev) => !prev);
          },
        }}
      />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
