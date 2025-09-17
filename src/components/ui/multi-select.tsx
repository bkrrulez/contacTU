
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ChevronsUpDown } from 'lucide-react';

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
  disabled?: boolean;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  className,
  placeholder = 'Select...',
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const allOrganizationsOption = options.find(o => o.value === 'All Organizations');
  const otherOptions = options.filter(o => o.value !== 'All Organizations');

  const handleToggle = (value: string) => {
    if (disabled) return;

    if (value === 'All Organizations') {
      // If "All Organizations" is clicked, toggle it.
      // If it's being selected, it becomes the only selection.
      onChange(selected.includes('All Organizations') ? [] : ['All Organizations']);
    } else {
      // If an individual item is clicked
      let newSelection: string[];
      if (selected.includes('All Organizations')) {
        // If "All" was selected, start a new selection with just the clicked item
        newSelection = [value];
      } else {
        // Otherwise, toggle the item in the current selection
        newSelection = selected.includes(value)
          ? selected.filter((item) => item !== value)
          : [...selected, value];
      }
      onChange(newSelection);
    }
  };

  const isAllSelected = allOrganizationsOption ? selected.includes(allOrganizationsOption.value) : false;

  const displayValue =
    selected.length > 2
      ? `${selected.length} selected`
      : selected.length > 0
      ? selected.map((val) => options.find((opt) => opt.value === val)?.label).join(', ')
      : placeholder;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
          disabled={disabled}
        >
          <span className="truncate">{displayValue}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[--radix-popover-trigger-width]">
        {allOrganizationsOption && (
            <>
                <DropdownMenuCheckboxItem
                    checked={isAllSelected}
                    onCheckedChange={() => handleToggle(allOrganizationsOption.value)}
                    onSelect={(e) => e.preventDefault()}
                >
                    {allOrganizationsOption.label}
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
            </>
        )}
        {otherOptions.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={isAllSelected || selected.includes(option.value)}
            onCheckedChange={() => handleToggle(option.value)}
            onSelect={(e) => e.preventDefault()}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
