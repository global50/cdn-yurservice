export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="h-4 w-4 rounded bg-blue-500"></div>
            <span>Фонд Права</span>
            <span>•</span>
            <span>Деловая сеть для юридического сообщества</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2025
          </div>
        </div>
      </div>
    </footer>
  )
}