import {
  Moon,
  Sun,
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
import {
  desktopNavigationItems,
} from "../../shared-src/navigation/navigation-config";

export function Navigation() {
  const location = useLocation();
  const { setTheme } = useTheme();

  return (
    <aside
      data-sidebar="main"
      className="lg:w-64 xl:w-72 h-full bg-background/30 overflow-hidden flex-shrink-0"
      style={{
        minWidth: '256px',
        maxWidth: '288px',
        position: 'relative',
        zIndex: 40
      }}
    >
      <div className="flex flex-col h-full p-4 space-y-4 overflow-y-auto">
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-3">
            <Link
              to="/"
              className="flex flex-row items-center space-x-3 w-full justify-start h-auto px-4 py-2 hover:bg-accent/50 transition-colors rounded-md mb-2"
            >
              <CardTitle className="text-lg text-foreground">
                Фонд Права
              </CardTitle>
            </Link>

            <div className="h-px bg-border mx-2"></div>
          </CardHeader>
          <CardContent className="space-y-2">
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

            <div className="h-px bg-border mx-2 mt-4"></div>
            <div className="flex gap-2 mt-2">
              <TooltipProvider>
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
                      className="w-full h-9 hover:bg-accent/50"
                    >
                      <div className="relative h-4 w-4">
                        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute inset-0 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      </div>
                      <span className="ml-2">
                        {localStorage.getItem("theme") === "dark"
                          ? "Темная тема"
                          : "Светлая тема"}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Переключить тему</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
