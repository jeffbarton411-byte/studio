
'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, View, CheckCircle, CircleDashed, XCircle, Trash2, Hourglass, Eye, File as FileIcon, Loader2 } from 'lucide-react';
import { ApplicationStatus, type Application } from '@/lib/types';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { updateApplicationStatus } from '@/app/actions/application';
import StatusBadge from '@/components/admin/status-badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import Image from 'next/image';
import { useFirestore } from '@/firebase';
import { collection, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';

type SerializableApplication = Omit<Application, 'createdAt'> & {
  createdAt: string;
};

const statusIcons: Record<ApplicationStatus, React.ReactNode> = {
  [ApplicationStatus.Submitted]: <CircleDashed className="mr-2 h-4 w-4" />,
  [ApplicationStatus.InProgress]: <Hourglass className="mr-2 h-4 w-4" />,
  [ApplicationStatus.Completed]: <CheckCircle className="mr-2 h-4 w-4" />,
  [ApplicationStatus.Rejected]: <XCircle className="mr-2 h-4 w-4" />,
  [ApplicationStatus.Deleted]: <Trash2 className="mr-2 h-4 w-4" />,
};

const DetailItem = ({ label, value }: { label: string, value: React.ReactNode }) => (
    <div className="grid grid-cols-3 gap-2 py-2 border-b">
        <p className="text-sm font-medium text-muted-foreground col-span-1">{label}</p>
        <div className="text-sm col-span-2">{value}</div>
    </div>
)

const DocumentPreview = ({ label, url }: { label: string, url?: string }) => (
    <div className="grid grid-cols-3 gap-2 py-2 border-b">
        <p className="text-sm font-medium text-muted-foreground col-span-1">{label}</p>
        {url ? (
            <div className="col-span-2 space-y-2">
                <Button variant="outline" size="sm" asChild>
                    <Link href={url} target="_blank" rel="noopener noreferrer">
                        <Eye className="mr-2 h-4 w-4" /> View Full Document
                    </Link>
                </Button>
                {url.match(/\.(jpeg|jpg|gif|png|webp|avif)$/i) != null ? (
                    <div className="w-full h-auto max-h-60 overflow-hidden rounded-md border">
                        <Image src={url} alt={`${label} preview`} width={300} height={200} className="w-full h-full object-contain" />
                    </div>
                ) : (
                    <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2 p-2 rounded-md bg-muted">
                        <FileIcon className="h-4 w-4" />
                        <span>No preview available. Click to view.</span>
                    </div>
                )}
            </div>
        ) : (
            <p className="text-sm col-span-2">Not Provided</p>
        )}
    </div>
);

export default function ApplicationsTable() {
  const [applications, setApplications] = React.useState<SerializableApplication[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedApplication, setSelectedApplication] = React.useState<SerializableApplication | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);
  const { toast } = useToast();
  const firestore = useFirestore();

  React.useEffect(() => {
    if (!firestore) return;

    setIsLoading(true);
    const applicationsRef = collection(firestore, 'applications');
    const q = query(applicationsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const apps = querySnapshot.docs.map(doc => {
        const data = doc.data() as Application;
        const createdAt = (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString();
        return {
          ...data,
          id: doc.id,
          createdAt,
        } as SerializableApplication;
      });
      setApplications(apps);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching applications:", error);
      toast({
        title: 'Error',
        description: 'Could not fetch applications in real-time.',
        variant: 'destructive',
      });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [firestore, toast]);


  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    const result = await updateApplicationStatus(id, status);
    if (result?.success) {
      toast({
        title: 'Status Updated',
        description: `Application ${id} marked as ${status}.`,
      });
    } else {
      toast({
        title: 'Update Failed',
        description: result?.error,
        variant: 'destructive',
      });
    }
  };
  
  const handleViewDetails = (app: SerializableApplication) => {
    setSelectedApplication(app);
    setIsDetailsOpen(true);
    setOpenMenuId(null); // Close the menu when dialog opens
  }

  const handleMenuOpenChange = (open: boolean, appId: string) => {
    if (open) {
      setOpenMenuId(appId);
    } else {
      setOpenMenuId(null);
    }
  };

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tracking ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>MC Number</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
                <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                       <div className="flex justify-center items-center">
                         <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                         <span>Loading applications...</span>
                       </div>
                    </TableCell>
                </TableRow>
            ) : applications.length > 0 ? (
              applications.map(app => (
                <TableRow key={app.id}>
                  <TableCell className="font-mono text-sm">{app.id}</TableCell>
                  <TableCell className="font-medium">{app.printName}</TableCell>
                  <TableCell>{app.mcNumber}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{app.email}</TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {format(new Date(app.createdAt), 'MMM d, yyyy, h:mm a')}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={app.status} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu open={openMenuId === app.id} onOpenChange={(open) => handleMenuOpenChange(open, app.id)}>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => handleViewDetails(app)}>
                          <View className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                        {Object.values(ApplicationStatus).map(status => (
                          <DropdownMenuItem key={status} onSelect={() => handleStatusChange(app.id, status)}>
                            {statusIcons[status]}
                            {status}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No applications found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-2xl md:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-headline">Application Details</DialogTitle>
            <DialogDescription>
              Tracking ID: <span className="font-mono">{selectedApplication?.id}</span>
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
             <ScrollArea className="max-h-[70vh] pr-6">
                <div className="space-y-4">
                    <DetailItem label="Status" value={<StatusBadge status={selectedApplication.status} />} />
                    <DetailItem label="Submitted At" value={format(new Date(selectedApplication.createdAt), 'PPPp')} />
                    
                    <h4 className="text-lg font-semibold pt-4">Applicant Info</h4>
                    <DetailItem label="Printed Name" value={selectedApplication.printName} />
                    <DetailItem label="Signature" value={<span className="font-serif italic">{selectedApplication.signature}</span>} />
                    <DetailItem label="Email" value={selectedApplication.email} />
                    <DetailItem label="Phone Number" value={selectedApplication.phoneNumber} />
                    <DetailItem label="Date of Agreement" value={format(new Date(selectedApplication.date), 'PPP')} />

                    <h4 className="text-lg font-semibold pt-4">Company & Carrier Details</h4>
                    <DetailItem label="Dispatch Company" value={selectedApplication.companyName} />
                    <DetailItem label="Carrier Full Name" value={selectedApplication.carrierFullName} />
                    <DetailItem label="Carrier Company Name" value={selectedApplication.carrierCompanyName || 'N/A'} />
                    <DetailItem label="MC Number" value={selectedApplication.mcNumber} />
                    <DetailItem label="DOT Number" value={selectedApplication.dotNumber} />

                    <h4 className="text-lg font-semibold pt-4">Services & Payment</h4>
                    <DetailItem label="Selected Services" value={selectedApplication.services.join(', ')} />
                    <DetailItem label="Carrier Payment Method" value={selectedApplication.howYouGetPaid} />

                    <h4 className="text-lg font-semibold pt-4">Uploaded Documents</h4>
                    <DocumentPreview label="Copy of Insurance" url={selectedApplication.insuranceCopy} />
                    <DocumentPreview label="Factoring Documents" url={selectedApplication.factoringDocuments} />
                </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
