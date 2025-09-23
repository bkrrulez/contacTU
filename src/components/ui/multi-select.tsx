
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
}

export function MultiSelect({
  options,
  selectedValues,
  onChange,
  onBlur,
  className,
  placeholder = "Select...",
  allOption,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleToggle = (value: string) => {
    let newSelectedValues: string[]

    if (allOption && value === allOption) {
      if (selectedValues.includes(allOption)) {
        newSelectedValues = []
      } else {
        newSelectedValues = [allOption]
      }
    } else {
      let currentValues = [...selectedValues].filter((v) => v !== allOption)

      if (currentValues.includes(value)) {
        newSelectedValues = currentValues.filter((item) => item !== value)
      } else {
        newSelectedValues = [...currentValues, value]
      }
    }
    onChange(newSelectedValues)
  }

  const getDisplayValue = () => {
    if (selectedValues.length === 0) return placeholder
    if (allOption && selectedValues.includes(allOption)) return allOption

    if (selectedValues.length <= 2) {
      return selectedValues
        .map(
          (value) => options.find((option) => option.value === value)?.label
        )
        .join(", ")
    }
    return `${selectedValues.length} selected`
  }

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
      <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-60 overflow-y-auto">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={(e) => e.preventDefault()} // Prevent closing on select
            onClick={() => handleToggle(option.value)}
            className="flex items-center gap-2"
          >
            <Checkbox
              checked={selectedValues.includes(option.value)}
              aria-label={`Select ${option.label}`}
              className="h-4 w-4"
            />
            <span>{option.label}</span>
          </DropdownMenuItem>
        ))}
        {options.length === 0 && (
          <DropdownMenuItem disabled>No options available</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
