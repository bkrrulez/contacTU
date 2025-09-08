
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState, useMemo } from 'react';
import { getExportData, exportContacts } from '@/app/dashboard/export/actions';
import { MultiSelect } from '@/components/ui/multi-select';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';

type OrgAndTeamData = {
    organizations: { name: string; teams: string[] }[];
}

export function ExportForm() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [data, setData] = useState<OrgAndTeamData>({ organizations: [] });
    
    const [fileType, setFileType] = useState<'xlsx' | 'csv'>('xlsx');
    const [selectedOrgs, setSelectedOrgs] = useState<string[]>([]);
    const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
    
    useEffect(() => {
        getExportData().then(result => {
            if(result) {
               setData(result);
               // By default, select "All Organizations"
               setSelectedOrgs(['all']);
            }
            setIsLoading(false);
        }).catch(err => {
            console.error(err);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to load organization data.'});
            setIsLoading(false);
        })
    }, [toast]);
    
    const availableTeams = useMemo(() => {
        if (selectedOrgs.includes('all')) {
            const allTeams = new Set<string>();
            data.organizations.forEach(org => {
                org.teams.forEach(team => allTeams.add(team));
            });
            return Array.from(allTeams);
        }
        
        const teams = new Set<string>();
        data.organizations
            .filter(org => selectedOrgs.includes(org.name))
            .forEach(org => {
                org.teams.forEach(team => teams.add(team));
            });
        return Array.from(teams);
    }, [selectedOrgs, data.organizations]);

    useEffect(() => {
        // Reset selected teams if they are no longer available in the new org selection
        setSelectedTeams(prevTeams => prevTeams.filter(team => availableTeams.includes(team) || team === 'all'));
    }, [availableTeams]);
    

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const result = await exportContacts({
                fileType,
                organizations: selectedOrgs,
                teams: selectedTeams,
            });

            if (result.file) {
                 const blob = new Blob([Buffer.from(result.file, 'base64')], { type: result.mimeType });
                 saveAs(blob, result.fileName);

                toast({
                    title: 'Export Successful',
                    description: 'Your contacts have been exported.',
                });
            } else {
                 toast({
                    variant: 'destructive',
                    title: 'Export Failed',
                    description: result.error || 'No data found for the selected criteria.',
                });
            }
        } catch (error) {
             toast({
                variant: 'destructive',
                title: 'Error',
                description: 'An unexpected error occurred during export.',
            });
        } finally {
            setIsExporting(false);
        }
    }

    const orgOptions = [
        { value: 'all', label: 'All Organizations' },
        ...data.organizations.map(org => ({ value: org.name, label: org.name }))
    ];

    const teamOptions = [
        { value: 'all', label: 'All Teams' },
        ...availableTeams.map(team => ({ value: team, label: team }))
    ];

    const handleOrgChange = (newSelection: string[]) => {
        // If 'all' is selected, it should be the only selection.
        if (newSelection.includes('all') && !selectedOrgs.includes('all')) {
            setSelectedOrgs(['all']);
        // If a specific org is selected, 'all' should be deselected.
        } else if (newSelection.length > 1 && newSelection.includes('all')) {
            setSelectedOrgs(newSelection.filter(item => item !== 'all'));
        } else {
            setSelectedOrgs(newSelection);
        }
    };
    
    const handleTeamChange = (newSelection: string[]) => {
       // If 'all' is selected, it should be the only selection.
        if (newSelection.includes('all') && !selectedTeams.includes('all')) {
            setSelectedTeams(['all']);
        // If a specific team is selected, 'all' should be deselected.
        } else if (newSelection.length > 1 && newSelection.includes('all')) {
            setSelectedTeams(newSelection.filter(item => item !== 'all'));
        } else {
            setSelectedTeams(newSelection);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Export Options</CardTitle>
                <CardDescription>Select filters to export a specific set of contacts.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <div className="grid md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">File Type</label>
                        <Select value={fileType} onValueChange={(v) => setFileType(v as 'xlsx' | 'csv')}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select file type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                                <SelectItem value="csv">CSV (.csv)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-2 block">Organization</label>
                        <MultiSelect
                            options={orgOptions}
                            selected={selectedOrgs}
                            onChange={handleOrgChange}
                            className="w-full"
                            placeholder="Select organizations..."
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-2 block">Team</label>
                        <MultiSelect
                            options={teamOptions}
                            selected={selectedTeams}
                            onChange={handleTeamChange}
                            className="w-full"
                            placeholder="Select teams..."
                            disabled={isLoading || availableTeams.length === 0}
                        />
                    </div>
                </div>

            </CardContent>
            <CardFooter>
                 <Button onClick={handleExport} disabled={isExporting || isLoading}>
                    {isExporting ? (
                        <>
                            <Download className="mr-2 h-4 w-4 animate-pulse" />
                            Exporting...
                        </>
                    ) : (
                        <>
                           <Download className="mr-2 h-4 w-4" />
                           Export Contacts
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}
