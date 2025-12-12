import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface DropdownOption {
  value: string
  label: string
}

interface SimpleDropdownProps {
  value: string
  onChange: (value: string) => void
  options: DropdownOption[]
  placeholder?: string
  label?: string
  labelClassName?: string
  disabled?: boolean
  className?: string
  id?: string
}

export function SimpleDropdown({
  value,
  onChange,
  options,
  placeholder = "Выберите...",
  label,
  labelClassName = "",
  disabled = false,
  className = "",
  id
}: SimpleDropdownProps) {
  return (
    <div className={className}>
      {label && (
        <Label htmlFor={id} className={labelClassName}>
          {label}
        </Label>
      )}
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id={id}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
