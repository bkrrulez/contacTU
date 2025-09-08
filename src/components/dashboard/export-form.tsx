
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
    const [selectedOrgs, setSelectedOrgs] = useState<string[]>(['all']);
    const [selectedTeams, setSelectedTeams] = useState<string[]>(['all']);
    
    useEffect(() => {
        getExportData().then(result => {
            if(result) {
               setData(result);
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
            return Array.from(allTeams).sort();
        }
        
        const teams = new Set<string>();
        data.organizations
            .filter(org => selectedOrgs.includes(org.name))
            .forEach(org => {
                org.teams.forEach(team => teams.add(team));
            });
        return Array.from(teams).sort();
    }, [selectedOrgs, data.organizations]);
    
     useEffect(() => {
        const newSelectedTeams = selectedTeams.filter(team => team === 'all' || availableTeams.includes(team));
        if (JSON.stringify(newSelectedTeams) !== JSON.stringify(selectedTeams)) {
            setSelectedTeams(newSelectedTeams.length > 0 ? newSelectedTeams : ['all']);
        }
    }, [availableTeams, selectedTeams]);


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
                            onChange={setSelectedOrgs}
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
                            onChange={setSelectedTeams}
                            className="w-full"
                            placeholder="Select teams..."
                            disabled={isLoading || availableTeams.length === 0 || selectedOrgs.length === 0}
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
