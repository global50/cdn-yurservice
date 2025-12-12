/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useMemo } from "react";
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

interface DatabaseDropdownProps {
  table: string;
  valueColumn: string;
  labelColumn: string;
  value: string | number;
  onChange: (value: string, label: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  label?: string;
  labelClassName?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  orderBy?: string;
}

interface DataItem {
  [key: string]: any;
}

export function DatabaseDropdown({
  table,
  valueColumn,
  labelColumn,
  value,
  onChange,
  placeholder = "Выбрать...",
  searchPlaceholder = "Поиск...",
  label,
  labelClassName = "",
  disabled = false,
  className = "",
  id,
  orderBy,
}: DatabaseDropdownProps) {
  const [data, setData] = useState<DataItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from(table)
          .select(`${valueColumn}, ${labelColumn}`);

        if (orderBy) {
          query = query.order(orderBy, { ascending: true });
        }

        const { data: fetchedData, error } = await query;

        if (error) {
          console.error(`Error fetching ${table}:`, error);
        } else {
          setData(fetchedData || []);
        }
      } catch (error) {
        console.error(`Error fetching ${table}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [table, valueColumn, labelColumn, orderBy]);

  const getFilteredData = useCallback(
    (searchInput: string) => {
      if (!searchInput) return data;
      return data.filter((item) =>
        item[labelColumn]?.toLowerCase().includes(searchInput.toLowerCase())
      );
    },
    [data, labelColumn]
  );

  const displayValue = useMemo(
    () =>
      data.find((item) => item[valueColumn] === value)?.[labelColumn] ||
      value ||
      placeholder,
    [data, labelColumn, placeholder, value, valueColumn]
  );

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
          <Command>
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchInput}
              onValueChange={setSearchInput}
            />
            <CommandList>
              {isLoading && (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              )}
              {!isLoading && getFilteredData(searchInput).length === 0 && (
                <CommandEmpty>Не найдено</CommandEmpty>
              )}
              {!isLoading && getFilteredData(searchInput).length > 0 && (
                <CommandGroup>
                  {getFilteredData(searchInput).map((item) => (
                    <CommandItem
                      key={item[valueColumn]}
                      value={item[labelColumn]}
                      onSelect={() => {
                        onChange(item[valueColumn], item[labelColumn]);
                        setSearchInput("");
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
