
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronsUpDown, Check } from 'lucide-react';

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
  placeholder?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  className,
  placeholder = 'Select...',
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleToggle = (value: string) => {
    if (value === 'All Organizations') {
      if (selected.includes('All Organizations')) {
        // If 'All' is already selected, deselect it.
        onChange([]);
      } else {
        // If 'All' is not selected, select only 'All'.
        onChange(['All Organizations']);
      }
    } else {
      // If a specific option is clicked
      const newSelection = selected.includes(value)
        ? selected.filter((item) => item !== value) // Deselect if already selected
        : [...selected.filter(item => item !== 'All Organizations'), value]; // Select and remove 'All' if present
      onChange(newSelection);
    }
  };

  const displayValue =
    selected.length > 2
      ? `${selected.length} selected`
      : selected.length > 0
      ? selected.map((val) => options.find((opt) => opt.value === val)?.label).join(', ')
      : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
        >
          <span className="truncate">{displayValue}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search organizations..." />
          <CommandEmpty>No organization found.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => {
                  handleToggle(option.value);
                  // Do not close the popover on select
                  setOpen(true);
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleToggle(option.value);
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selected.includes(option.value) ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
