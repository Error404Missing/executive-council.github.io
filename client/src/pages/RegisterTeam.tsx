import { useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageLayout } from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Users, AlertCircle } from "lucide-react";
import type { Team } from "@shared/schema";

const teamFormSchema = z.object({
  name: z
    .string()
    .min(3, "სახელი უნდა იყოს მინიმუმ 3 სიმბოლო")
    .max(30, "სახელი არ უნდა აღემატებოდეს 30 სიმბოლოს"),
  tag: z
    .string()
    .min(2, "Tag უნდა იყოს მინიმუმ 2 სიმბოლო")
    .max(5, "Tag არ უნდა აღემატებოდეს 5 სიმბოლოს"),
  player1: z.string().min(3, "მოთამაშის სახელი უნდა იყოს მინიმუმ 3 სიმბოლო"),
  player2: z.string().min(3, "მოთამაშის სახელი უნდა იყოს მინიმუმ 3 სიმბოლო"),
  player3: z.string().min(3, "მოთამაშის სახელი უნდა იყოს მინიმუმ 3 სიმბოლო"),
  player4: z.string().min(3, "მოთამაშის სახელი უნდა იყოს მინიმუმ 3 სიმბოლო"),
  discordContact: z.string().optional(),
});

type TeamFormValues = z.infer<typeof teamFormSchema>;

export default function RegisterTeamPage() {
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const { data: existingTeam, isLoading: teamLoading } = useQuery<Team>({
    queryKey: ["/api/teams/my"],
    enabled: isAuthenticated,
  });

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

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: "",
      tag: "",
      player1: "",
      player2: "",
      player3: "",
      player4: "",
      discordContact: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: TeamFormValues) => {
      return await apiRequest("POST", "/api/teams", data);
    },
    onSuccess: () => {
      toast({
        title: "გუნდი დარეგისტრირდა",
        description: "თქვენი გუნდის განაცხადი გაიგზავნა. დაელოდეთ ადმინის დადასტურებას.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/teams/my"] });
      setLocation("/profile");
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "არაავტორიზებული",
          description: "გთხოვთ გაიაროთ ავტორიზაცია...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "შეცდომა",
        description: error.message || "გუნდის რეგისტრაცია ვერ მოხერხდა",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TeamFormValues) => {
    registerMutation.mutate(data);
  };

  if (authLoading || teamLoading) {
    return (
      <PageLayout>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="py-16 text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="mt-4 text-muted-foreground">იტვირთება...</p>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (existingTeam) {
    return (
      <PageLayout>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="border-status-pending/30 bg-status-pending/5">
            <CardContent className="py-8 text-center">
              <AlertCircle className="w-16 h-16 text-status-pending mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">თქვენ უკვე გაქვთ გუნდი</h2>
              <p className="text-muted-foreground mb-6">
                თითოეულ მომხმარებელს შეუძლია მხოლოდ ერთი გუნდის რეგისტრაცია
              </p>
              <Button asChild>
                <a href="/profile">პროფილზე გადასვლა</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="animate-fade-in-up">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">გუნდის რეგისტრაცია</CardTitle>
            <CardDescription>
              შეავსეთ ფორმა თქვენი გუნდის დასარეგისტრირებლად
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>გუნდის სახელი</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="მაგ. Team Alpha"
                            {...field}
                            data-testid="input-team-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tag"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tag</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="მაგ. ALPHA"
                            {...field}
                            data-testid="input-team-tag"
                          />
                        </FormControl>
                        <FormDescription>2-5 სიმბოლო</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">მოთამაშეები</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="player1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>მოთამაშე 1 (კაპიტანი)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="PUBG სახელი"
                              {...field}
                              data-testid="input-player1"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="player2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>მოთამაშე 2</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="PUBG სახელი"
                              {...field}
                              data-testid="input-player2"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="player3"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>მოთამაშე 3</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="PUBG სახელი"
                              {...field}
                              data-testid="input-player3"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="player4"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>მოთამაშე 4</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="PUBG სახელი"
                              {...field}
                              data-testid="input-player4"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="discordContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discord კონტაქტი (არასავალდებულო)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="მაგ. username#1234"
                          {...field}
                          data-testid="input-discord"
                        />
                      </FormControl>
                      <FormDescription>
                        Discord username ადმინებთან კომუნიკაციისთვის
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={registerMutation.isPending}
                  data-testid="button-submit-team"
                >
                  {registerMutation.isPending ? (
                    <>
                      <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                      იგზავნება...
                    </>
                  ) : (
                    "გუნდის რეგისტრაცია"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
