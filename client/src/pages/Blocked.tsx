import { useQuery } from "@tanstack/react-query";
import { PageLayout } from "@/components/PageLayout";
import { TeamCard } from "@/components/TeamCard";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Ban, AlertTriangle } from "lucide-react";
import type { Team } from "@shared/schema";

export default function BlockedPage() {
  const { data: teams, isLoading } = useQuery<Team[]>({
    queryKey: ["/api/teams/blocked"],
  });

  const blockedTeams = teams || [];

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-status-blocked/20 flex items-center justify-center">
              <Ban className="w-5 h-5 text-status-blocked" />
            </div>
            <h1 className="text-3xl font-bold">დაბლოკილი გუნდები</h1>
          </div>
          <p className="text-muted-foreground">
            წესების დარღვევის გამო დაბლოკილი გუნდების სია
          </p>
        </div>

        <Card className="mb-8 border-status-blocked/30 bg-status-blocked/5">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-status-blocked shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-status-blocked">გაფრთხილება</p>
                <p className="text-sm text-muted-foreground mt-1">
                  ეს გუნდები დაიბლოკა წესების დარღვევის გამო. დაბლოკილ გუნდებს არ შეუძლიათ სკრიმებში მონაწილეობა.
                  თუ თვლით, რომ შეცდომით მოხვდით ამ სიაში, გთხოვთ დაგვიკავშირდეთ.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-14 h-14 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : blockedTeams.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blockedTeams.map((team, index) => (
              <div key={team.id} className={`animate-fade-in-up stagger-${(index % 5) + 1}`}>
                <TeamCard team={team} showSlot={false} />
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <Ban className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">დაბლოკილი გუნდები არ არის</p>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}
