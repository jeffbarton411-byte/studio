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
import { MoreHorizontal, View, CheckCircle, CircleDashed, XCircle, Trash2, Hourglass } from 'lucide-react';
import { ApplicationStatus, type Application } from '@/lib/types';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { updateApplicationStatus } from '@/app/actions/application';
import StatusBadge from './status-badge';

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


export default function ApplicationsTable({ initialApplications }: { initialApplications: SerializableApplication[] }) {
  const [applications, setApplications] = React.useState(initialApplications);
  const [selectedApplication, setSelectedApplication] = React.useState<SerializableApplication | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const { toast } = useToast();

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    const result = await updateApplicationStatus(id, status);
    if (result?.success) {
      setApplications(prev =>
        prev.map(app => (app.id === id ? { ...app, status } : app))
      );
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
  }

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tracking ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length > 0 ? (
              applications.map(app => (
                <TableRow key={app.id}>
                  <TableCell className="font-mono text-sm">{app.id}</TableCell>
                  <TableCell className="font-medium">{app.printName}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{app.email}</TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {format(new Date(app.createdAt), 'MMM d, yyyy, h:mm a')}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={app.status} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
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
                <TableCell colSpan={6} className="h-24 text-center">
                  No applications found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-headline">Application Details</DialogTitle>
            <DialogDescription>
              Tracking ID: <span className="font-mono">{selectedApplication?.id}</span>
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">Full Name</span>
                <span className="text-sm font-semibold">{selectedApplication.printName}</span>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">Email</span>
                <span className="text-sm">{selectedApplication.email}</span>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">Phone</span>
                <span className="text-sm">{selectedApplication.phoneNumber}</span>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">Company Name</span>
                <span className="text-sm">{selectedApplication.companyName}</span>
              </div>
               <div className="grid grid-cols-2 items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">Submitted At</span>
                <span className="text-sm">{format(new Date(selectedApplication.createdAt), 'PPPp')}</span>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">Status</span>
                <StatusBadge status={selectedApplication.status} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
