
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
      // If "All Organizations" is selected, deselect all others and select only "All".
      // If it's being deselected, clear the selection.
      onChange(selected.includes('All Organizations') ? [] : ['All Organizations']);
    } else {
      // If another option is selected
      const newSelection = selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected.filter(item => item !== 'All Organizations'), value]; // Ensure "All" is removed
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
                >
                    {allOrganizationsOption.label}
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
            </>
        )}
        {otherOptions.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selected.includes(option.value)}
            onCheckedChange={() => handleToggle(option.value)}
            disabled={isAllSelected}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
