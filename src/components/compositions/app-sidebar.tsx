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
  currentProject?: AppSidebarProject;
  navItems: ReadonlyArray<AppSidebarNavItem>;
  settingsLink: LinkComponentProps<"a">;
  tracker?: AppSidebarTracker;
};

export function AppSidebar({
  currentProject,
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
              <div className="grid flex-1 text-left leading-tight">
                {currentProject ? (
                  <span className="truncate text-sm font-medium">
                    {currentProject.name}
                  </span>
                ) : (
                  <>
                    <span className="truncate text-sm font-medium">
                      No project
                    </span>
                    <span className="truncate text-[0.625rem] text-sidebar-foreground/60">
                      Tap to choose one
                    </span>
                  </>
                )}
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
        {currentProject && tracker ? (
          <TrackerCard tracker={tracker} />
        ) : (
          <NoProjectCard />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

function NoProjectCard() {
  return (
    <Link
      to="/projects"
      className={cn(
        "group/no-project flex items-center gap-2 rounded-md border border-dashed border-sidebar-border bg-sidebar-accent/20 p-2 text-sidebar-foreground transition-colors outline-none",
        "hover:bg-sidebar-accent/40",
        "focus-visible:border-sidebar-ring focus-visible:ring-2 focus-visible:ring-sidebar-ring/30",
      )}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-accent text-sidebar-accent-foreground">
        <FolderKanbanIcon className="size-4" />
      </span>
      <div className="grid min-w-0 flex-1 leading-tight">
        <span className="truncate text-sm font-medium">No project</span>
        <span className="truncate text-[0.625rem] text-sidebar-foreground/60">
          Select or create one to track time
        </span>
      </div>
    </Link>
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
