
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronsUpDown, Check, X } from 'lucide-react';

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
    // This is the special logic for the organization filter on the contacts page
    const isOrgFilter = placeholder === 'Filter by organization...';

    if (isOrgFilter) {
      if (value === 'All Organizations') {
        // If "All Organizations" is clicked, it becomes the only selected item.
        onChange(['All Organizations']);
      } else {
        // Remove "All Organizations" if another item is selected
        const newSelection = selected.filter(item => item !== 'All Organizations');
        
        if (newSelection.includes(value)) {
           // If the item is already selected, remove it. If it becomes empty, default back to "All Organizations"
          const finalSelection = newSelection.filter((item) => item !== value);
          onChange(finalSelection.length > 0 ? finalSelection : ['All Organizations']);
        } else {
          // Add the new item
          onChange([...newSelection, value]);
        }
      }
    } else {
      // Original behavior for all other multi-selects
      onChange(
        selected.includes(value)
          ? selected.filter((item) => item !== value)
          : [...selected, value]
      );
    }
  };
  
  const displayValue = React.useMemo(() => {
    if (selected.length === 0 || (selected.length === 1 && selected[0] === 'All Organizations' && placeholder === 'Filter by organization...')) {
      return placeholder;
    }
     if (selected.length === 1) {
      return options.find((opt) => opt.value === selected[0])?.label ?? placeholder;
    }
    if (selected.length > 2) {
      return `${selected.length} selected`;
    }
    return selected
      .map((val) => options.find((opt) => opt.value === val)?.label)
      .join(', ');
  }, [selected, options, placeholder]);

  const filteredOptions = React.useMemo(() => {
    // For the name filter on the contacts page, require typing before showing options.
    if (placeholder === 'Filter by name...' && inputValue.length < 3) {
      return [];
    }
    // For other filters or after typing, filter the options.
    return options.filter(option => 
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [inputValue, options, placeholder]);

  const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(placeholder === 'Filter by organization...' ? ['All Organizations'] : []);
  };


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
          <div className="flex items-center">
           {(selected.length > 0 && !(selected.length === 1 && selected[0] === 'All Organizations')) ? (
             <span onClick={handleClear} role="button" aria-label="Clear selection" className="ml-2">
                <X className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100" />
             </span>
           ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
           )}
          </div>
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
                {placeholder === 'Filter by name...' && inputValue.length < 3
                 ? 'Type 3+ characters to search'
                 : 'No results found.'}
            </CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
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
