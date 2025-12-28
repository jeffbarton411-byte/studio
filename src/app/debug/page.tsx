'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { runFirestoreTest } from './actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function DebugPage() {
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTest = async () => {
    setIsLoading(true);
    setResult(null);
    const response = await runFirestoreTest();
    if (response.success) {
      setResult(`Success! Document written with ID: ${response.id}`);
    } else {
      setResult(`Error: ${response.error}`);
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold font-headline">Debug Page</h1>
            <Button asChild>
                <Link href="/">Back to Home</Link>
            </Button>
        </div>
      
      <p className="text-muted-foreground mb-8">
        Use this page to test the connection to Firestore.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Firestore Write Test</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-4">
          <p>
            Click the button below to attempt to write a test document to the 'test' collection in Firestore.
          </p>
          <Button onClick={handleTest} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Test...
              </>
            ) : (
              'Run Firestore Write Test'
            )}
          </Button>
          {result && (
            <div className="mt-4 p-4 w-full bg-muted rounded-lg border">
              <h3 className="font-semibold">Test Result:</h3>
              <pre className="text-sm whitespace-pre-wrap">{result}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
