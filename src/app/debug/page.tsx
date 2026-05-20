
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { runFirestoreTest, runEmailTest, runCloudinaryTest } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Database, Mail, Cloud, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function DebugPage() {
  const [firestoreResult, setFirestoreResult] = useState<any>(null);
  const [isFirestoreLoading, setIsFirestoreLoading] = useState(false);
  
  const [emailResult, setEmailResult] = useState<any>(null);
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  const [cloudinaryResult, setCloudinaryResult] = useState<any>(null);
  const [isCloudinaryLoading, setIsCloudinaryLoading] = useState(false);

  const handleFirestoreTest = async () => {
    setIsFirestoreLoading(true);
    setFirestoreResult(null);
    const response = await runFirestoreTest();
    setFirestoreResult(response);
    setIsFirestoreLoading(false);
  };
  
  const handleEmailTest = async () => {
    setIsEmailLoading(true);
    setEmailResult(null);
    const response = await runEmailTest();
    setEmailResult(response);
    setIsEmailLoading(false);
  };

  const handleCloudinaryTest = async () => {
    setIsCloudinaryLoading(true);
    setCloudinaryResult(null);
    const response = await runCloudinaryTest();
    setCloudinaryResult(response);
    setIsCloudinaryLoading(false);
  }

  const ResultDisplay = ({ result }: { result: any }) => {
    if (!result) return null;
    return (
      <div className={`mt-4 p-4 w-full rounded-lg border text-sm ${result.success ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
        <div className="flex items-center gap-2 mb-2">
          {result.success ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4 text-red-500" />}
          <span className="font-bold">{result.success ? 'Test Passed' : 'Test Failed'}</span>
        </div>
        <pre className="whitespace-pre-wrap overflow-auto max-h-40 font-mono text-xs opacity-80">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold font-headline">System Diagnostics</h1>
          <p className="text-muted-foreground">Verify infrastructure connections for drive4mmm</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/">Back to Portal</Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" /> Firestore
            </CardTitle>
            <CardDescription>Verify Admin SDK database connectivity and write permissions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleFirestoreTest} disabled={isFirestoreLoading} className="w-full">
              {isFirestoreLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Run Database Test'}
            </Button>
            <ResultDisplay result={firestoreResult} />
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" /> SMTP Email
            </CardTitle>
            <CardDescription>Test Gmail SMTP credentials and delivery to admin email.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleEmailTest} disabled={isEmailLoading} className="w-full">
              {isEmailLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Run Email Test'}
            </Button>
            <ResultDisplay result={emailResult} />
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-primary" /> Cloudinary
            </CardTitle>
            <CardDescription>Validate client and server-side upload configurations.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleCloudinaryTest} disabled={isCloudinaryLoading} className="w-full">
              {isCloudinaryLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Run Assets Test'}
            </Button>
            <ResultDisplay result={cloudinaryResult} />
          </CardContent>
          </Card>
        </div>
      </div>  
  );
}
