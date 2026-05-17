import { getApplicationById } from "@/app/actions/application";
import StatusBadge from "@/components/admin/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Application } from "@/lib/types";
import { format } from "date-fns";
import { AlertCircle, Eye, Home, MapPin } from "lucide-react";
import Link from "next/link";
import React from "react";

const DetailSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="space-y-4">
        <h3 className="text-lg font-bold text-primary flex items-center gap-2">
          <div className="h-1 w-4 bg-primary rounded-full"></div>
          {title}
        </h3>
        <div className="space-y-1 bg-white/[0.02] p-6 rounded-xl border border-white/5 glass">{children}</div>
    </div>
);

const DetailItem = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-white/5 last:border-none group">
    <p className="text-sm font-medium text-muted-foreground group-hover:text-white transition-colors">{label}</p>
    <div className="text-sm sm:text-right font-semibold">{value || 'N/A'}</div>
  </div>
);

export default async function TrackApplicationPage({ params }: { params: { id: string } }) {
    const application: Application | null = await getApplicationById(params.id);

    if (!application) {
        return (
            <div className="container mx-auto flex-1 flex items-center justify-center py-12 px-4">
                <Card className="w-full max-w-md text-center glass border-destructive/20">
                     <CardHeader>
                        <div className="mx-auto bg-destructive/10 p-4 rounded-full w-fit">
                            <AlertCircle className="w-12 h-12 text-destructive" />
                        </div>
                        <CardTitle className="font-headline text-3xl mt-6">Application Missing</CardTitle>
                        <CardDescription className="text-base mt-2">
                            The tracking ID <span className="font-mono font-bold text-white">{params.id}</span> was not found in our database.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Button asChild className="w-full h-12">
                            <Link href="/"><Home className="mr-2 h-4 w-4" /> Return to Application</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex-1 relative">
            <div className="container mx-auto py-16 px-4 md:px-6 relative z-10">
                <div className="max-w-4xl mx-auto space-y-10">
                    <div className="text-center space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight font-headline">Tracking Portal</h1>
                        <p className="text-muted-foreground text-lg">drive4mmm Submission Analysis</p>
                        <div className="flex justify-center mt-4">
                          <Badge variant="outline" className="font-mono py-1 px-4 text-primary border-primary/30">
                            {application.id}
                          </Badge>
                        </div>
                    </div>

                    <Card className="glass border-white/5 subtle-glow">
                        <CardContent className="p-8 flex flex-col md:flex-row justify-between items-center gap-8">
                             <div className="text-center md:text-left space-y-2">
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Current Phase</p>
                                <div className="scale-125 origin-left">
                                  <StatusBadge status={application.status} />
                                </div>
                             </div>
                             <div className="h-10 w-px bg-white/5 hidden md:block"></div>
                             <div className="text-center md:text-right space-y-1">
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Log Recorded</p>
                                <p className="font-mono text-lg">{format(new Date(application.createdAt as string), 'MMM dd, yyyy | HH:mm')}</p>
                             </div>
                        </CardContent>
                    </Card>

                    <div className="grid gap-10">
                        <DetailSection title="Owner Specifications">
                            <DetailItem label="Full Legal Name" value={application.printName} />
                            <DetailItem label="Digital Identifier" value={application.email} />
                            <DetailItem label="Direct Line" value={application.phoneNumber} />
                            <DetailItem label="Authentication Signature" value={<span className="font-serif italic text-primary text-lg">"{application.signature}"</span>} />
                        </DetailSection>

                        <DetailSection title="Operations & Fleet">
                            <DetailItem label="Dispatch Entity" value={application.companyName} />
                            <DetailItem label="Carrier Brand" value={application.carrierCompanyName || application.carrierFullName} />
                            <DetailItem label="MC Authority" value={application.mcNumber} />
                            <DetailItem label="DOT Authority" value={application.dotNumber} />
                        </DetailSection>

                        <DetailSection title="Logistics Config">
                            <DetailItem label="Service Bundle" value={<div className="flex flex-wrap gap-2 justify-end">{application.services.map(s => <Badge key={s} variant="secondary" className="bg-primary/10 text-primary border-none">{s}</Badge>)}</div>} />
                            <DetailItem label="Funding Method" value={application.paymentMethod} />
                        </DetailSection>
                    </div>

                    <div className="flex flex-col items-center gap-6 pt-10">
                        <p className="text-muted-foreground text-sm max-w-md text-center">
                          Need to update your details? Contact our headquarters at 800.434.8881
                        </p>
                        <Button asChild variant="outline" className="glass px-8">
                            <Link href="/"><Home className="mr-2 h-4 w-4" /> Home Dashboard</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
