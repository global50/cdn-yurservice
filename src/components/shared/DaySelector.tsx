// Reusable day selector component with automatic day adjustment based on month and year
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateDays } from "@/lib/date-utils";

interface DaySelectorProps {
  value: string;
  onChange: (value: string) => void;
  month?: string;
  year?: string;
  disabled?: boolean;
  optional?: boolean;
  label?: string;
  labelClassName?: string;
  id?: string;
  placeholder?: string;
}

export function DaySelector({
  value,
  onChange,
  month = "01",
  year = "2000",
  disabled = false,
  optional = true,
  label = "День",
  labelClassName = "text-xs text-muted-foreground",
  id = "day",
  placeholder = "Day",
}: DaySelectorProps) {
  const effectiveMonth = month !== "not-set" ? month : "01";
  const effectiveYear = year !== "not-set" ? year : "2000";
  const days = generateDays(effectiveMonth, effectiveYear);

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
          {days.map((day) => (
            <SelectItem key={day} value={day}>
              {day}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
