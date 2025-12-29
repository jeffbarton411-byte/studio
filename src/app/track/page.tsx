
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import Link from 'next/link';

export default function TrackApplicationSearchPage() {
  const [trackingId, setTrackingId] = useState('');
  const router = useRouter();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      router.push(`/track/${trackingId.trim()}`);
    }
  };

  return (
    <div className="container mx-auto flex-1 flex items-center justify-center py-12 px-4 md:px-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
            <Search className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl mt-4">Track Your Application</CardTitle>
          <CardDescription>
            Enter your unique tracking ID below to check the status of your submission.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="trackingId">Tracking ID</Label>
              <Input
                id="trackingId"
                placeholder="FFP-..."
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                required
                className="font-mono"
              />
            </div>
            <Button type="submit" className="w-full">
              <Search className="mr-2 h-4 w-4" /> Track
            </Button>
          </form>
           <div className="text-center mt-4">
            <Button asChild variant="link">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
