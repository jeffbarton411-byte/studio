
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { runFirestoreTest, runEmailTest, runCloudinaryTest } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function DebugPage() {
  const [firestoreResult, setFirestoreResult] = useState<string | null>(null);
  const [isFirestoreLoading, setIsFirestoreLoading] = useState(false);
  
  const [emailResult, setEmailResult] = useState<string | null>(null);
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  const [cloudinaryResult, setCloudinaryResult] = useState<string | null>(null);
  const [isCloudinaryLoading, setIsCloudinaryLoading] = useState(false);

  const handleFirestoreTest = async () => {
    setIsFirestoreLoading(true);
    setFirestoreResult(null);
    const response = await runFirestoreTest();
    if (response.success) {
      setFirestoreResult(`Success! Document written with ID: ${response.id}`);
    } else {
      setFirestoreResult(`Error: ${response.error}`);
    }
    setIsFirestoreLoading(false);
  };
  
  const handleEmailTest = async () => {
    setIsEmailLoading(true);
    setEmailResult(null);
    const response = await runEmailTest();
    if (response.success) {
      setEmailResult(response.message!);
    } else {
      setEmailResult(`Error: ${response.error}`);
    }
    setIsEmailLoading(false);
  };

  const handleCloudinaryTest = async () => {
    setIsCloudinaryLoading(true);
    setCloudinaryResult(null);
    const response = await runCloudinaryTest();
    if (response.success) {
      setCloudinaryResult(response.message!);
    } else {
      setCloudinaryResult(`Error: ${response.error}`);
    }
    setIsCloudinaryLoading(false);
  }

  return (
    <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold font-headline">Debug Page</h1>
            <Button asChild>
                <Link href="/">Back to Home</Link>
            </Button>
        </div>
      
      <p className="text-muted-foreground mb-8">
        Use this page to test various parts of the application infrastructure.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Firestore Write Test</CardTitle>
            <CardDescription>
                Click the button to write a test document to the 'test' collection in Firestore.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-start gap-4">
            <Button onClick={handleFirestoreTest} disabled={isFirestoreLoading}>
              {isFirestoreLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                'Run Firestore Test'
              )}
            </Button>
            {firestoreResult && (
              <div className="mt-4 p-4 w-full bg-muted rounded-lg border">
                <h3 className="font-semibold">Result:</h3>
                <pre className="text-sm whitespace-pre-wrap">{firestoreResult}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Sending Test</CardTitle>
             <CardDescription>
                Click the button to send a simple test email using the configured Gmail SMTP credentials.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-start gap-4">
             <Button onClick={handleEmailTest} disabled={isEmailLoading}>
              {isEmailLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Run Email Test'
              )}
            </Button>
            {emailResult && (
              <div className="mt-4 p-4 w-full bg-muted rounded-lg border">
                <h3 className="font-semibold">Result:</h3>
                <pre className="text-sm whitespace-pre-wrap">{emailResult}</pre>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Cloudinary Connection Test</CardTitle>
             <CardDescription>
                Checks if server-side environment variables are set and if the credentials can be used to generate an API signature.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-start gap-4">
             <Button onClick={handleCloudinaryTest} disabled={isCloudinaryLoading}>
              {isCloudinaryLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                'Run Cloudinary Test'
              )}
            </Button>
            {cloudinaryResult && (
              <div className="mt-4 p-4 w-full bg-muted rounded-lg border">
                <h3 className="font-semibold">Result:</h3>
                <pre className="text-sm whitespace-pre-wrap">{cloudinaryResult}</pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
