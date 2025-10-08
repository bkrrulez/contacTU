
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';

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
}

export function MultiSelect({
  options,
  selectedValues,
  onChange,
  onBlur,
  className,
  placeholder = 'Select...',
  allOption,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleToggle = (value: string) => {
    let newSelectedValues: string[];

    if (value === allOption) {
      if (selectedValues.includes(allOption)) {
        newSelectedValues = [];
      } else {
        newSelectedValues = [allOption];
      }
    } else {
      let currentValues = selectedValues.filter(v => v !== allOption);
      
      const index = currentValues.indexOf(value);
      if (index > -1) {
        currentValues.splice(index, 1);
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn('w-full justify-between font-normal', className)}
            onBlur={onBlur}
            >
            <span className="truncate">{getDisplayValue()}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
            <Command>
                <CommandInput placeholder="Search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                    {allOption && (
                         <CommandItem
                            key={allOption}
                            value={allOption}
                            onSelect={() => handleToggle(allOption)}
                            >
                            <Check
                                className={cn(
                                'mr-2 h-4 w-4',
                                selectedValues.includes(allOption) ? 'opacity-100' : 'opacity-0'
                                )}
                            />
                            {allOption}
                        </CommandItem>
                    )}
                    {options.filter(opt => opt.value !== allOption).map((option) => (
                        <CommandItem
                            key={option.value}
                            value={option.label}
                            onSelect={() => handleToggle(option.value)}
                        >
                            <Check
                                className={cn(
                                'mr-2 h-4 w-4',
                                selectedValues.includes(option.value) ? 'opacity-100' : 'opacity-0'
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
