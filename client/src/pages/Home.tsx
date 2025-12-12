import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { PageLayout } from "@/components/PageLayout";
import { TeamCard } from "@/components/TeamCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { Trophy, Users, Calendar, Crown, Plus, ArrowRight } from "lucide-react";
import type { Team, Schedule } from "@shared/schema";

export default function Home() {
  const { user } = useAuth();

  const { data: teams, isLoading: teamsLoading } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  const { data: schedules, isLoading: schedulesLoading } = useQuery<Schedule[]>({
    queryKey: ["/api/schedules"],
  });

  const { data: myTeam } = useQuery<Team>({
    queryKey: ["/api/teams/my"],
  });

  const approvedTeams = teams?.filter((t) => t.status === "approved") || [];
  const vipTeams = teams?.filter((t) => t.isVip) || [];
  const upcomingSchedules = schedules?.filter((s) => s.status === "upcoming") || [];

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                გამარჯობა, <span className="text-primary">{user?.firstName || "მომხმარებელ"}</span>
              </h1>
              <p className="text-muted-foreground">
                კეთილი იყოს თქვენი მობრძანება PUBG Scrim პლატფორმაზე
              </p>
            </div>
            {!myTeam && (
              <Button asChild className="gap-2" data-testid="button-register-team">
                <Link href="/register-team">
                  <Plus className="w-4 h-4" />
                  გუნდის რეგისტრაცია
                </Link>
              </Button>
            )}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="animate-fade-in-up stagger-1">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{approvedTeams.length}</p>
                    <p className="text-sm text-muted-foreground">გუნდი</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in-up stagger-2">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{upcomingSchedules.length}</p>
                    <p className="text-sm text-muted-foreground">მომავალი სკრიმი</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in-up stagger-3">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-vip/10 flex items-center justify-center">
                    <Crown className="w-6 h-6 text-vip" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{vipTeams.length}</p>
                    <p className="text-sm text-muted-foreground">VIP გუნდი</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in-up stagger-4">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-status-approved/10 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-status-approved" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{schedules?.filter(s => s.status === "completed").length || 0}</p>
                    <p className="text-sm text-muted-foreground">დასრულებული</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {myTeam && (
          <section className="mb-12 animate-fade-in-up">
            <Card className={myTeam.isVip ? "border-vip/50 glow-vip" : ""}>
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                <div className="flex items-center gap-3">
                  <CardTitle>ჩემი გუნდი</CardTitle>
                  {myTeam.isVip && (
                    <Crown className="w-5 h-5 text-vip" />
                  )}
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/profile">პროფილი</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <TeamCard team={myTeam} />
              </CardContent>
            </Card>
          </section>
        )}

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">მომავალი სკრიმები</h2>
            <Button variant="ghost" asChild className="gap-2">
              <Link href="/schedule">
                ყველა ნახვა
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {schedulesLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="pt-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : upcomingSchedules.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingSchedules.slice(0, 3).map((schedule, index) => (
                <Card key={schedule.id} className={`animate-fade-in-up stagger-${index + 1}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{schedule.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(schedule.date).toLocaleDateString("ka-GE", {
                            day: "numeric",
                            month: "long",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="px-3 py-1 rounded-md bg-primary/10 text-primary text-sm font-medium">
                        {schedule.maxTeams} სლოტი
                      </div>
                    </div>
                    {schedule.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {schedule.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">ჯერ არ არის დაგეგმილი სკრიმები</p>
              </CardContent>
            </Card>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">VIP გუნდები</h2>
            <Button variant="ghost" asChild className="gap-2">
              <Link href="/vip">
                ყველა ნახვა
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {teamsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : vipTeams.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vipTeams.slice(0, 6).map((team, index) => (
                <div key={team.id} className={`animate-fade-in-up stagger-${(index % 5) + 1}`}>
                  <TeamCard team={team} />
                </div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Crown className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">ჯერ არ არის VIP გუნდები</p>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </PageLayout>
  );
}
