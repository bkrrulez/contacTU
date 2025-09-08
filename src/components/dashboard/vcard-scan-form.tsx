
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { extractContactFromImage, ExtractedContactSchema } from '@/ai/flows/extract-contact-flow';
import { z } from 'zod';

type ExtractedContact = z.infer<typeof ExtractedContactSchema>;

export function VCardScanForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [mode, setMode] = useState<'idle' | 'scan' | 'upload'>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode !== 'scan') {
      return;
    }

    let stream: MediaStream | null = null;
    const getCameraPermission = async () => {
      try {
        // First try to get the environment camera
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (e) {
          console.log('Could not get environment camera, trying default camera', e);
          // If that fails, try to get any camera
          try {
              stream = await navigator.mediaDevices.getUserMedia({ video: true });
              setHasCameraPermission(true);
              if (videoRef.current) {
                  videoRef.current.srcObject = stream;
              }
          } catch (error) {
              console.error('Error accessing camera:', error);
              setHasCameraPermission(false);
              toast({
                  variant: 'destructive',
                  title: 'Camera Access Denied',
                  description: 'Please enable camera permissions in your browser settings to use this feature.',
              });
              setMode('idle');
          }
      }
    };

    getCameraPermission();
    
    // Cleanup
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    }
  }, [mode, toast]);
  
  const processImageAndRedirect = async (imageDataUri: string) => {
    setIsLoading(true);
    try {
      const result = await extractContactFromImage({ photoDataUri: imageDataUri });
      if (result && result.contacts && result.contacts.length > 0) {
        // For simplicity, we redirect with the first contact found.
        // A more complex implementation could handle multiple contacts.
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
        console.error("Extraction error:", error);
        toast({
            variant: 'destructive',
            title: 'AI Error',
            description: 'An error occurred while processing the image.',
        });
    } finally {
        setIsLoading(false);
        setMode('idle');
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

  const renderIdleState = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Button variant="outline" size="lg" className="h-24" onClick={() => setMode('scan')}>
        <Camera className="mr-4 h-8 w-8" />
        <span className="text-lg">Scan vCard</span>
      </Button>
      <Button variant="outline" size="lg" className="h-24" onClick={() => fileInputRef.current?.click()}>
        <ImageIcon className="mr-4 h-8 w-8" />
        <span className="text-lg">Upload Images</span>
      </Button>
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
    </div>
  );
  
  const renderScanState = () => (
      <div className="space-y-4">
          {hasCameraPermission === false && (
              <Alert variant="destructive">
                  <AlertTitle>Camera Access Required</AlertTitle>
                  <AlertDescription>
                      Please allow camera access in your browser settings to use this feature.
                  </AlertDescription>
              </Alert>
          )}
          <video ref={videoRef} className="w-full aspect-video rounded-md bg-black" autoPlay muted playsInline />
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={handleCapture} disabled={isLoading || hasCameraPermission !== true}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
                Capture and Process
            </Button>
             <Button size="lg" variant="outline" onClick={() => setMode('idle')} disabled={isLoading}>Cancel</Button>
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
