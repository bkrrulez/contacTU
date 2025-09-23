
"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "./scroll-area"

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
  searchPlaceholder = "Search...",
  searchThreshold = 0,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  const handleToggle = (value: string) => {
    let newSelectedValues: string[]

    if (allOption && value === allOption) {
      // If "All" is clicked, either select all or clear all
      if (selectedValues.includes(allOption)) {
        newSelectedValues = []
      } else {
        newSelectedValues = [allOption] // Just select the "All" option
      }
    } else {
      let currentValues = selectedValues.filter((v) => v !== allOption)
      if (currentValues.includes(value)) {
        newSelectedValues = currentValues.filter((item) => item !== value)
      } else {
        newSelectedValues = [...currentValues, value]
      }
    }
    onChange(newSelectedValues)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange([])
  }

  const getDisplayValue = () => {
    if (selectedValues.length === 0) {
      return placeholder
    }
    if (allOption && selectedValues.length === 1 && selectedValues[0] === allOption) {
        return allOption
    }
    if (selectedValues.length === 1) {
      const selectedOption = options.find((option) => option.value === selectedValues[0])
      return selectedOption ? selectedOption.label : placeholder
    }
    return `${selectedValues.length} selected`
  }

  const filteredOptions = React.useMemo(() => {
    if (!enableSearch || search.length < searchThreshold) {
      return options
    }
    return options.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase())
    )
  }, [options, enableSearch, search, searchThreshold])

  const showClearButton = selectedValues.length > 0 && !(allOption && selectedValues.includes(allOption) && selectedValues.length === 1) && selectedValues.length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between font-normal relative", className)}
          onClick={() => setOpen(!open)}
          onBlur={onBlur}
        >
          <span className="truncate">{getDisplayValue()}</span>
           <div className="flex items-center">
            {showClearButton && (
                <X
                className="h-4 w-4 shrink-0 opacity-50 mr-2"
                onClick={handleClear}
                />
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0"
        style={{ width: triggerRef.current?.offsetWidth }}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {enableSearch && (
          <div className="p-2">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder={searchPlaceholder}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-8"
                />
            </div>
          </div>
        )}
        <ScrollArea className="max-h-60">
            <div className="p-1">
                {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                    <div
                    key={option.value}
                    className="flex items-center p-2 cursor-pointer hover:bg-accent rounded-md"
                    onClick={() => handleToggle(option.value)}
                    >
                    <Checkbox
                        id={`multi-select-${option.value}`}
                        checked={selectedValues.includes(option.value)}
                        className="mr-2"
                        onCheckedChange={() => handleToggle(option.value)}
                    />
                    <label
                        htmlFor={`multi-select-${option.value}`}
                        className="w-full cursor-pointer"
                    >
                        {option.label}
                    </label>
                    </div>
                ))
                ) : (
                <p className="p-2 text-center text-sm text-muted-foreground">
                    No results found.
                </p>
                )}
            </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
