
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Copy } from "lucide-react";
import Link from "next/link";

export default function SuccessPage({ params }: { params: { id: string } }) {
  const trackingId = params.id;

  return (
    <div className="container mx-auto flex-1 flex items-center justify-center py-12 px-4 md:px-6">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-green-100 dark:bg-green-900/20 p-3 rounded-full w-fit">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="font-headline text-3xl mt-4">Application Submitted!</CardTitle>
          <CardDescription>
            Thank you for your submission. We have sent a confirmation email with a copy of your data. You can use the tracking ID below to monitor your application status.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-muted rounded-lg border border-dashed">
            <p className="text-sm text-muted-foreground">Your Unique Tracking ID</p>
            <p className="text-2xl font-bold font-mono tracking-wider text-primary">{trackingId}</p>
          </div>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/track/${trackingId}`}>Track Application</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
