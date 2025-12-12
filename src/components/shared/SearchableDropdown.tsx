/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
import { ChevronDownIcon, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface SearchableDropdownProps {
  table: string;
  searchColumns: string[];
  valueColumn: string;
  labelColumn: string;
  labelValue?: string;
  value: string | number;
  onChange: (value: string, label: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  label?: string;
  labelClassName?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  minSearchLength?: number;
  debounceMs?: number;
  limit?: number;
}

interface DataItem {
  [key: string]: any;
}

export function SearchableDropdown({
  table,
  searchColumns,
  valueColumn,
  labelColumn,
  labelValue,
  value,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Type at least 3 characters...",
  label,
  labelClassName = "",
  disabled = false,
  className = "",
  id,
  minSearchLength = 3,
  debounceMs = 500,
  limit = 50,
}: SearchableDropdownProps) {
  const [data, setData] = useState<DataItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.length >= minSearchLength) {
        setIsLoading(true);
        try {
          const searchConditions = searchColumns
            .map((col) => `${col}.ilike.%${searchQuery}%`)
            .join(",");

          const { data: fetchedData, error } = await supabase
            .from(table)
            .select(`${valueColumn}, ${labelColumn}`)
            .or(searchConditions)
            .limit(limit);

          if (error) {
            console.error(`Error searching ${table}:`, error);
            setData([]);
          } else {
            setData(fetchedData || []);
          }
        } catch (error) {
          console.error(`Error searching ${table}:`, error);
          setData([]);
        } finally {
          setIsLoading(false);
        }
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [
    searchQuery,
    table,
    searchColumns,
    valueColumn,
    labelColumn,
    minSearchLength,
    debounceMs,
    limit,
  ]);

  const displayValue =
    data.find((item) => item[valueColumn] === value)?.[labelColumn] ||
    labelValue ||
    value ||
    placeholder;

  return (
    <div className={className}>
      {label && (
        <Label htmlFor={id} className={labelClassName}>
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            {displayValue}
            <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              {isLoading && (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              )}
              {!isLoading && searchQuery.length < minSearchLength && (
                <CommandEmpty>
                  
                </CommandEmpty>
              )}
              {!isLoading &&
                searchQuery.length >= minSearchLength &&
                data.length === 0 && (
                  <CommandEmpty>No results found</CommandEmpty>
                )}
              {!isLoading && data.length > 0 && (
                <CommandGroup>
                  {data.map((item) => (
                    <CommandItem
                      key={item[valueColumn]}
                      value={item[labelColumn]}
                      onSelect={() => {
                        onChange(item[valueColumn], item[labelColumn]);
                        setSearchQuery("");
                        setOpen(false);
                      }}
                    >
                      {item[labelColumn]}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
