import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  switch (status) {
    case "approved":
      return (
        <Badge
          variant="outline"
          className={`bg-status-approved/20 text-status-approved border-status-approved/30 ${className}`}
        >
          დადასტურებული
        </Badge>
      );
    case "pending":
      return (
        <Badge
          variant="outline"
          className={`bg-status-pending/20 text-status-pending border-status-pending/30 ${className}`}
        >
          მოლოდინში
        </Badge>
      );
    case "rejected":
      return (
        <Badge
          variant="outline"
          className={`bg-status-rejected/20 text-status-rejected border-status-rejected/30 ${className}`}
        >
          უარყოფილი
        </Badge>
      );
    case "blocked":
      return (
        <Badge
          variant="outline"
          className={`bg-status-blocked/20 text-status-blocked border-status-blocked/30 ${className}`}
        >
          დაბლოკილი
        </Badge>
      );
    case "upcoming":
      return (
        <Badge
          variant="outline"
          className={`bg-primary/20 text-primary border-primary/30 ${className}`}
        >
          მომავალი
        </Badge>
      );
    case "active":
      return (
        <Badge
          variant="outline"
          className={`bg-status-approved/20 text-status-approved border-status-approved/30 ${className}`}
        >
          აქტიური
        </Badge>
      );
    case "completed":
      return (
        <Badge
          variant="outline"
          className={`bg-muted text-muted-foreground border-muted-foreground/30 ${className}`}
        >
          დასრულებული
        </Badge>
      );
    case "cancelled":
      return (
        <Badge
          variant="outline"
          className={`bg-status-rejected/20 text-status-rejected border-status-rejected/30 ${className}`}
        >
          გაუქმებული
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className={className}>
          {status}
        </Badge>
      );
  }
}
