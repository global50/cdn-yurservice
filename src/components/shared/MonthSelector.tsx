// Reusable month selector component with localized month names
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MONTHS } from "@/lib/date-utils";

interface MonthSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  optional?: boolean;
  label?: string;
  labelClassName?: string;
  id?: string;
  placeholder?: string;
}

export function MonthSelector({
  value,
  onChange,
  disabled = false,
  optional = true,
  label = "Месяц",
  labelClassName = "text-xs text-muted-foreground",
  id = "month",
  placeholder = "Month",
}: MonthSelectorProps) {
  return (
    <div>
      {label && (
        <Label htmlFor={id} className={labelClassName}>
          {label}
          {optional && " (по желанию)"}
        </Label>
      )}
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id={id}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {optional && <SelectItem value="not-set">-</SelectItem>}
          {MONTHS.map((month) => (
            <SelectItem key={month.value} value={month.value}>
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
