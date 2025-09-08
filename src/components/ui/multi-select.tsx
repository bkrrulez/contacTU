
'use client';

import * as React from 'react';
import { Check, XCircle, ChevronDown } from 'lucide-react';
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
    let newSelected: string[];
    
    if (value === 'all') {
      newSelected = selected.length === options.length ? [] : options.map(o => o.value);
    } else {
      if (selected.includes(value)) {
        newSelected = selected.filter((item) => item !== value);
      } else {
        newSelected = [...selected, value];
      }
    }
    
    onChange(newSelected);
  };
  
  const getSelectedValues = () => {
    if (selected.length === options.length) return [{ value: 'all', label: 'All' }];
    return options.filter(opt => selected.includes(opt.value));
  }

  const handleUnselect = (value: string) => {
    onChange(selected.filter((s) => s !== value));
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
          <div className="flex gap-1 flex-wrap">
            {selected.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
            ) : getSelectedValues().length > 3 ? (
                <Badge variant="secondary">{getSelectedValues().length} selected</Badge>
            ) : (
                getSelectedValues().map(option => (
                    <Badge
                        variant="secondary"
                        key={option.value}
                        className="mr-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleUnselect(option.value);
                        }}
                    >
                        {option.label}
                        <span className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                          <XCircle className="h-3 w-3 text-muted-foreground hover:text-foreground" />
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
              <CommandItem onSelect={() => handleSelect('all')}>
                <Check className={cn('mr-2 h-4 w-4', selected.length === options.length ? 'opacity-100' : 'opacity-0')} />
                All
              </CommandItem>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
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
