// Universal reference selector for cities, countries, regions, and universities with Russian language support
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
import {
  MapPin,
  Building2,
  Globe,
  GraduationCap,
  Loader2,
  ChevronsUpDown,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type ReferenceType = "city" | "country" | "region" | "university";

interface ReferenceItem {
  id: number;
  name: string;
}

interface UniversalReferenceSelectorProps {
  type: ReferenceType;
  value: string | number;
  onChange: (value: number, name: string, item: ReferenceItem) => void;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  minSearchLength?: number;
  showIcon?: boolean;
  limit?: number;
}

const ICONS = {
  city: Building2,
  country: Globe,
  region: MapPin,
  university: GraduationCap,
};

const DEFAULT_PLACEHOLDERS = {
  city: "Выбрать город",
  country: "Выбрать страну",
  region: "Выбрать регион",
  university: "Выбрать университет",
};

const DEFAULT_SEARCH_PLACEHOLDERS = {
  city: "Введите название...",
  country: "Введите название...",
  region: "Введите название...",
  university: "Введите название...",
};

export function UniversalReferenceSelector({
  type,
  value,
  onChange,
  label,
  placeholder,
  searchPlaceholder,
  error,
  disabled = false,
  className = "",
  minSearchLength = 2,
  showIcon = true,
  limit = 20,
}: UniversalReferenceSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<ReferenceItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [displayValue, setDisplayValue] = useState<string>("");

  const Icon = ICONS[type];
  const finalPlaceholder = placeholder || DEFAULT_PLACEHOLDERS[type];
  const finalSearchPlaceholder =
    searchPlaceholder || DEFAULT_SEARCH_PLACEHOLDERS[type];

  const fetchReferences = useCallback(
    async (query: string) => {
      if (query.length < minSearchLength) {
        setResults([]);
        return;
      }

      setIsSearching(true);

      try {
        const { data, error } = await supabase.rpc("search_reference", {
          p_type: type,
          p_search_query: query,
          p_limit: limit,
        });

        if (error) {
          console.error(`Error searching ${type}:`, error);
          setResults([]);
        } else {
          setResults(data || []);
        }
      } catch (error) {
        console.error(`Error searching ${type}:`, error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [type, minSearchLength, limit]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        fetchReferences(searchQuery);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchReferences]);

  useEffect(() => {
    if (value) {
      const fetchCurrentValue = async () => {
        try {
          const tableName = `list_${type}`;
          const { data, error } = await supabase
            .from(tableName)
            .select("id, name, name_ru")
            .eq("id", value)
            .maybeSingle();

          if (!error && data) {
            setDisplayValue(data.name_ru || data.name);
          }
        } catch (error) {
          console.error(`Error fetching current ${type}:`, error);
        }
      };

      if (typeof value === "number") {
        fetchCurrentValue();
      } else if (typeof value === "string" && value) {
        setDisplayValue(value);
      }
    } else {
      setDisplayValue("");
    }
  }, [value, type]);

  const handleSelect = (item: ReferenceItem) => {
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
