import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link } from "wouter";
import { PageLayout } from "@/components/PageLayout";
import { TeamCard } from "@/components/TeamCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { User, Plus, Calendar, Shield, Crown } from "lucide-react";
import type { Team } from "@shared/schema";

export default function ProfilePage() {
  const { user, isLoading: authLoading, isAuthenticated, isAdmin } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "არაავტორიზებული",
        description: "გთხოვთ გაიაროთ ავტორიზაცია...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: myTeam, isLoading: teamLoading } = useQuery<Team>({
    queryKey: ["/api/teams/my"],
    enabled: isAuthenticated,
  });

  if (authLoading) {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="py-8">
              <div className="flex items-center gap-6">
                <Skeleton className="w-24 h-24 rounded-full" />
                <div className="space-y-4">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8 animate-fade-in-up">
          <CardContent className="py-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Avatar className="w-24 h-24 border-4 border-border">
                <AvatarImage
                  src={user?.profileImageUrl || undefined}
                  alt={user?.firstName || "User"}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/20 text-primary text-3xl">
                  {user?.firstName?.[0] || user?.email?.[0] || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-2 flex-wrap">
                  <h1 className="text-2xl font-bold">
                    {user?.firstName
                      ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`
                      : "მომხმარებელი"}
                  </h1>
                  {isAdmin && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary text-sm">
                      <Shield className="w-3 h-3" />
                      ადმინი
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground mb-4">{user?.email}</p>

                <div className="flex items-center justify-center sm:justify-start gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    გაწევრიანდა:{" "}
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("ka-GE")
                      : "N/A"}
                  </div>
                </div>
              </div>

              <Button variant="outline" asChild>
                <a href="/api/logout">გასვლა</a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <section className="animate-fade-in-up stagger-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">ჩემი გუნდი</h2>
            {!myTeam && !teamLoading && (
              <Button asChild className="gap-2" data-testid="button-register-team-profile">
                <Link href="/register-team">
                  <Plus className="w-4 h-4" />
                  გუნდის რეგისტრაცია
                </Link>
              </Button>
            )}
          </div>

          {teamLoading ? (
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-14 h-14 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ) : myTeam ? (
            <div className={myTeam.isVip ? "glow-vip rounded-lg" : ""}>
              <TeamCard team={myTeam} />

              {myTeam.isVip && (
                <Card className="mt-4 border-vip/30 bg-vip/5">
                  <CardContent className="py-4">
                    <div className="flex items-center gap-3">
                      <Crown className="w-5 h-5 text-vip" />
                      <div>
                        <p className="font-medium text-vip">VIP გუნდი</p>
                        <p className="text-sm text-muted-foreground">
                          თქვენ გაქვთ VIP სტატუსი და ექსკლუზიური პრივილეგიები
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <User className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">თქვენ ჯერ არ გაქვთ გუნდი</h3>
                <p className="text-muted-foreground mb-6">
                  დაარეგისტრირეთ თქვენი გუნდი სკრიმებში მონაწილეობისთვის
                </p>
                <Button asChild data-testid="button-register-team-empty">
                  <Link href="/register-team">გუნდის რეგისტრაცია</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </section>

        {isAdmin && (
          <section className="mt-8 animate-fade-in-up stagger-2">
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="py-6">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <Shield className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="font-bold">ადმინისტრატორი</h3>
                      <p className="text-sm text-muted-foreground">
                        თქვენ გაქვთ ადმინისტრატორის უფლებები
                      </p>
                    </div>
                  </div>
                  <Button asChild data-testid="button-admin-panel">
                    <Link href="/admin">ადმინ პანელი</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </PageLayout>
  );
}
