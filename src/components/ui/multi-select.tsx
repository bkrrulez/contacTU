
"use client"

import * as React from "react"
import { ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "./scroll-area"
import { Input } from "./input"

export interface MultiSelectOption {
  value: string
  label: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  selectedValues: string[]
  onChange: (selected: string[]) => void
  onBlur?: () => void
  className?: string
  placeholder?: string
  allOption?: string
  enableSearch?: boolean
  searchPlaceholder?: string
  searchThreshold?: number
}

export function MultiSelect({
  options,
  selectedValues,
  onChange,
  onBlur,
  className,
  placeholder = "Select...",
  allOption,
  enableSearch = false,
  searchPlaceholder = 'Search...',
  searchThreshold = 0,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')

  const handleToggle = (value: string) => {
    let newSelectedValues: string[];

    if (allOption && value === allOption) {
      // If user clicks "All", it becomes the only selected item.
      newSelectedValues = [allOption];
    } else {
      let currentValues = [...selectedValues];

      // If "All" was selected, deselect it and start fresh with the new selection.
      if (allOption && currentValues.includes(allOption)) {
        currentValues = [];
      }

      if (currentValues.includes(value)) {
        // If the option is already selected, deselect it.
        newSelectedValues = currentValues.filter((item) => item !== value);
      } else {
        // If the option is not selected, select it.
        newSelectedValues = [...currentValues, value];
      }

      // If after toggling, the selection is empty and there's an allOption, maybe we should select all? For now, we leave it empty.
      if (newSelectedValues.length === 0 && allOption) {
        // default to allOption being selected if selection becomes empty
        // newSelectedValues = [allOption];
      }
    }
    onChange(newSelectedValues);
  }

  const getDisplayValue = () => {
    if (selectedValues.length === 0) return placeholder
    if (allOption && selectedValues.includes(allOption)) return allOption

    if (selectedValues.length === 1) {
       return options.find(o => o.value === selectedValues[0])?.label ?? placeholder;
    }
    
    if (selectedValues.length > 1) {
      return `${selectedValues.length} selected`
    }
  }
  
  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between font-normal", className)}
          onClick={() => setOpen(!open)}
          onBlur={onBlur}
        >
          <span className="truncate">{getDisplayValue()}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
        {enableSearch && options.length > (searchThreshold || 0) && (
            <div className="p-2">
                <Input 
                    placeholder={searchPlaceholder}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                />
            </div>
        )}
        <ScrollArea className="max-h-60">
        {filteredOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={(e) => e.preventDefault()}
            onClick={() => handleToggle(option.value)}
            className="flex items-center gap-2"
          >
            <Checkbox
              checked={selectedValues.includes(option.value)}
              aria-label={`Select ${option.label}`}
              className="h-4 w-4 pointer-events-none"
              tabIndex={-1}
            />
            <span>{option.label}</span>
          </DropdownMenuItem>
        ))}
        {filteredOptions.length === 0 && (
          <DropdownMenuItem disabled>No options found</DropdownMenuItem>
        )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
