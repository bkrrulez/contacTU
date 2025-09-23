
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

    // Handle org change to ensure "All Organizations" is selected when empty
    const handleOrgChange = (newOrgs: string[]) => {
        if (newOrgs.length === 0) {
            onSelectedOrgsChange(['All Organizations']);
        } else if (newOrgs.length > 1 && newOrgs.includes('All Organizations')) {
            onSelectedOrgsChange(newOrgs.filter(org => org !== 'All Organizations'));
        } else {
            onSelectedOrgsChange(newOrgs);
        }
    };
    
    // Determine what to pass to the MultiSelect component
    const displayOrgs = selectedOrgs.length === 1 && selectedOrgs[0] === 'All Organizations' ? [] : selectedOrgs;

    return (
        <div className="flex gap-2">
            <MultiSelect
                options={nameOptions}
                selected={selectedNames}
                onChange={onSelectedNamesChange}
                placeholder="Filter by name..."
                className="w-48"
            />
            <MultiSelect
                options={orgOptions}
                selected={displayOrgs}
                onChange={handleOrgChange}
                placeholder="All Organizations"
                className="w-48"
            />
        </div>
    );
}
