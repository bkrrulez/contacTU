
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronsUpDown, X } from 'lucide-react';

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
  enableSearch?: boolean;
  searchPlaceholder?: string;
  searchThreshold?: number;
  allOption?: string;
}

export function MultiSelect({
  options,
  selectedValues,
  onChange,
  className,
  placeholder = 'Select...',
  enableSearch = false,
  searchPlaceholder = 'Search...',
  searchThreshold = 0,
  allOption
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  const handleToggle = (value: string) => {
    let newSelection;
    if (allOption && value === allOption) {
      newSelection = selectedValues.includes(allOption) ? [] : [allOption];
    } else {
      const currentSelection = selectedValues.filter(v => v !== allOption);
      if (currentSelection.includes(value)) {
        newSelection = currentSelection.filter((item) => item !== value);
      } else {
        newSelection = [...currentSelection, value];
      }
    }
    onChange(newSelection);
  };


  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(allOption ? [allOption] : []);
    setIsOpen(false);
  };

  const displayValue = React.useMemo(() => {
    if (allOption && selectedValues.length > 0 && selectedValues.every(val => options.map(o => o.value).includes(val))) {
        if(selectedValues.includes(allOption) || selectedValues.length === options.filter(o => o.value !== allOption).length) {
            return allOption;
        }
    }
    if (selectedValues.length === 0) {
       return placeholder;
    }
    if (selectedValues.length === 1) {
      return options.find((opt) => opt.value === selectedValues[0])?.label ?? placeholder;
    }
    return `${selectedValues.length} selected`;
  }, [selectedValues, options, placeholder, allOption]);

  const filteredOptions = React.useMemo(() => {
     if (enableSearch && searchTerm.length < searchThreshold) {
      return allOption ? options : [];
    }
    return options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, options, enableSearch, searchThreshold, allOption]);
  
  const hasSelection = selectedValues.length > 0 && !(allOption && selectedValues.includes(allOption) && selectedValues.length === 1);


  return (
    <div className={cn('relative', className)} ref={wrapperRef}>
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={isOpen}
        className="w-full justify-between font-normal"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{displayValue}</span>
        <div className="flex items-center">
            {hasSelection && (
                <span onClick={handleClear} className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100 cursor-pointer">
                    <X className="h-4 w-4" />
                </span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </div>
      </Button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-lg">
          {enableSearch && (
            <div className="p-2">
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
           {enableSearch && searchTerm.length < searchThreshold && (
             <div className="p-2 text-sm text-muted-foreground text-center">
                {searchPlaceholder}
             </div>
           )}
          <div className="max-h-60 overflow-auto p-1">
            {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                    const isSelected = selectedValues.includes(option.value);
                    return (
                        <div
                            key={option.value}
                            className="flex cursor-pointer items-center rounded-sm p-2 text-sm outline-none hover:bg-accent"
                            onClick={() => handleToggle(option.value)}
                        >
                            <Checkbox
                                checked={isSelected}
                                className="mr-2"
                                readOnly
                                tabIndex={-1}
                            />
                            <span>{option.label}</span>
                        </div>
                    );
                })
            ) : (
                ( !enableSearch || searchTerm.length >= searchThreshold ) && <div className="p-2 text-center text-sm text-muted-foreground">No results found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
