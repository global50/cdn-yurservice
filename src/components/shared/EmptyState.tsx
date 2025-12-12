import { ReactNode } from "react"
import { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  message: string
  icon?: LucideIcon
  actionButton?: ReactNode
  className?: string
}

export function EmptyState({
  message,
  icon: Icon,
  actionButton,
  className = ""
}: EmptyStateProps) {
  return (
    <div className={`text-center py-8 ${className}`}>
      {Icon && (
        <div className="flex justify-center mb-3">
          <Icon className="w-12 h-12 text-muted-foreground/50" />
        </div>
      )}
      <p className="text-muted-foreground italic text-sm mb-4">{message}</p>
      {actionButton && <div>{actionButton}</div>}
    </div>
  )
}
