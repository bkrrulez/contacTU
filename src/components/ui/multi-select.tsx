
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
import { Input } from './input';
import { ScrollArea } from './scroll-area';

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
      // If "All" is clicked, it becomes the only selection. 
      // If it's already selected, deselect it.
      if (selectedValues.includes(allOption)) {
          newSelectedValues = [];
      } else {
          newSelectedValues = [allOption];
      }
    } else {
        // If any other option is clicked...
        // 1. Remove "All" from the current selections, if it's there
        let currentValues = selectedValues.filter(v => v !== allOption);
        
        // 2. Toggle the clicked value
        const index = currentValues.indexOf(value);
        if (index > -1) {
            currentValues.splice(index, 1); // remove
        } else {
            currentValues.push(value); // add
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
      <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] p-0">
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
        <ScrollArea className="max-h-60 w-full">
          <div className="p-2 pt-0">
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
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
