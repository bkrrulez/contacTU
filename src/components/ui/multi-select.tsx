
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
  const [inputValue, setInputValue] = React.useState('');

  const handleToggle = (value: string) => {
    onChange(
        selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value]
    );
    setInputValue('');
  };
  
  const displayValue = React.useMemo(() => {
    if (selected.length === 0) {
      return placeholder;
    }
    if (selected.length > 2) {
      return `${selected.length} selected`;
    }
    return selected
      .map((val) => options.find((opt) => opt.value === val)?.label)
      .join(', ');
  }, [selected, options, placeholder]);

  const filteredOptions = React.useMemo(() => {
    if (inputValue.length < 3) {
      if (placeholder === 'Filter by name...') return []; // Don't show any options for name filter until 3 chars are typed
      return options;
    }
    return options.filter(option => 
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [inputValue, options, placeholder]);


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
          <CommandInput 
            placeholder="Search..." 
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <CommandEmpty>
                {inputValue.length < 3 && placeholder === 'Filter by name...'
                 ? 'Type 3+ characters to search'
                 : 'No results found.'}
            </CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => handleToggle(option.value)}
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
