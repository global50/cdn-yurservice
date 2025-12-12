import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

interface InlineEditActionsProps {
  onSave: () => void
  onCancel: () => void
  saveDisabled?: boolean
  className?: string
}

export function InlineEditActions({
  onSave,
  onCancel,
  saveDisabled = false,
  className = ""
}: InlineEditActionsProps) {
  return (
    <div className={`flex gap-1 ${className}`}>
      <Button
        size="sm"
        variant="ghost"
        onClick={onSave}
        disabled={saveDisabled}
        className="h-7 w-7 p-0 text-green-600 hover:text-green-700"
      >
        <Check className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={onCancel}
        className="h-7 w-7 p-0"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  )
}
