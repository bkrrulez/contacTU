
"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "./scroll-area"
import { Checkbox } from "./checkbox"

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
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleToggle = (value: string) => {
    let newSelectedValues: string[]

    if (allOption && value === allOption) {
      if (selectedValues.includes(allOption)) {
        // If "All" is already selected and we click it again, clear everything
        newSelectedValues = []
      } else {
        // If we select "All", it becomes the only selection
        newSelectedValues = [allOption]
      }
    } else {
      let currentValues = [...selectedValues]
      
      // If "All" is currently selected, clear it before adding the new value
      if (currentValues.includes(allOption!)) {
        currentValues = []
      }

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

  const showClearButton = selectedValues.length > 0;

  return (
    <div className="relative">
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
              className="h-4 w-4 shrink-0 opacity-50 mr-2 cursor-pointer"
              onClick={handleClear}
            />
          )}
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </div>
      </Button>

      {open && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-full rounded-md border bg-background shadow-lg"
          style={{ width: triggerRef.current?.offsetWidth }}
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
                      onClick={(e) => e.stopPropagation()}
                      onCheckedChange={() => handleToggle(option.value)}
                      className="mr-2"
                    />
                    <label
                      htmlFor={`multi-select-${option.value}`}
                      className="w-full cursor-pointer text-sm"
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
        </div>
      )}
    </div>
  )
}
