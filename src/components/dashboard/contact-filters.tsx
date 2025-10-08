
'use client';

import * as React from 'react';
import { MultiSelect } from '@/components/ui/multi-select';

interface ContactFiltersProps {
    contactNames: string[];
    organizationNames: string[];
    selectedNames: string[];
    onSelectedNamesChange: (names: string[]) => void;
    nameFilter: string;
    onNameFilterChange: (filter: string) => void;
    onClearNameFilter: () => void;
    selectedOrgs: string[];
    onSelectedOrgsChange: (orgs: string[]) => void;
}

export function ContactFilters({
    contactNames,
    organizationNames,
    selectedNames,
    onSelectedNamesChange,
    nameFilter,
    onNameFilterChange,
    onClearNameFilter,
    selectedOrgs,
    onSelectedOrgsChange,
}: ContactFiltersProps) {

    const nameOptions = contactNames.map(name => ({ value: name, label: name }));
    const orgOptions = organizationNames.map(name => ({ value: name, label: name }));

    return (
        <div className="flex gap-2">
            <MultiSelect
                options={nameOptions}
                selectedValues={selectedNames}
                onChange={onSelectedNamesChange}
                inputValue={nameFilter}
                onInputChange={onNameFilterChange}
                onClear={onClearNameFilter}
                placeholder="Filter by name..."
                className="w-48"
            />
            <MultiSelect
                options={orgOptions}
                selectedValues={selectedOrgs}
                onChange={onSelectedOrgsChange}
                placeholder="Filter by organization..."
                className="w-48"
                allOption="All Organizations"
            />
        </div>
    );
}
