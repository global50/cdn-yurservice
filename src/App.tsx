import { Header } from "/apps/header/Header";
import { Navigation } from "/apps/navigation/Navigation";
import { MobileNav } from "/apps/mobileNav/MobileNav";
import { HomePage } from "/apps/home/HomePage";
import { YurServicePageWrapper } from "@/components/YurServicePageWrapper";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Routes, Route, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/contexts/sidebar-context";
import { useMemo } from "react";

const fullWidthRoutes = ["/yurservice"];

function AppContent() {
  const location = useLocation();

  const isFullWidth = useMemo(
    () => fullWidthRoutes.includes(location.pathname),
    [location.pathname]
  );

  return (
    <div className="h-full w-full flex flex-col bg-background text-foreground overflow-hidden">
      <div className="flex flex-1 min-h-0">
        <Navigation />
        <div className="flex flex-col flex-1 min-w-0">
          <Header />
          <main className="flex-1 p-4 overflow-y-auto">
            <div
              className={isFullWidth ? "w-full" : "max-w-7xl mx-auto"}
              style={{ isolation: 'isolate' }}
            >
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route
                  path="/yurservice"
                  element={
                    <div style={{ all: 'initial', display: 'block' }}>
                      <div className="text-foreground">
                        <YurServicePageWrapper />
                      </div>
                    </div>
                  }
                />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <SidebarProvider>
        <AppContent />
      </SidebarProvider>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
