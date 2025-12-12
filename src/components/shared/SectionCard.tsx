import { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, LucideIcon } from "lucide-react"

interface SectionCardProps {
  title: string
  icon?: LucideIcon
  isEditing?: boolean
  onAddClick?: () => void
  showAddButton?: boolean
  children: ReactNode
  className?: string
}

export function SectionCard({
  title,
  icon: Icon,
  isEditing = false,
  onAddClick,
  showAddButton = true,
  children,
  className = ""
}: SectionCardProps) {
  return (
    <Card className={`hover:shadow-lg transition-shadow duration-300 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-5 h-5" />}
            {title}
          </div>
          {isEditing && showAddButton && onAddClick && (
            <Button
              size="sm"
              variant="outline"
              onClick={onAddClick}
            >
              <Plus className="w-4 h-4 mr-1" />
              Добавить
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}
