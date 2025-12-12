// Reusable character counter component for form inputs

interface CharacterCounterProps {
  current: number;
  max: number;
  className?: string;
}

export function CharacterCounter({ current, max, className = "" }: CharacterCounterProps) {
  const remaining = max - current;
  const isNearLimit = remaining < max * 0.2;
  const isOverLimit = current > max;

  return (
    <span
      className={`text-xs ${
        isOverLimit
          ? "text-destructive"
          : isNearLimit
          ? "text-warning"
          : "text-muted-foreground"
      } ${className}`}
    >
      {current} / {max}
    </span>
  );
}
