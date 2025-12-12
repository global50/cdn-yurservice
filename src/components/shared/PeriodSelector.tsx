// Reusable period selector component using shared month/year selectors
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MonthSelector } from "./MonthSelector";
import { YearSelector } from "./YearSelector";

export interface PeriodData {
  start_month: string;
  start_year: string;
  end_month: string;
  end_year: string;
  is_current: boolean;
}

interface PeriodSelectorProps {
  value: PeriodData;
  onChange: (period: PeriodData) => void;
  currentLabel?: string;
  showCurrent?: boolean;
  startYearFrom?: number;
  className?: string;
}

export function PeriodSelector({
  value,
  onChange,
  currentLabel = "I currently work here",
  showCurrent = true,
  startYearFrom = 1930,
  className = "",
}: PeriodSelectorProps) {
  const handleChange = (
    field: keyof PeriodData,
    newValue: string | boolean
  ) => {
    onChange({ ...value, [field]: newValue });
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <Label>Period (Optional)</Label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <MonthSelector
          value={value.start_month}
          onChange={(val) => handleChange("start_month", val)}
          label="Месяц начала"
          id="start-month"
        />

        <YearSelector
          value={value.start_year}
          onChange={(val) => handleChange("start_year", val)}
          startYear={startYearFrom}
          label="Год начала"
          id="start-year"
        />

        <MonthSelector
          value={value.end_month}
          onChange={(val) => handleChange("end_month", val)}
          disabled={value.is_current}
          label="Месяц завершения"
          id="end-month"
        />

        <YearSelector
          value={value.end_year}
          onChange={(val) => handleChange("end_year", val)}
          startYear={startYearFrom}
          disabled={value.is_current}
          label="Год завершения"
          id="end-year"
        />
      </div>

      {showCurrent && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is-current"
            checked={value.is_current}
            onCheckedChange={(checked) =>
              handleChange("is_current", checked as boolean)
            }
          />
          <Label
            htmlFor="is-current"
            className="text-sm font-normal cursor-pointer"
          >
            {currentLabel}
          </Label>
        </div>
      )}
    </div>
  );
}
