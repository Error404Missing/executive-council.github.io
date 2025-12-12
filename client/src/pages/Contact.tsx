import { PageLayout } from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle } from "lucide-react";
import { SiDiscord } from "react-icons/si";

const DISCORD_INVITE = "https://discord.gg/your-invite-link";

export default function ContactPage() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Mail className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary">კონტაქტი</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">დაგვიკავშირდით</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            გაქვთ კითხვა ან წინადადება? ჩვენ მზად ვართ დაგეხმაროთ
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="animate-fade-in-up stagger-1">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 rounded-full bg-[#5865F2]/20 flex items-center justify-center mx-auto mb-6">
                <SiDiscord className="w-8 h-8 text-[#5865F2]" />
              </div>
              <h2 className="text-xl font-bold mb-2">Discord</h2>
              <p className="text-muted-foreground mb-6">
                შემოგვიერთდით Discord სერვერზე სწრაფი პასუხისთვის
              </p>
              <Button
                variant="outline"
                className="gap-2 border-[#5865F2]/30 text-[#5865F2]"
                asChild
                data-testid="button-discord-contact"
              >
                <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
                  <SiDiscord className="w-4 h-4" />
                  Discord-ზე გადასვლა
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up stagger-2">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-2">მხარდაჭერა</h2>
              <p className="text-muted-foreground mb-6">
                Discord-ზე გახსენით თიქეთი სპეციფიკური საკითხებისთვის
              </p>
              <Button variant="outline" className="gap-2" asChild data-testid="button-support">
                <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4" />
                  თიქეთის გახსნა
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardContent className="py-8">
            <h2 className="text-xl font-bold mb-6 text-center">პასუხის მიღების დრო</h2>
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-primary mb-2">1-2 სთ</div>
                <p className="text-sm text-muted-foreground">Discord მხარდაჭერა</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-2">24 სთ</div>
                <p className="text-sm text-muted-foreground">გუნდის დადასტურება</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-2">30 წთ</div>
                <p className="text-sm text-muted-foreground">VIP მხარდაჭერა</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8 bg-gradient-to-r from-primary/5 to-transparent">
          <CardContent className="py-8 text-center">
            <h3 className="text-lg font-bold mb-2">საუკეთესო გზა კომუნიკაციისთვის</h3>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Discord არის ჩვენი ძირითადი კომუნიკაციის პლატფორმა. შემოგვიერთდით და მიიღეთ
              სიახლეები, განცხადებები და სწრაფი პასუხები თქვენს კითხვებზე.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
