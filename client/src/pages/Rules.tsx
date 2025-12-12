import { PageLayout } from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const rules = [
  {
    category: "ზოგადი წესები",
    items: [
      "გუნდში უნდა იყოს ზუსტად 4 მოთამაშე",
      "თითოეულ მოთამაშეს შეუძლია მხოლოდ ერთ გუნდში იყოს",
      "გუნდის სახელი და tag უნიკალური უნდა იყოს",
      "არ არის ნებადართული შეურაცხმყოფელი სახელები",
      "Discord კონტაქტის მითითება რეკომენდებულია",
    ],
  },
  {
    category: "სკრიმის წესები",
    items: [
      "სკრიმი იწყება დანიშნულ დროზე - დაგვიანება ნიშნავს დისკვალიფიკაციას",
      "ყველა მოთამაშემ უნდა გამოიყენოს საკუთარი ანგარიში",
      "თაღლითობა (cheating) აკრძალულია და იწვევს მუდმივ ბლოკს",
      "ტოქსიკური ქცევა ჩატში დაუშვებელია",
      "არ გამოიყენოთ პროგრამები რომლებიც გაძლევთ უპირატესობას",
    ],
  },
  {
    category: "დისკვალიფიკაცია",
    items: [
      "დაგვიანება 10 წუთზე მეტით",
      "არასწორი ინფორმაციის მითითება რეგისტრაციისას",
      "სხვა მოთამაშის ანგარიშის გამოყენება",
      "უხეში ქცევა ადმინისტრატორების ან სხვა მოთამაშეების მიმართ",
    ],
  },
  {
    category: "ბლოკი",
    items: [
      "თაღლითობის პროგრამების გამოყენება (მუდმივი ბლოკი)",
      "განმეორებითი დისკვალიფიკაცია (3-ჯერ = ბლოკი)",
      "ადმინისტრატორის შეურაცხყოფა",
      "სხვა გუნდის საბოტაჟი",
    ],
  },
];

export default function RulesPage() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary">წესები</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">წესები და პირობები</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            გთხოვთ ყურადღებით წაიკითხოთ წესები მონაწილეობის მიღებამდე
          </p>
        </div>

        <Card className="mb-8 border-status-pending/30 bg-status-pending/5">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-status-pending shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-status-pending">მნიშვნელოვანი</p>
                <p className="text-sm text-muted-foreground mt-1">
                  რეგისტრაციით თქვენ ეთანხმებით ყველა ქვემოთ მოცემულ წესს. წესების დარღვევა იწვევს
                  გაფრთხილებას, დისკვალიფიკაციას ან ბლოკს.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {rules.map((section, sectionIndex) => (
            <Card key={section.category} className={`animate-fade-in-up stagger-${sectionIndex + 1}`}>
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  {section.category === "დისკვალიფიკაცია" ? (
                    <XCircle className="w-5 h-5 text-status-rejected" />
                  ) : section.category === "ბლოკი" ? (
                    <AlertTriangle className="w-5 h-5 text-status-blocked" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-primary" />
                  )}
                  {section.category}
                </h2>
                <ul className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-start gap-3 text-muted-foreground"
                    >
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-medium text-primary">
                        {itemIndex + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 border-status-approved/30 bg-status-approved/5">
          <CardContent className="py-6 text-center">
            <CheckCircle className="w-10 h-10 text-status-approved mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">კარგი ქცევა = კარგი გამოცდილება</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              დაიცავით წესები და მიიღეთ საუკეთესო გამოცდილება სკრიმებში მონაწილეობით
            </p>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
