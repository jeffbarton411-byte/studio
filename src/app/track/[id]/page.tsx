
import { getApplicationById } from "@/app/actions/application";
import StatusBadge from "@/components/admin/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Application } from "@/lib/types";
import { format } from "date-fns";
import { AlertCircle, Eye, File as FileIcon, Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const DetailSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
        <div className="space-y-3 bg-white p-4 rounded-lg border">{children}</div>
    </div>
);

const DetailItem = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b last:border-none">
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <p className="text-sm text-right font-medium">{value || 'N/A'}</p>
  </div>
);

const DocumentPreviewItem = ({ label, url }: { label: string; url?: string }) => (
    <div className="py-2 border-b last:border-none">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
             <p className="text-sm font-medium text-muted-foreground">{label}</p>
              {url ? (
                <Button variant="outline" size="sm" asChild className="mt-2 sm:mt-0">
                    <Link href={url} target="_blank" rel="noopener noreferrer">
                        <Eye className="mr-2 h-4 w-4" /> View Document
                    </Link>
                </Button>
            ) : (
                <p className="text-sm font-medium">Not provided</p>
            )}
        </div>
         {url && url.match(/\.(jpeg|jpg|gif|png|webp|avif)$/i) != null && (
            <div className="mt-3 w-full h-auto max-h-80 overflow-hidden rounded-md border p-2 flex justify-center bg-gray-50">
                <Image src={url} alt={`${label} preview`} width={400} height={300} className="w-auto h-full object-contain" />
            </div>
        )}
    </div>
);


export default async function TrackApplicationPage({ params }: { params: { id: string } }) {
    const application: Application | null = await getApplicationById(params.id);

    if (!application) {
        return (
            <div className="container mx-auto flex-1 flex items-center justify-center py-12 px-4">
                <Card className="w-full max-w-md text-center">
                     <CardHeader>
                        <div className="mx-auto bg-red-100 p-3 rounded-full w-fit">
                            <AlertCircle className="w-10 h-10 text-red-600" />
                        </div>
                        <CardTitle className="font-headline text-3xl mt-4">Not Found</CardTitle>
                        <CardDescription>
                            The application with tracking ID <span className="font-mono font-bold">{params.id}</span> could not be found. Please check the ID and try again.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Button asChild>
                            <Link href="/"><Home className="mr-2" /> Back to Home</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="bg-gray-50/50 flex-1">
            <div className="container mx-auto py-12 px-4 md:px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">Application Status</h1>
                        <p className="text-muted-foreground mt-2">Tracking ID: <span className="font-mono font-semibold text-primary">{application.id}</span></p>
                    </div>

                    <Card className="mb-8">
                        <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                             <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <StatusBadge status={application.status} />
                             </div>
                             <div>
                                <p className="text-sm text-muted-foreground">Submitted On</p>
                                <p className="font-medium">{format(new Date(application.createdAt as string), 'PPP, p')}</p>
                             </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-8">
                        <DetailSection title="Applicant Information">
                            <DetailItem label="Printed Name" value={application.printName} />
                            <DetailItem label="Email Address" value={application.email} />
                            <DetailItem label="Phone Number" value={application.phoneNumber} />
                            <DetailItem label="Signature" value={<span className="font-serif italic">{application.signature}</span>} />
                            <DetailItem label="Date of Agreement" value={format(new Date(application.date), 'PPP')} />
                        </DetailSection>

                        <DetailSection title="Company & Carrier Details">
                            <DetailItem label="Dispatch Company" value={application.companyName} />
                            <DetailItem label="Carrier Full Name" value={application.carrierFullName} />
                            <DetailItem label="Carrier Company Name" value={application.carrierCompanyName} />
                            <DetailItem label="MC Number" value={application.mcNumber} />
                            <DetailItem label="DOT Number" value={application.dotNumber} />
                        </DetailSection>

                        <DetailSection title="Services & Payment">
                            <DetailItem label="Selected Services" value={<Badge variant="secondary" className="whitespace-normal text-right">{application.services.join(', ')}</Badge>} />
                            <DetailItem label="Service Fee Payment" value={application.paymentMethod} />
                            <DetailItem label="Carrier Payment Method" value={application.howYouGetPaid} />
                        </DetailSection>

                         <DetailSection title="Uploaded Documents">
                            <DocumentPreviewItem label="Copy of Insurance" url={application.insuranceCopy} />
                            <DocumentPreviewItem label="Factoring Documents" url={application.factoringDocuments} />
                        </DetailSection>
                    </div>
                     <div className="text-center mt-10">
                        <Button asChild>
                            <Link href="/"><Home className="mr-2" /> Back to Home</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
