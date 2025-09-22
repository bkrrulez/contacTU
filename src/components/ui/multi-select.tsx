
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
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
    // If "All Organizations" is clicked
    if (value === 'All Organizations') {
      if (selected.includes('All Organizations')) {
        // If it's already selected, deselect it.
        onChange([]);
      } else {
        // Otherwise, select only "All Organizations".
        onChange(['All Organizations']);
      }
      return;
    }

    // If any other option is clicked
    let newSelection = [...selected];

    // Remove "All Organizations" if it's present
    if (newSelection.includes('All Organizations')) {
        newSelection = [];
    }

    if (newSelection.includes(value)) {
      // Deselect the option
      newSelection = newSelection.filter((item) => item !== value);
    } else {
      // Select the option
      newSelection.push(value);
    }
    onChange(newSelection);
  };
  
  const displayValue = React.useMemo(() => {
    if (selected.includes('All Organizations')) {
      return 'All Organizations';
    }
    if (selected.length > 2) {
      return `${selected.length} selected`;
    }
    if (selected.length > 0) {
      return selected
        .map((val) => options.find((opt) => opt.value === val)?.label)
        .join(', ');
    }
    return placeholder;
  }, [selected, options, placeholder]);


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
          <CommandList>
            <CommandEmpty>No organization found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    handleToggle(option.value);
                  }}
                  className="cursor-pointer"
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
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
