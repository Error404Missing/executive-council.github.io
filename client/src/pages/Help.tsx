import { PageLayout } from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, UserPlus, Users, Trophy, Shield, Mail } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "როგორ დავარეგისტრირო გუნდი?",
    answer:
      "ჯერ შექმენით პროფილი საიტზე შესვლით. შემდეგ გადადით 'გუნდის რეგისტრაცია' გვერდზე, შეავსეთ საჭირო ინფორმაცია (გუნდის სახელი, tag, 4 მოთამაშის სახელი) და გაგზავნეთ განაცხადი. ადმინისტრატორი განიხილავს და დაადასტურებს თქვენს გუნდს.",
  },
  {
    question: "რამდენი ხანი სჭირდება გუნდის დადასტურებას?",
    answer:
      "ჩვეულებრივ, გუნდის განაცხადი განიხილება 24 საათის განმავლობაში. VIP გუნდების განაცხადები პრიორიტეტულად განიხილება.",
  },
  {
    question: "რატომ უარყო ან დაბლოკა ადმინმა ჩემი გუნდი?",
    answer:
      "გუნდი შეიძლება უარყოფილი იქნას თუ: სახელი ან tag შეიცავს შეურაცხმყოფელ სიტყვებს, მოთამაშეთა სახელები არასწორია, ან არსებობს სხვა გუნდი იგივე სახელით. დაბლოკვა ხდება წესების სერიოზული დარღვევის შემთხვევაში.",
  },
  {
    question: "როგორ მივიღო VIP სტატუსი?",
    answer:
      "VIP სტატუსის მისაღებად დაგვიკავშირდით Discord-ზე ან კონტაქტის გვერდიდან. ადმინისტრატორები განიხილავენ თქვენს განაცხადს და მოგანიჭებენ VIP სტატუსს აქტიურობის და კარგი ქცევის საფუძველზე.",
  },
  {
    question: "რა არის სლოტის ნომერი?",
    answer:
      "სლოტის ნომერი არის თქვენი გუნდის ლობის ადგილი სკრიმში. ადმინისტრატორი მიანიჭებს თქვენს გუნდს სლოტს დადასტურების შემდეგ.",
  },
  {
    question: "შემიძლია გუნდის ინფორმაციის შეცვლა?",
    answer:
      "დიახ, პროფილის გვერდიდან შეგიძლიათ განაახლოთ გუნდის ინფორმაცია. მნიშვნელოვანი ცვლილებები (სახელი, tag) ხელახლა უნდა დადასტურდეს ადმინის მიერ.",
  },
];

const guides = [
  {
    icon: UserPlus,
    title: "პროფილის შექმნა",
    description: "დააჭირეთ 'შესვლა' ღილაკს და შექმენით თქვენი ანგარიში",
  },
  {
    icon: Users,
    title: "გუნდის რეგისტრაცია",
    description: "შეავსეთ გუნდის ფორმა 4 მოთამაშის მონაცემებით",
  },
  {
    icon: Shield,
    title: "დადასტურება",
    description: "დაელოდეთ ადმინის მიერ გუნდის დადასტურებას",
  },
  {
    icon: Trophy,
    title: "სკრიმები",
    description: "მონაწილეობა მიიღეთ დაგეგმილ სკრიმებში",
  },
];

export default function HelpPage() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <HelpCircle className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary">დახმარება</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">როგორ დაგეხმაროთ?</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            პასუხები ხშირად დასმულ კითხვებზე და სახელმძღვანელოები
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">სწრაფი სახელმძღვანელო</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {guides.map((guide, index) => (
              <Card key={guide.title} className={`animate-fade-in-up stagger-${index + 1}`}>
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <guide.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{guide.title}</h3>
                  <p className="text-sm text-muted-foreground">{guide.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">ხშირად დასმული კითხვები</h2>
          <Card>
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger
                      className="text-left"
                      data-testid={`faq-question-${index}`}
                    >
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="bg-card/50">
            <CardContent className="py-8 text-center">
              <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">კიდევ გაქვთ კითხვები?</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                თუ პასუხი ვერ იპოვეთ, დაგვიკავშირდით კონტაქტის გვერდიდან
              </p>
              <Button asChild data-testid="button-contact-help">
                <Link href="/contact">კონტაქტი</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </PageLayout>
  );
}
