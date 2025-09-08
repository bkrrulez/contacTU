
'use client';

import * as React from 'react';
import { Check, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

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
      onChange(selected.includes('all') ? [] : ['all']);
      return;
    }
    
    let newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];

    newSelected = newSelected.filter(item => item !== 'all');

    if (newSelected.length === 0 && options.length > 0) {
        onChange(['all']);
    } else {
        onChange(newSelected);
    }
  };
  
  const getSelectedValues = () => {
    if (selected.includes('all')) {
        const allOption = options.find(opt => opt.value === 'all');
        return allOption ? [allOption] : [];
    }
    return options.filter(opt => selected.includes(opt.value));
  }

  const handleUnselect = (e: React.MouseEvent, value: string) => {
    e.preventDefault();
    e.stopPropagation();
    const newSelected = selected.filter((s) => s !== value);
    if(newSelected.length === 0) {
      onChange(['all']);
    } else {
      onChange(newSelected);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild disabled={props.disabled}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', selected.length > 1 ? 'h-full' : 'h-10', className)}
          onClick={() => setOpen(!open)}
        >
          <div className="flex gap-1 flex-wrap items-center">
            {selected.length === 0 ? (
                <span className="text-muted-foreground font-normal">{placeholder}</span>
            ) : getSelectedValues().length > 3 && !selected.includes('all') ? (
                <Badge variant="secondary" className="font-normal">{getSelectedValues().length} selected</Badge>
            ) : (
                getSelectedValues().map(option => (
                    <Badge
                        variant="secondary"
                        key={option.value}
                        className="font-normal"
                    >
                        {option.label}
                        <span
                            role="button"
                            aria-label={`Remove ${option.label}`}
                            className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            onClick={(e) => handleUnselect(e, option.value)}
                        >
                          <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        </span>
                    </Badge>
                ))
            )}
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Search ..." />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className="cursor-pointer"
                >
                  <Check className={cn('mr-2 h-4 w-4', selected.includes(option.value) ? 'opacity-100' : 'opacity-0')} />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
