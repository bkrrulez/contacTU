
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Loader2, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { extractContactFromImage } from '@/ai/flows/extract-contact-flow';
import { ExtractedContactSchema } from '@/lib/schemas';
import { z } from 'zod';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type ExtractedContact = z.infer<typeof ExtractedContactSchema>;

export function VCardScanForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [mode, setMode] = useState<'idle' | 'scan'>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        // We will show an inline alert instead of a toast
      }
    };

    if (mode === 'scan') {
        getCameraPermission();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);


  const processImageAndRedirect = async (imageDataUri: string) => {
    setIsLoading(true);
    try {
      const result = await extractContactFromImage({ photoDataUri: imageDataUri });
      if (result && result.contacts && result.contacts.length > 0) {
        // For simplicity, we redirect with the first contact found.
        const contact = result.contacts[0];
        const query = new URLSearchParams({
            data: JSON.stringify(contact)
        }).toString();
        router.push(`/dashboard/contacts/new?${query}`);
      } else {
        toast({
            variant: 'destructive',
            title: 'Extraction Failed',
            description: 'Could not extract contact information from the image. Please try a clearer picture.',
        });
      }
    } catch (error) {
        console.error("AI Extraction Error (Client-side):", error);
        toast({
            variant: 'destructive',
            title: 'AI Error',
            description: 'An error occurred while processing the image. Check the server logs for details.',
        });
    } finally {
        setIsLoading(false);
        setMode('idle');
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  };

  const handleCapture = () => {
    if (videoRef.current) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const dataUri = canvas.toDataURL('image/jpeg');
            processImageAndRedirect(dataUri);
        }
    }
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
              const dataUri = e.target?.result as string;
              if(dataUri) {
                  processImageAndRedirect(dataUri);
              }
          };
          reader.readAsDataURL(file);
      }
  };

  const handleCancelScan = () => {
      setMode('idle');
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
  }

  const renderIdleState = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Button variant="outline" size="lg" className="h-24" onClick={() => setMode('scan')}>
        <Camera className="mr-4 h-8 w-8" />
        <span className="text-lg">Scan vCard</span>
      </Button>
      <Button variant="outline" size="lg" className="h-24" onClick={() => fileInputRef.current?.click()}>
        <ImageIcon className="mr-4 h-8 w-8" />
        <span className="text-lg">Upload Image</span>
      </Button>
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
    </div>
  );
  
  const renderScanState = () => (
      <div className="space-y-4">
          <video ref={videoRef} className="w-full aspect-video rounded-md bg-black" autoPlay muted playsInline />
          { !hasCameraPermission && (
              <Alert variant="destructive">
                  <AlertTitle>Camera Access Denied</AlertTitle>
                  <AlertDescription>
                    Please enable camera permissions in your browser settings to use this feature.
                  </AlertDescription>
              </Alert>
          )}
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={handleCapture} disabled={isLoading || !hasCameraPermission}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
                Capture and Process
            </Button>
             <Button size="lg" variant="outline" onClick={handleCancelScan} disabled={isLoading}>Cancel</Button>
          </div>
      </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scan or Upload a Business Card</CardTitle>
        <CardDescription>Use your camera to scan a card or upload an image file. The AI will extract the details for you.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
            <div className="flex flex-col items-center justify-center space-y-4 p-8">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p className="text-lg text-muted-foreground">AI is reading the card, please wait...</p>
            </div>
        )}
        {!isLoading && mode === 'idle' && renderIdleState()}
        {!isLoading && mode === 'scan' && renderScanState()}
      </CardContent>
    </Card>
  );
}
