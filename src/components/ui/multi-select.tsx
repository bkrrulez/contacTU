'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, XIcon } from 'lucide-react';

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
  className?: string;
  placeholder?: string;
  allOption?: string;
  inputValue?: string;
  onInputChange?: (value: string) => void;
}

export function MultiSelect({
  options,
  selectedValues,
  onChange,
  className,
  placeholder = 'Select...',
  allOption,
  inputValue = '',
  onInputChange,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [pointer, setPointer] = React.useState(-1);

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
    if (onInputChange) {
      onInputChange('');
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
    if (onInputChange) {
        onInputChange('');
    }
  };


  const getDisplayValue = () => {
    if (inputValue) return inputValue;
    if (selectedValues.length === 0) return placeholder;
    if (allOption && selectedValues.includes(allOption)) return allOption;

    if (selectedValues.length === 1) {
      return options.find((o) => o.value === selectedValues[0])?.label ?? placeholder;
    }

    if (selectedValues.length > 1) {
      return `${selectedValues.length} selected`;
    }
  };

  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!open) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setPointer(prev => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setPointer(prev => (prev > 0 ? prev - 1 : 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (pointer >= 0 && pointer < filteredOptions.length) {
        handleToggle(filteredOptions[pointer].value);
      }
    }
  };

  React.useEffect(() => {
    if (!open) {
      setPointer(-1);
    }
  }, [open]);

  const showClearButton = (selectedValues && selectedValues.length > 0) || (inputValue && inputValue.length > 0);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between font-normal', className)}
        >
          <span className="truncate">{getDisplayValue()}</span>
          <div className="flex items-center">
            {showClearButton && (
                <XIcon
                className="h-4 w-4 shrink-0 opacity-50 mr-2"
                onClick={handleClear}
                />
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command onKeyDown={handleKeyDown}>
          <CommandInput
            placeholder="Search..."
            value={inputValue}
            onValueChange={onInputChange}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {allOption && (
                <CommandItem
                  key={allOption}
                  value={allOption}
                  onSelect={() => handleToggle(allOption)}
                  data-highlighted={pointer === filteredOptions.findIndex(o => o.value === allOption)}
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
              {filteredOptions.map((option, index) => {
                if (option.value === allOption) return null;
                return (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => handleToggle(option.value)}
                    data-highlighted={pointer === index}
                    className={cn(pointer === index && "bg-accent")}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedValues.includes(option.value) ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
