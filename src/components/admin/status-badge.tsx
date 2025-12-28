import { Badge } from "@/components/ui/badge";
import { ApplicationStatus, statusColors } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: ApplicationStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const colorClass = statusColors[status] || 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  
  return (
    <Badge
      variant="outline"
      className={cn("px-2 py-0.5 text-xs font-semibold rounded-full border", colorClass)}
    >
      {status}
    </Badge>
  );
}
