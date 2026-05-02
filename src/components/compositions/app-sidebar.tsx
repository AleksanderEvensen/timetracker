import { Link, type LinkComponentProps } from "@tanstack/react-router";
import {
  ChevronRightIcon,
  FolderKanbanIcon,
  Pause,
  Play,
  Settings,
  type LucideIcon,
} from "lucide-react";

import { Button } from "#/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "#/components/ui/sidebar";
import { cn } from "#/lib/utils";

export type AppSidebarNavItem = LinkComponentProps<"a"> & {
  label: string;
  icon?: LucideIcon;
};

export type AppSidebarProject = {
  name: string;
  imageSrc?: string;
};

export type AppSidebarTracker = {
  subText: string;
  isRunning: boolean;
  elapsed: string;
  onToggle: () => void;
};

export type AppSidebarProps = {
  projectName: string;
  navItems: ReadonlyArray<AppSidebarNavItem>;
  settingsLink: LinkComponentProps<"a">;
  tracker: AppSidebarTracker;
  onProjectSelect?: () => void;
};

export function AppSidebar({
  projectName,
  navItems,
  settingsLink,
  tracker,
}: AppSidebarProps) {
  return (
    <Sidebar className="max-h-svh h-svh" collapsible="none">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link to="/projects" />}>
              <FolderKanbanIcon className="size-6!" />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{projectName}</span>
              </div>
              <ChevronRightIcon className="ml-auto opacity-60" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const { label, icon: Icon, ...link } = item;
                return (
                  <SidebarMenuItem key={label}>
                    <SidebarMenuButton
                      tooltip={label}
                      render={
                        <Link
                          {...link}
                          activeProps={{ "data-active": "true" }}
                        />
                      }
                    >
                      {Icon ? <Icon /> : null}
                      <span>{label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Settings"
              render={
                <Link
                  {...settingsLink}
                  activeProps={{ "data-active": "true" }}
                />
              }
            >
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <TrackerCard tracker={tracker} />
      </SidebarFooter>
    </Sidebar>
  );
}

function TrackerCard({ tracker }: { tracker: AppSidebarTracker }) {
  const { subText, isRunning, elapsed, onToggle } = tracker;
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border border-sidebar-border bg-sidebar-accent/40 p-2",
        isRunning && "bg-primary/10",
      )}
    >
      <Button
        size="icon-lg"
        variant={isRunning ? "destructive" : "default"}
        onClick={onToggle}
        aria-label={isRunning ? "Pause tracking" : "Start tracking"}
      >
        {isRunning ? <Pause /> : <Play />}
      </Button>
      <div className="grid min-w-0 flex-1 leading-tight">
        <span className="truncate text-sm font-medium tabular-nums">
          {elapsed}
        </span>
        <span className="truncate text-[0.625rem] text-sidebar-foreground/60">
          {subText}
        </span>
      </div>
    </div>
  );
}
