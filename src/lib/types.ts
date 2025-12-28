import type { Timestamp } from "firebase/firestore";

export enum ApplicationStatus {
  Submitted = 'Submitted',
  InProgress = 'In Progress',
  Completed = 'Completed',
  Rejected = 'Rejected',
  Deleted = 'Deleted',
}

export const statusColors: Record<ApplicationStatus, string> = {
  [ApplicationStatus.Submitted]: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  [ApplicationStatus.InProgress]: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  [ApplicationStatus.Completed]: 'bg-green-500/10 text-green-600 border-green-500/20',
  [ApplicationStatus.Rejected]: 'bg-red-500/10 text-red-600 border-red-500/20',
  [ApplicationStatus.Deleted]: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
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
  createdAt: Timestamp;
  status: ApplicationStatus;
}
