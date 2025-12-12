import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Trophy, Calendar, ImageIcon } from "lucide-react";
import type { Result } from "@shared/schema";

export default function ResultsPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: results, isLoading } = useQuery<Result[]>({
    queryKey: ["/api/results"],
  });

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">შედეგები</h1>
          <p className="text-muted-foreground">სკრიმების შედეგები და სკრინშოტები</p>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardContent className="pt-6 space-y-4">
                  <Skeleton className="aspect-video w-full rounded-md" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : results && results.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result, index) => (
              <Card
                key={result.id}
                className={`overflow-visible animate-fade-in-up stagger-${(index % 5) + 1}`}
                data-testid={`card-result-${result.id}`}
              >
                <CardContent className="pt-6">
                  {result.imageUrl ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          className="w-full aspect-video rounded-md overflow-hidden mb-4 bg-muted cursor-pointer hover-elevate"
                          onClick={() => setSelectedImage(result.imageUrl)}
                          data-testid={`button-view-result-${result.id}`}
                        >
                          <img
                            src={result.imageUrl}
                            alt={result.title}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl p-0 overflow-hidden">
                        <img
                          src={result.imageUrl}
                          alt={result.title}
                          className="w-full h-auto"
                        />
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <div className="w-full aspect-video rounded-md bg-muted flex items-center justify-center mb-4">
                      <ImageIcon className="w-12 h-12 text-muted-foreground/50" />
                    </div>
                  )}

                  <h3 className="font-semibold text-lg mb-2" data-testid={`text-result-title-${result.id}`}>
                    {result.title}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {new Date(result.date || result.createdAt!).toLocaleDateString("ka-GE", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>

                  {result.description && (
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                      {result.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <Trophy className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">ჯერ არ არის შედეგები</p>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}
