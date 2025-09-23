
'use client';

import * as React from 'react';
import { MultiSelect } from '@/components/ui/multi-select';

interface ContactFiltersProps {
    contactNames: string[];
    organizationNames: string[];
    selectedNames: string[];
    onSelectedNamesChange: (names: string[]) => void;
    selectedOrgs: string[];
    onSelectedOrgsChange: (orgs: string[]) => void;
}

export function ContactFilters({
    contactNames,
    organizationNames,
    selectedNames,
    onSelectedNamesChange,
    selectedOrgs,
    onSelectedOrgsChange,
}: ContactFiltersProps) {

    const nameOptions = contactNames.map(name => ({ value: name, label: name }));
    const orgOptions = organizationNames.map(name => ({ value: name, label: name }));

    const handleOrgChange = (newOrgs: string[]) => {
        if (newOrgs.length > 1 && newOrgs.includes('All Organizations')) {
            onSelectedOrgsChange(newOrgs.filter(org => org !== 'All Organizations'));
        } else {
            onSelectedOrgsChange(newOrgs);
        }
    };
    
    return (
        <div className="flex gap-2">
            <MultiSelect
                options={nameOptions}
                selectedValues={selectedNames}
                onChange={onSelectedNamesChange}
                placeholder="Filter by name..."
                className="w-48"
                enableSearch={true}
                searchPlaceholder='Type 3+ characters...'
                searchThreshold={3}
            />
            <MultiSelect
                options={orgOptions}
                selectedValues={selectedOrgs}
                onChange={handleOrgChange}
                placeholder="Filter by organization..."
                className="w-48"
            />
        </div>
    );
}
