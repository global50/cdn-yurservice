// Home page with welcome message and navigation

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Library } from "lucide-react";
import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-md">
        <CardHeader>
          <CardTitle className="text-3xl">Добро пожаловать в Фонд Права</CardTitle>
          <CardDescription className="text-base mt-2">
            Бизнес социальная сеть с AI и SaaS функционалом
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Это демонстрационная версия проекта, созданная для тестирования микросервисной архитектуры.
          </p>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Доступные сервисы:</h3>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Library className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">ЮрСервисы</CardTitle>
                    <CardDescription>Каталог сервисов для юристов</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Доступ к базе юридических сервисов, судам, ведомствам и инструментам.
                </p>
                <Button asChild className="w-full">
                  <Link to="/yurservice">
                    Перейти к сервису
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
