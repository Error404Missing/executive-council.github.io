import { useQuery } from "@tanstack/react-query";
import { PageLayout } from "@/components/PageLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Users } from "lucide-react";
import type { Schedule } from "@shared/schema";

export default function SchedulePage() {
  const { data: schedules, isLoading } = useQuery<Schedule[]>({
    queryKey: ["/api/schedules"],
  });

  const upcomingSchedules = schedules?.filter((s) => s.status === "upcoming") || [];
  const activeSchedules = schedules?.filter((s) => s.status === "active") || [];
  const completedSchedules = schedules?.filter((s) => s.status === "completed") || [];

  const ScheduleCard = ({ schedule, index }: { schedule: Schedule; index: number }) => (
    <Card
      className={`animate-fade-in-up stagger-${(index % 5) + 1}`}
      data-testid={`card-schedule-${schedule.id}`}
    >
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate" data-testid={`text-schedule-title-${schedule.id}`}>
              {schedule.title}
            </h3>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(schedule.date).toLocaleDateString("ka-GE", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {new Date(schedule.date).toLocaleTimeString("ka-GE", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
          <StatusBadge status={schedule.status} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">მაქს. გუნდები:</span>
            <span className="font-medium text-primary">{schedule.maxTeams}</span>
          </div>
        </div>

        {schedule.description && (
          <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
            {schedule.description}
          </p>
        )}
      </CardContent>
    </Card>
  );

  const EmptyState = ({ message }: { message: string }) => (
    <Card>
      <CardContent className="py-16 text-center">
        <Calendar className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
        <p className="text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">განრიგი</h1>
          <p className="text-muted-foreground">სკრიმების განრიგი და მატჩების დროები</p>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="upcoming" data-testid="tab-upcoming">
              მომავალი ({upcomingSchedules.length})
            </TabsTrigger>
            <TabsTrigger value="active" data-testid="tab-active">
              აქტიური ({activeSchedules.length})
            </TabsTrigger>
            <TabsTrigger value="completed" data-testid="tab-completed">
              დასრულებული ({completedSchedules.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
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
              <div className="grid md:grid-cols-2 gap-4">
                {upcomingSchedules.map((schedule, index) => (
                  <ScheduleCard key={schedule.id} schedule={schedule} index={index} />
                ))}
              </div>
            ) : (
              <EmptyState message="ჯერ არ არის დაგეგმილი მომავალი სკრიმები" />
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {activeSchedules.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {activeSchedules.map((schedule, index) => (
                  <ScheduleCard key={schedule.id} schedule={schedule} index={index} />
                ))}
              </div>
            ) : (
              <EmptyState message="ამჟამად არ მიმდინარეობს აქტიური სკრიმები" />
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedSchedules.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {completedSchedules.map((schedule, index) => (
                  <ScheduleCard key={schedule.id} schedule={schedule} index={index} />
                ))}
              </div>
            ) : (
              <EmptyState message="ჯერ არ არის დასრულებული სკრიმები" />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
