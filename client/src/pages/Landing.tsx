import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Trophy, Users, Calendar, Crown, Shield, ArrowRight } from "lucide-react";
import { SiDiscord } from "react-icons/si";
import { Link } from "wouter";

const DISCORD_INVITE = "https://discord.gg/your-invite-link";

const features = [
  {
    icon: Users,
    title: "გუნდის რეგისტრაცია",
    description: "შექმენით პროფილი და დაარეგისტრირეთ თქვენი გუნდი სკრიმებში მონაწილეობისთვის",
  },
  {
    icon: Calendar,
    title: "განრიგის ნახვა",
    description: "იხილეთ მომავალი სკრიმების განრიგი და დაგეგმეთ თქვენი მატჩები",
  },
  {
    icon: Trophy,
    title: "შედეგების თვალყურის დევნა",
    description: "ნახეთ მატჩების შედეგები და თქვენი გუნდის პროგრესი",
  },
  {
    icon: Crown,
    title: "VIP სტატუსი",
    description: "მიიღეთ VIP სტატუსი განსაკუთრებული პრივილეგიებისთვის",
  },
];

const stats = [
  { value: "50+", label: "გუნდი" },
  { value: "100+", label: "მატჩი" },
  { value: "10+", label: "VIP გუნდი" },
  { value: "24/7", label: "მხარდაჭერა" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary">PUBG Mobile Scrims</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up stagger-1">
            <span className="text-foreground">გუნდის </span>
            <span className="text-primary">რეგისტრაცია</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up stagger-2">
            შექმენით თქვენი გუნდი, მონაწილეობა მიიღეთ სკრიმებში და გახდით საუკეთესო PUBG მოთამაშეები
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up stagger-3">
            <Button size="lg" asChild className="gap-2 glow-primary" data-testid="button-hero-login">
              <a href="/api/login">
                შესვლა
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild data-testid="button-hero-rules">
              <Link href="/rules">წესების ნახვა</Link>
            </Button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="py-16 px-4 border-y border-border bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`text-center animate-fade-in-up stagger-${index + 1}`}
              >
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-primary">რატომ</span> ჩვენ?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              საუკეთესო პლატფორმა PUBG Mobile სკრიმებისთვის
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className={`group hover-elevate transition-all duration-300 animate-fade-in-up stagger-${index + 1}`}
              >
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              როგორ <span className="text-primary">მუშაობს?</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center animate-fade-in-up stagger-1">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary">
                1
              </div>
              <h3 className="font-semibold text-lg mb-2">შექმენით პროფილი</h3>
              <p className="text-sm text-muted-foreground">
                დარეგისტრირდით და შექმენით თქვენი პირადი პროფილი
              </p>
            </div>
            <div className="text-center animate-fade-in-up stagger-2">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary">
                2
              </div>
              <h3 className="font-semibold text-lg mb-2">დაარეგისტრირეთ გუნდი</h3>
              <p className="text-sm text-muted-foreground">
                შექმენით გუნდი და დაამატეთ თქვენი თანაგუნდელები
              </p>
            </div>
            <div className="text-center animate-fade-in-up stagger-3">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary">
                3
              </div>
              <h3 className="font-semibold text-lg mb-2">მონაწილეობა</h3>
              <p className="text-sm text-muted-foreground">
                ადმინის დადასტურების შემდეგ მონაწილეობა მიიღეთ სკრიმებში
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-card/50 border-y border-border">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-[#5865F2]/20 flex items-center justify-center mx-auto mb-6">
            <SiDiscord className="w-10 h-10 text-[#5865F2]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            შემოგვიერთდით <span className="text-[#5865F2]">Discord</span>-ზე
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            შემოგვიერთდით ჩვენს Discord სერვერზე სიახლეებისა და განცხადებებისთვის
          </p>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 border-[#5865F2]/30 text-[#5865F2] hover:bg-[#5865F2]/10"
            asChild
            data-testid="button-discord-cta"
          >
            <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
              <SiDiscord className="w-5 h-5" />
              Discord-ზე გადასვლა
            </a>
          </Button>
        </div>
      </section>

      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-md bg-primary/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold">PUBG Scrim</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <Link href="/rules" className="hover:text-foreground transition-colors">
                წესები
              </Link>
              <Link href="/help" className="hover:text-foreground transition-colors">
                დახმარება
              </Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">
                კონტაქტი
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; 2024 PUBG Scrim. ყველა უფლება დაცულია.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
