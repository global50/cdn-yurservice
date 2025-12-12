import {
  Moon,
  Sun,
  PanelLeftClose,
  PanelLeftOpen,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { useSidebar } from "@/contexts/sidebar-context";
import {
  desktopNavigationItems,
} from "../../shared-src/navigation/navigation-config";

export function Navigation() {
  const location = useLocation();
  const { setTheme } = useTheme();
  const { leftCollapsed, rightCollapsed, toggleLeft, collapseAll, expandAll } =
    useSidebar();

  const handleFocusMode = () => {
    if (leftCollapsed && rightCollapsed) {
      expandAll();
    } else {
      collapseAll();
    }
  };

  if (leftCollapsed) {
    return (
      <aside className="hidden lg:flex lg:w-16 xl:w-18 flex-col h-full bg-background/30 overflow-hidden transition-all duration-300">
        <div className="flex-1 p-2 space-y-2 overflow-y-auto">
          <TooltipProvider>
            <div className="flex flex-col items-center space-y-3 py-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to="/"
                    className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors"
                  >
                    <div className="h-5 w-5 rounded bg-white"></div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Фонд Права</p>
                </TooltipContent>
              </Tooltip>

              <div className="h-px w-8 bg-border"></div>

              {desktopNavigationItems.map((item) => (
                <Tooltip key={item.label}>
                  <TooltipTrigger asChild>
                    <Link to={item.path}>
                      <Button
                        variant={
                          location.pathname === item.path ? "default" : "ghost"
                        }
                        size="icon"
                        className={`h-10 w-10 ${
                          location.pathname === item.path
                            ? "bg-blue-500 hover:bg-blue-600 text-white"
                            : "hover:bg-accent/50"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}

              <div className="h-px w-8 bg-border mt-2"></div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleLeft}
                    className="h-8 w-8 hover:bg-accent/50"
                  >
                    <PanelLeftOpen className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Раскрыть</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleFocusMode}
                    className="h-8 w-8 hover:bg-accent/50"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>
                    {leftCollapsed && rightCollapsed ? "Раскрыть" : "Фокус"}
                  </p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const themes = ["light", "dark"] as const;
                      const currentIndex = themes.indexOf(
                        (localStorage.getItem("theme") as any) || "light"
                      );
                      const nextTheme =
                        themes[(currentIndex + 1) % themes.length];
                      setTheme(nextTheme);
                    }}
                    className="h-8 w-8 hover:bg-accent/50"
                  >
                    <div className="relative h-4 w-4">
                      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute inset-0 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>
                    {localStorage.getItem("theme") === "dark"
                      ? "Dark"
                      : "Light"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </aside>
    );
  }

  return (
    <aside className="hidden lg:flex lg:w-64 xl:w-72 flex-col h-full bg-background/30 overflow-hidden transition-all duration-300">
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-3">
            <Link
              to="/"
              className="flex flex-row items-center space-x-3 w-full justify-start h-auto px-4 py-2 hover:bg-accent/50 transition-colors rounded-md mb-2"
            >
              {/* <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                <div className="h-4 w-4 rounded bg-white"></div>
              </div> */}
              <CardTitle className="text-lg text-foreground">
                Фонд Права
              </CardTitle>
            </Link>

            {/* Separator after brand */}
            <div className="h-px bg-border mx-2"></div>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Navigation items */}
            {desktopNavigationItems.map((item) => (
              <Button
                key={item.label}
                variant={location.pathname === item.path ? "default" : "ghost"}
                className={`w-full justify-start h-12 px-4 ${
                  location.pathname === item.path
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "hover:bg-accent/50 transition-colors"
                }`}
                asChild
              >
                <Link to={item.path}>
                  <item.icon className="h-5 w-5 mr-3" />
                  <span className="text-base">{item.label}</span>
                </Link>
              </Button>
            ))}

            {/* Collapse Controls */}
            <div className="h-px bg-border mx-2 mt-4"></div>
            <div className="flex gap-2 mt-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleLeft}
                      className="flex-1 h-9 hover:bg-accent/50"
                    >
                      <PanelLeftClose className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Скрыть</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleFocusMode}
                      className="flex-1 h-9 hover:bg-accent/50"
                    >
                      <Minimize2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {leftCollapsed && rightCollapsed
                        ? "Expand all sidebars"
                        : "Focus Mode (Collapse all sidebars)"}
                    </p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const themes = ["light", "dark"] as const;
                        const currentIndex = themes.indexOf(
                          (localStorage.getItem("theme") as any) || "light"
                        );
                        const nextTheme =
                          themes[(currentIndex + 1) % themes.length];
                        setTheme(nextTheme);
                      }}
                      className="flex-1 h-9 hover:bg-accent/50"
                    >
                      <div className="relative h-4 w-4">
                        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute inset-0 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      </div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {localStorage.getItem("theme") === "dark"
                        ? "Dark"
                        : "Light"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>

        {/* Version Display */}
        {/* <div className="px-4 pb-4">
          <p className="text-xs text-muted-foreground text-center">
            v{(window as any).APP_VERSION || "1.0.0"}
          </p>
        </div> */}
      </div>
    </aside>
  );
}
