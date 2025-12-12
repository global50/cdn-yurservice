// Combined date selector component that orchestrates day, month, and year selection
import { Label } from "@/components/ui/label";
import { DaySelector } from "./DaySelector";
import { MonthSelector } from "./MonthSelector";
import { YearSelector } from "./YearSelector";
import { adjustDayForMonth } from "@/lib/date-utils";

export interface DateValue {
  day: string;
  month: string;
  year: string;
}

interface DateSelectorProps {
  value: DateValue;
  onChange: (date: DateValue) => void;
  startYear?: number;
  disabled?: boolean;
  optional?: boolean;
  label?: string;
  showLabels?: boolean;
  className?: string;
}

export function DateSelector({
  value,
  onChange,
  startYear = 1930,
  disabled = false,
  optional = true,
  label,
  showLabels = true,
  className = "",
}: DateSelectorProps) {
  const handleDayChange = (day: string) => {
    onChange({ ...value, day });
  };

  const handleMonthChange = (month: string) => {
    const adjustedDay = adjustDayForMonth(value.day, month, value.year);
    onChange({ ...value, month, day: adjustedDay });
  };

  const handleYearChange = (year: string) => {
    const adjustedDay = adjustDayForMonth(value.day, value.month, year);
    onChange({ ...value, year, day: adjustedDay });
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && <Label>{label}</Label>}
      <div className="grid grid-cols-3 gap-2">
        <DaySelector
          value={value.day}
          onChange={handleDayChange}
          month={value.month}
          year={value.year}
          disabled={disabled}
          optional={optional}
          label={showLabels ? "День" : undefined}
        />
        <MonthSelector
          value={value.month}
          onChange={handleMonthChange}
          disabled={disabled}
          optional={optional}
          label={showLabels ? "Месяц" : undefined}
        />
        <YearSelector
          value={value.year}
          onChange={handleYearChange}
          startYear={startYear}
          disabled={disabled}
          optional={optional}
          label={showLabels ? "Год" : undefined}
        />
      </div>
    </div>
  );
}
