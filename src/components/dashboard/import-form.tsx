
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, Download } from 'lucide-react';
import { getSampleFile } from '@/app/dashboard/import/actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export function ImportForm({ type }: { type: string }) {
    const { toast } = useToast();
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const result = await getSampleFile();
            if (result.file) {
                const byteCharacters = atob(result.file);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = result.fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error('Failed to download sample file', error);
            toast({
                variant: 'destructive',
                title: 'Download Failed',
                description: 'Could not download the sample file. Please try again.',
            });
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Import {type} File</CardTitle>
                        <CardDescription>Upload a {type} file to import your contacts.</CardDescription>
                    </div>
                    <Button 
                        variant="link" 
                        className="p-0 h-auto"
                        onClick={handleDownload}
                        disabled={isDownloading}
                    >
                       {isDownloading ? (
                           'Downloading...'
                       ) : (
                           <>
                             <Download className="mr-2 h-4 w-4" />
                             Download Sample Format
                           </>
                       )}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-12 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">Drag and drop your file here, or click to browse.</p>
                    <Button variant="outline" className="mt-4">
                        Select File
                    </Button>
                </div>
                <div className="flex justify-end">
                    <Button disabled>Import Contacts</Button>
                </div>
            </CardContent>
        </Card>
    )
}
