
'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { CheckIcon, XCircle, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';

interface MultiSelectProps {
  options: { label: string; value: string; icon?: React.ComponentType<{ className?: string }> }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const MultiSelect = ({ options, selected, onChange, className, placeholder = 'Select...', ...props }: MultiSelectProps) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (value: string) => {
    if (value === 'all') {
      if (selected.length === 1 && selected[0] === 'all') {
        // Do nothing if 'all' is already the only thing selected
        return;
      }
      onChange(['all']);
      return;
    }
    
    let newSelection = [...selected];

    // If 'all' is currently selected, clear it and start a new selection.
    if (newSelection.includes('all')) {
        newSelection = [];
    }

    if (newSelection.includes(value)) {
      // If the item is already selected, remove it.
      newSelection = newSelection.filter((item) => item !== value);
    } else {
      // Otherwise, add the new item.
      newSelection.push(value);
    }

    // If the selection becomes empty, default back to 'all'.
    if (newSelection.length === 0) {
      onChange(['all']);
    } else {
      onChange(newSelection);
    }
  };

  const handleUnselect = (item: string) => {
    handleSelect(item);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild disabled={props.disabled}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between ${selected.length > 0 ? 'h-full' : 'h-10'}`}
          onClick={() => setOpen(!open)}
        >
          <div className="flex gap-1 flex-wrap">
            {selected.length > 0 && selected[0] !== 'all' ? (
              options
                .filter((option) => selected.includes(option.value))
                .map((option) => (
                  <Badge
                    variant="secondary"
                    key={option.value}
                    className="mr-1 mb-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleUnselect(option.value);
                    }}
                  >
                    {option.label}
                    <span
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      <XCircle className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </span>
                  </Badge>
                ))
            ) : (
              options.find(opt => opt.value === 'all')?.label || placeholder
            )}
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className={className}>
          <CommandInput placeholder="Search ..." />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selected.includes(option.value)
                return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        handleSelect(option.value);
                        setOpen(true);
                      }}
                    >
                      <CheckIcon className={cn('mr-2 h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')} />
                      {option.label}
                    </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
