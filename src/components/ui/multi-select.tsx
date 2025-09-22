
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
    let newSelection = [...selected];

    if (value === 'All Organizations') {
      if (newSelection.includes('All Organizations')) {
        newSelection = [];
      } else {
        newSelection = ['All Organizations'];
      }
    } else {
      newSelection = newSelection.filter((item) => item !== 'All Organizations');
      if (newSelection.includes(value)) {
        newSelection = newSelection.filter((item) => item !== value);
      } else {
        newSelection.push(value);
      }
    }
    onChange(newSelection);
  };
  
  const displayValue = React.useMemo(() => {
    if (selected.length === 0) {
      return placeholder;
    }
    if (selected.includes('All Organizations')) {
      return 'All Organizations';
    }
    if (selected.length > 2) {
      return `${selected.length} selected`;
    }
    return selected
      .map((val) => options.find((opt) => opt.value === val)?.label)
      .join(', ');
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
                <div
                  key={option.value}
                  className="cursor-pointer"
                  onClick={() => handleToggle(option.value)}
                >
                  <CommandItem
                    value={option.label}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selected.includes(option.value) ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {option.label}
                  </CommandItem>
                </div>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
