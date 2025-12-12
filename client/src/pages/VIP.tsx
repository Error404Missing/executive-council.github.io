import { useQuery } from "@tanstack/react-query";
import { PageLayout } from "@/components/PageLayout";
import { TeamCard } from "@/components/TeamCard";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Crown, Star, Zap, Shield } from "lucide-react";
import type { Team } from "@shared/schema";

const vipBenefits = [
  {
    icon: Star,
    title: "პრიორიტეტული რეგისტრაცია",
    description: "VIP გუნდებს აქვთ პრიორიტეტი სკრიმების რეგისტრაციაში",
  },
  {
    icon: Zap,
    title: "სწრაფი დადასტურება",
    description: "VIP გუნდების განაცხადები უფრო სწრაფად დასტურდება",
  },
  {
    icon: Shield,
    title: "ექსკლუზიური ბეჯი",
    description: "VIP გუნდები გამოირჩევიან ოქროს ბეჯით და სპეციალური დიზაინით",
  },
  {
    icon: Crown,
    title: "VIP ივენთები",
    description: "წვდომა მხოლოდ VIP გუნდებისთვის განკუთვნილ სპეციალურ ივენთებზე",
  },
];

export default function VIPPage() {
  const { data: teams, isLoading } = useQuery<Team[]>({
    queryKey: ["/api/teams/vip"],
  });

  const vipTeams = teams || [];

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vip/10 border border-vip/20 mb-6">
            <Crown className="w-4 h-4 text-vip" />
            <span className="text-sm text-vip">VIP პროგრამა</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-vip">VIP</span> გუნდები
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            გახდით VIP გუნდი და მიიღეთ ექსკლუზიური პრივილეგიები
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">VIP უპირატესობები</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vipBenefits.map((benefit, index) => (
              <Card
                key={benefit.title}
                className={`text-center animate-fade-in-up stagger-${index + 1} border-vip/20`}
              >
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-vip/10 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-6 h-6 text-vip" />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-8">VIP გუნდების სია</h2>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-vip/20">
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
          ) : vipTeams.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vipTeams.map((team, index) => (
                <div key={team.id} className={`animate-fade-in-up stagger-${(index % 5) + 1}`}>
                  <TeamCard team={team} />
                </div>
              ))}
            </div>
          ) : (
            <Card className="border-vip/20">
              <CardContent className="py-16 text-center">
                <Crown className="w-16 h-16 text-vip/50 mx-auto mb-4" />
                <p className="text-muted-foreground">ჯერ არ არის VIP გუნდები</p>
              </CardContent>
            </Card>
          )}
        </section>

        <section className="mt-16">
          <Card className="border-vip/30 bg-gradient-to-r from-vip/5 to-transparent">
            <CardContent className="py-8 text-center">
              <Crown className="w-12 h-12 text-vip mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">როგორ გავხდე VIP?</h3>
              <p className="text-muted-foreground max-w-lg mx-auto">
                VIP სტატუსის მისაღებად დაგვიკავშირდით Discord-ზე ან კონტაქტის გვერდიდან.
                ადმინისტრატორები განიხილავენ თქვენს განაცხადს და მოგანიჭებენ VIP სტატუსს.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </PageLayout>
  );
}
