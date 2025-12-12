import { useState, useCallback, useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Building2, Globe, Loader2, ChevronsUpDown } from "lucide-react";
import { FPApi } from "@/lib/api";

export enum LocationTypeEnum {
  city = "city",
  country = "country",
}

export interface LocationItem {
  type: LocationTypeEnum;
  id: number;
  name: string;
  population?: number;
  code?: string;
}

interface LocationSelectorProps {
  type: "city" | "country";
  value: number | null;
  initialName?: string;
  onChange: (value: number, name: string, item: LocationItem) => void;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  minSearchLength?: number;
  showIcon?: boolean;
}

const ICONS = {
  city: Building2,
  country: Globe,
};

const DEFAULT_PLACEHOLDERS = {
  city: "Выбрать город",
  country: "Выбрать страну",
};

const DEFAULT_SEARCH_PLACEHOLDERS = {
  city: "Введите название города...",
  country: "Введите название страны...",
};

export function LocationSelector({
  type,
  value,
  initialName,
  onChange,
  label,
  placeholder,
  searchPlaceholder,
  error,
  disabled = false,
  className = "",
  minSearchLength = 2,
  showIcon = true,
}: LocationSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<LocationItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [displayValue, setDisplayValue] = useState<string>("");

  const Icon = ICONS[type];
  const finalPlaceholder = placeholder || DEFAULT_PLACEHOLDERS[type];
  const finalSearchPlaceholder =
    searchPlaceholder || DEFAULT_SEARCH_PLACEHOLDERS[type];

  const fetchLocations = useCallback(
    async (query: string) => {
      if (query.length < minSearchLength) {
        setResults([]);
        return;
      }

      setIsSearching(true);

      try {
        const response = await FPApi.axios.get<{
          items: { id: number; name: string }[];
        }>("/location/search", {
          params: {
            locationType: type,
            searchQuery: query,
          },
        });

        if (response.data && response.data.items) {
          const items = response.data.items.map((item) => ({
            ...item,
            type: type as LocationTypeEnum,
          }));
          setResults(items);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error(`Error searching ${type}:`, error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [type, minSearchLength]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        fetchLocations(searchQuery);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchLocations]);

  useEffect(() => {
    if (value) {
      if (initialName) {
        setDisplayValue(initialName);
      }
    } else {
      setDisplayValue("");
    }
  }, [value, initialName]);

  const handleSelect = (item: LocationItem) => {
    onChange(item.id, item.name, item);
    setDisplayValue(item.name);
    setSearchQuery("");
    setResults([]);
    setOpen(false);
  };

  return (
    <div className={className}>
      {label && <Label>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`w-full justify-between ${
              error ? "border-destructive" : ""
            }`}
            disabled={disabled}
          >
            <div className="flex items-center gap-2 truncate">
              {showIcon && <Icon className="w-4 h-4 flex-shrink-0" />}
              <span className="truncate">
                {displayValue || finalPlaceholder}
              </span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={finalSearchPlaceholder}
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              {isSearching && (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              )}
              {!isSearching && searchQuery.length < minSearchLength && (
                <CommandEmpty></CommandEmpty>
              )}
              {!isSearching &&
                searchQuery.length >= minSearchLength &&
                results.length === 0 && (
                  <CommandEmpty>Ничего не найдено</CommandEmpty>
                )}
              {!isSearching && results.length > 0 && (
                <CommandGroup>
                  {results.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.name}
                      onSelect={() => handleSelect(item)}
                    >
                      {showIcon && <Icon className="w-4 h-4 mr-2" />}
                      <span>{item.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
