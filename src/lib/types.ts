import type { Timestamp } from "firebase-admin/firestore";

export enum ApplicationStatus {
  Submitted = 'Submitted',
  InProgress = 'In Progress',
  Completed = 'Completed',
  Rejected = 'Rejected',
  Deleted = 'Deleted',
}

export const statusColors: Record<ApplicationStatus, string> = {
  [ApplicationStatus.Submitted]: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  [ApplicationStatus.InProgress]: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  [ApplicationStatus.Completed]: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  [ApplicationStatus.Rejected]: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  [ApplicationStatus.Deleted]: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
};

export interface Application {
  id: string; // Tracking ID
  companyName: string;
  carrierFullName: string;
  carrierCompanyName?: string;
  mcNumber: string;
  dotNumber: string;
  phoneNumber: string;
  services: string[];
  paymentMethod: string;
  insuranceCopy?: string;
  factoringDocuments?: string;
  signature: string;
  printName: string;
  date: string;
  email: string;
  howYouGetPaid: string;
  createdAt: Timestamp | string;
  status: ApplicationStatus;
}
