// Reusable year selector component with configurable year range
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateYears } from "@/lib/date-utils";

interface YearSelectorProps {
  value: string;
  onChange: (value: string) => void;
  startYear?: number;
  disabled?: boolean;
  optional?: boolean;
  label?: string;
  labelClassName?: string;
  id?: string;
  placeholder?: string;
}

export function YearSelector({
  value,
  onChange,
  startYear = 1930,
  disabled = false,
  optional = true,
  label = "Год",
  labelClassName = "text-xs text-muted-foreground",
  id = "year",
  placeholder = "Year",
}: YearSelectorProps) {
  const years = generateYears(startYear);

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
          {years.map((year) => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
