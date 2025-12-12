import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate, useLocation } from "react-router-dom"

export function Header() {
  const navigate = useNavigate()
  const location = useLocation()

  const getPageTitle = () => {
    const path = location.pathname

    if (path === '/' || path === '/home') return null
    if (path === '/about') return 'О проекте'
    if (path === '/settings') return 'Настройки'
    if (path === '/yurservice') return 'ЮрСервисы'

    return null
  }

  const canGoBack = () => {
    return window.history.length > 1
  }

  const handleBack = () => {
    if (canGoBack()) {
      navigate(-1)
    }
  }

  const pageTitle = getPageTitle()

  if (!pageTitle) {
    return null
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        {canGoBack() && (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 mr-2"
            onClick={handleBack}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Вернуться</span>
          </Button>
        )}
        <h1 className="text-lg font-semibold text-foreground truncate flex-1">
          {pageTitle}
        </h1>
      </div>
    </header>
  )
}