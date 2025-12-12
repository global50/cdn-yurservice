import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown } from "lucide-react"

interface SortableListControlsProps {
  index: number
  totalItems: number
  onMoveUp: () => void
  onMoveDown: () => void
  className?: string
}

export function SortableListControls({
  index,
  totalItems,
  onMoveUp,
  onMoveDown,
  className = ""
}: SortableListControlsProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Button
        size="sm"
        variant="ghost"
        onClick={onMoveUp}
        disabled={index === 0}
        className="h-7 w-7 p-0"
      >
        <ChevronUp className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={onMoveDown}
        disabled={index === totalItems - 1}
        className="h-7 w-7 p-0"
      >
        <ChevronDown className="w-4 h-4" />
      </Button>
    </div>
  )
}
