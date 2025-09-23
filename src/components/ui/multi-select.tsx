
'use client';

import * as React from 'react';
import { ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from './scroll-area';
import { Input } from './input';

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
  onBlur?: () => void;
  className?: string;
  placeholder?: string;
  allOption?: string;
  enableSearch?: boolean;
  searchPlaceholder?: string;
  searchThreshold?: number;
}

export function MultiSelect({
  options,
  selectedValues,
  onChange,
  onBlur,
  className,
  placeholder = 'Select...',
  allOption,
  enableSearch = false,
  searchPlaceholder = 'Search...',
  searchThreshold = 0,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const handleToggle = (value: string) => {
    let newSelectedValues: string[];

    if (value === allOption) {
      if (selectedValues.includes(allOption)) {
        newSelectedValues = []; // Deselect "All"
      } else {
        newSelectedValues = [allOption]; // Select only "All"
      }
    } else {
      let currentValues = [...selectedValues];
      
      // Remove "All" option if it's present
      const allIndex = allOption ? currentValues.indexOf(allOption) : -1;
      if (allIndex > -1) {
        currentValues.splice(allIndex, 1);
      }
      
      const valueIndex = currentValues.indexOf(value);
      if (valueIndex > -1) {
        currentValues.splice(valueIndex, 1);
      } else {
        currentValues.push(value);
      }
      newSelectedValues = currentValues;
    }

    onChange(newSelectedValues);
  };

  const getDisplayValue = () => {
    if (selectedValues.length === 0) return placeholder;
    if (allOption && selectedValues.includes(allOption)) return allOption;

    if (selectedValues.length === 1) {
      return options.find((o) => o.value === selectedValues[0])?.label ?? placeholder;
    }

    if (selectedValues.length > 1) {
      return `${selectedValues.length} selected`;
    }
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between font-normal', className)}
          onClick={() => setOpen(!open)}
          onBlur={onBlur}
        >
          <span className="truncate">{getDisplayValue()}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
        {enableSearch && options.length > (searchThreshold || 0) && (
          <div className="p-2">
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
        )}
        <ScrollArea className="max-h-60">
          {filteredOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onSelect={(e) => e.preventDefault()}
              onClick={() => handleToggle(option.value)}
              className="flex items-center gap-2"
            >
              <Checkbox
                checked={selectedValues.includes(option.value)}
                aria-label={`Select ${option.label}`}
                className="h-4 w-4 pointer-events-none"
                tabIndex={-1}
              />
              <span>{option.label}</span>
            </DropdownMenuItem>
          ))}
          {filteredOptions.length === 0 && (
            <DropdownMenuItem disabled>No options found</DropdownMenuItem>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
