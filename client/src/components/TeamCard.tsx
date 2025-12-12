import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, Users } from "lucide-react";
import type { Team } from "@shared/schema";

interface TeamCardProps {
  team: Team;
  showSlot?: boolean;
}

export function TeamCard({ team, showSlot = true }: TeamCardProps) {
  const getStatusBadge = () => {
    switch (team.status) {
      case "approved":
        return (
          <Badge variant="outline" className="bg-status-approved/20 text-status-approved border-status-approved/30">
            დადასტურებული
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-status-pending/20 text-status-pending border-status-pending/30">
            მოლოდინში
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-status-rejected/20 text-status-rejected border-status-rejected/30">
            უარყოფილი
          </Badge>
        );
      case "blocked":
        return (
          <Badge variant="outline" className="bg-status-blocked/20 text-status-blocked border-status-blocked/30">
            დაბლოკილი
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card
      className={`relative overflow-visible transition-all duration-300 hover-elevate ${
        team.isVip
          ? "border-vip/50 glow-vip"
          : "border-border"
      }`}
      data-testid={`card-team-${team.id}`}
    >
      {team.isVip && (
        <div className="absolute -top-3 -right-3 z-10">
          <div className="w-8 h-8 rounded-full bg-vip flex items-center justify-center animate-pulse-glow">
            <Crown className="w-4 h-4 text-vip-foreground" />
          </div>
        </div>
      )}

      {showSlot && team.slot !== null && team.slot !== undefined && (
        <div className="absolute -top-2 -left-2 z-10">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
            #{team.slot}
          </div>
        </div>
      )}

      <CardHeader className="flex flex-row items-center gap-4 pb-3 space-y-0">
        <Avatar className="w-14 h-14 border-2 border-border">
          <AvatarImage src={team.logo || undefined} alt={team.name} className="object-cover" />
          <AvatarFallback className="bg-primary/20 text-primary text-lg font-bold">
            {team.tag?.slice(0, 2) || team.name?.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-lg truncate" data-testid={`text-team-name-${team.id}`}>
              {team.name}
            </h3>
            {team.isVip && (
              <Badge className="bg-vip text-vip-foreground border-none">
                VIP
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">[{team.tag}]</p>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>4 მოთამაშე</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {getStatusBadge()}
        </div>

        {team.discordContact && (
          <p className="text-xs text-muted-foreground truncate">
            Discord: {team.discordContact}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
