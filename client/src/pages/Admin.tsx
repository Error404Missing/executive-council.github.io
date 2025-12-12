import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { PageLayout } from "@/components/PageLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Shield,
  Users,
  Calendar,
  Trophy,
  Check,
  X,
  Ban,
  Trash2,
  Crown,
  Hash,
  Plus,
  Upload,
} from "lucide-react";
import type { Team, Schedule, Result } from "@shared/schema";

export default function AdminPage() {
  const { isLoading: authLoading, isAuthenticated, isAdmin } = useAuth();
  const { toast } = useToast();
  const [slotValue, setSlotValue] = useState<{ [key: string]: string }>({});
  const [newSchedule, setNewSchedule] = useState({ title: "", description: "", date: "", maxTeams: "16" });
  const [newResult, setNewResult] = useState({ title: "", description: "", imageUrl: "" });

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      toast({
        title: "არაავტორიზებული",
        description: "თქვენ არ გაქვთ ადმინისტრატორის უფლებები",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
  }, [isAuthenticated, isAdmin, authLoading, toast]);

  const { data: teams, isLoading: teamsLoading } = useQuery<Team[]>({
    queryKey: ["/api/admin/teams"],
    enabled: isAdmin,
  });

  const { data: schedules, isLoading: schedulesLoading } = useQuery<Schedule[]>({
    queryKey: ["/api/schedules"],
    enabled: isAdmin,
  });

  const { data: results, isLoading: resultsLoading } = useQuery<Result[]>({
    queryKey: ["/api/results"],
    enabled: isAdmin,
  });

  const updateTeamMutation = useMutation({
    mutationFn: async ({ teamId, data }: { teamId: string; data: Partial<Team> }) => {
      return await apiRequest("PATCH", `/api/admin/teams/${teamId}`, data);
    },
    onSuccess: () => {
      toast({ title: "გუნდი განახლდა" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/teams"] });
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
        return;
      }
      toast({ title: "შეცდომა", description: error.message, variant: "destructive" });
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: async (teamId: string) => {
      return await apiRequest("DELETE", `/api/admin/teams/${teamId}`);
    },
    onSuccess: () => {
      toast({ title: "გუნდი წაიშალა" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/teams"] });
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
    },
    onError: (error) => {
      toast({ title: "შეცდომა", description: error.message, variant: "destructive" });
    },
  });

  const createScheduleMutation = useMutation({
    mutationFn: async (data: typeof newSchedule) => {
      return await apiRequest("POST", "/api/admin/schedules", {
        ...data,
        date: new Date(data.date).toISOString(),
        maxTeams: parseInt(data.maxTeams),
      });
    },
    onSuccess: () => {
      toast({ title: "განრიგი დაემატა" });
      setNewSchedule({ title: "", description: "", date: "", maxTeams: "16" });
      queryClient.invalidateQueries({ queryKey: ["/api/schedules"] });
    },
    onError: (error) => {
      toast({ title: "შეცდომა", description: error.message, variant: "destructive" });
    },
  });

  const createResultMutation = useMutation({
    mutationFn: async (data: typeof newResult) => {
      return await apiRequest("POST", "/api/admin/results", data);
    },
    onSuccess: () => {
      toast({ title: "შედეგი დაემატა" });
      setNewResult({ title: "", description: "", imageUrl: "" });
      queryClient.invalidateQueries({ queryKey: ["/api/results"] });
    },
    onError: (error) => {
      toast({ title: "შეცდომა", description: error.message, variant: "destructive" });
    },
  });

  const handleApprove = (teamId: string) => {
    updateTeamMutation.mutate({ teamId, data: { status: "approved" } });
  };

  const handleReject = (teamId: string) => {
    updateTeamMutation.mutate({ teamId, data: { status: "rejected" } });
  };

  const handleBlock = (teamId: string) => {
    updateTeamMutation.mutate({ teamId, data: { status: "blocked" } });
  };

  const handleToggleVip = (teamId: string, currentVip: boolean) => {
    updateTeamMutation.mutate({ teamId, data: { isVip: !currentVip } });
  };

  const handleSetSlot = (teamId: string) => {
    const slot = parseInt(slotValue[teamId]);
    if (!isNaN(slot)) {
      updateTeamMutation.mutate({ teamId, data: { slot } });
    }
  };

  const handleDelete = (teamId: string) => {
    deleteTeamMutation.mutate(teamId);
  };

  if (authLoading) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const pendingTeams = teams?.filter((t) => t.status === "pending") || [];
  const approvedTeams = teams?.filter((t) => t.status === "approved") || [];
  const blockedTeams = teams?.filter((t) => t.status === "blocked") || [];

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">ადმინ პანელი</h1>
            <p className="text-muted-foreground">გუნდების და სკრიმების მართვა</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-status-pending/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-status-pending" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingTeams.length}</p>
                  <p className="text-sm text-muted-foreground">მოლოდინში</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-status-approved/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-status-approved" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{approvedTeams.length}</p>
                  <p className="text-sm text-muted-foreground">დადასტურებული</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-status-blocked/10 flex items-center justify-center">
                  <Ban className="w-6 h-6 text-status-blocked" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{blockedTeams.length}</p>
                  <p className="text-sm text-muted-foreground">დაბლოკილი</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-vip/10 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-vip" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{teams?.filter((t) => t.isVip).length || 0}</p>
                  <p className="text-sm text-muted-foreground">VIP გუნდი</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="flex-wrap h-auto gap-2">
            <TabsTrigger value="pending" data-testid="admin-tab-pending">
              მოლოდინში ({pendingTeams.length})
            </TabsTrigger>
            <TabsTrigger value="approved" data-testid="admin-tab-approved">
              დადასტურებული ({approvedTeams.length})
            </TabsTrigger>
            <TabsTrigger value="blocked" data-testid="admin-tab-blocked">
              დაბლოკილი ({blockedTeams.length})
            </TabsTrigger>
            <TabsTrigger value="schedules" data-testid="admin-tab-schedules">
              განრიგი
            </TabsTrigger>
            <TabsTrigger value="results" data-testid="admin-tab-results">
              შედეგები
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>მოლოდინში მყოფი გუნდები</CardTitle>
              </CardHeader>
              <CardContent>
                {teamsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
                  </div>
                ) : pendingTeams.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>გუნდი</TableHead>
                          <TableHead>მოთამაშეები</TableHead>
                          <TableHead>Discord</TableHead>
                          <TableHead>მოქმედებები</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingTeams.map((team) => (
                          <TableRow key={team.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{team.name}</p>
                                <p className="text-sm text-muted-foreground">[{team.tag}]</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              {team.player1}, {team.player2}, {team.player3}, {team.player4}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {team.discordContact || "-"}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-status-approved border-status-approved/30"
                                  onClick={() => handleApprove(team.id)}
                                  data-testid={`button-approve-${team.id}`}
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-status-rejected border-status-rejected/30"
                                  onClick={() => handleReject(team.id)}
                                  data-testid={`button-reject-${team.id}`}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-status-blocked border-status-blocked/30"
                                  onClick={() => handleBlock(team.id)}
                                  data-testid={`button-block-${team.id}`}
                                >
                                  <Ban className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    მოლოდინში მყოფი გუნდები არ არის
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved">
            <Card>
              <CardHeader>
                <CardTitle>დადასტურებული გუნდები</CardTitle>
              </CardHeader>
              <CardContent>
                {approvedTeams.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>გუნდი</TableHead>
                          <TableHead>სლოტი</TableHead>
                          <TableHead>VIP</TableHead>
                          <TableHead>მოქმედებები</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {approvedTeams.map((team) => (
                          <TableRow key={team.id} className={team.isVip ? "bg-vip/5" : ""}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div>
                                  <p className="font-medium">{team.name}</p>
                                  <p className="text-sm text-muted-foreground">[{team.tag}]</p>
                                </div>
                                {team.isVip && <Crown className="w-4 h-4 text-vip" />}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  className="w-20"
                                  placeholder={team.slot?.toString() || "#"}
                                  value={slotValue[team.id] || ""}
                                  onChange={(e) => setSlotValue({ ...slotValue, [team.id]: e.target.value })}
                                  data-testid={`input-slot-${team.id}`}
                                />
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => handleSetSlot(team.id)}
                                  data-testid={`button-set-slot-${team.id}`}
                                >
                                  <Hash className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant={team.isVip ? "default" : "outline"}
                                className={team.isVip ? "bg-vip text-vip-foreground" : ""}
                                onClick={() => handleToggleVip(team.id, team.isVip)}
                                data-testid={`button-toggle-vip-${team.id}`}
                              >
                                <Crown className="w-4 h-4 mr-1" />
                                {team.isVip ? "VIP" : "VIP მინიჭება"}
                              </Button>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-status-blocked border-status-blocked/30"
                                  onClick={() => handleBlock(team.id)}
                                  data-testid={`button-block-approved-${team.id}`}
                                >
                                  <Ban className="w-4 h-4" />
                                </Button>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-destructive border-destructive/30"
                                      data-testid={`button-delete-${team.id}`}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>გუნდის წაშლა</DialogTitle>
                                    </DialogHeader>
                                    <p className="text-muted-foreground">
                                      დარწმუნებული ხართ რომ გსურთ გუნდის "{team.name}" წაშლა?
                                    </p>
                                    <DialogFooter>
                                      <DialogClose asChild>
                                        <Button variant="outline">გაუქმება</Button>
                                      </DialogClose>
                                      <Button
                                        variant="destructive"
                                        onClick={() => handleDelete(team.id)}
                                      >
                                        წაშლა
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    დადასტურებული გუნდები არ არის
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blocked">
            <Card>
              <CardHeader>
                <CardTitle>დაბლოკილი გუნდები</CardTitle>
              </CardHeader>
              <CardContent>
                {blockedTeams.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>გუნდი</TableHead>
                          <TableHead>მოთამაშეები</TableHead>
                          <TableHead>მოქმედებები</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {blockedTeams.map((team) => (
                          <TableRow key={team.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{team.name}</p>
                                <p className="text-sm text-muted-foreground">[{team.tag}]</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              {team.player1}, {team.player2}, {team.player3}, {team.player4}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-status-approved border-status-approved/30"
                                  onClick={() => handleApprove(team.id)}
                                >
                                  განბლოკვა
                                </Button>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-destructive border-destructive/30"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>გუნდის წაშლა</DialogTitle>
                                    </DialogHeader>
                                    <p className="text-muted-foreground">
                                      დარწმუნებული ხართ რომ გსურთ გუნდის "{team.name}" წაშლა?
                                    </p>
                                    <DialogFooter>
                                      <DialogClose asChild>
                                        <Button variant="outline">გაუქმება</Button>
                                      </DialogClose>
                                      <Button
                                        variant="destructive"
                                        onClick={() => handleDelete(team.id)}
                                      >
                                        წაშლა
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    დაბლოკილი გუნდები არ არის
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedules">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                <CardTitle>განრიგის მართვა</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-2" data-testid="button-add-schedule">
                      <Plus className="w-4 h-4" />
                      დამატება
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>ახალი განრიგი</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="სათაური"
                        value={newSchedule.title}
                        onChange={(e) => setNewSchedule({ ...newSchedule, title: e.target.value })}
                        data-testid="input-schedule-title"
                      />
                      <Textarea
                        placeholder="აღწერა (არასავალდებულო)"
                        value={newSchedule.description}
                        onChange={(e) => setNewSchedule({ ...newSchedule, description: e.target.value })}
                        data-testid="input-schedule-description"
                      />
                      <Input
                        type="datetime-local"
                        value={newSchedule.date}
                        onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
                        data-testid="input-schedule-date"
                      />
                      <Input
                        type="number"
                        placeholder="მაქს. გუნდები"
                        value={newSchedule.maxTeams}
                        onChange={(e) => setNewSchedule({ ...newSchedule, maxTeams: e.target.value })}
                        data-testid="input-schedule-max-teams"
                      />
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">გაუქმება</Button>
                      </DialogClose>
                      <Button
                        onClick={() => createScheduleMutation.mutate(newSchedule)}
                        disabled={createScheduleMutation.isPending}
                        data-testid="button-save-schedule"
                      >
                        შენახვა
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {schedulesLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
                  </div>
                ) : schedules && schedules.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>სათაური</TableHead>
                          <TableHead>თარიღი</TableHead>
                          <TableHead>მაქს. გუნდები</TableHead>
                          <TableHead>სტატუსი</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {schedules.map((schedule) => (
                          <TableRow key={schedule.id}>
                            <TableCell className="font-medium">{schedule.title}</TableCell>
                            <TableCell>
                              {new Date(schedule.date).toLocaleString("ka-GE")}
                            </TableCell>
                            <TableCell>{schedule.maxTeams}</TableCell>
                            <TableCell>
                              <StatusBadge status={schedule.status} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    განრიგი არ არის
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                <CardTitle>შედეგების მართვა</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-2" data-testid="button-add-result">
                      <Upload className="w-4 h-4" />
                      შედეგის დამატება
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>ახალი შედეგი</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="სათაური"
                        value={newResult.title}
                        onChange={(e) => setNewResult({ ...newResult, title: e.target.value })}
                        data-testid="input-result-title"
                      />
                      <Textarea
                        placeholder="აღწერა (არასავალდებულო)"
                        value={newResult.description}
                        onChange={(e) => setNewResult({ ...newResult, description: e.target.value })}
                        data-testid="input-result-description"
                      />
                      <Input
                        placeholder="სურათის URL"
                        value={newResult.imageUrl}
                        onChange={(e) => setNewResult({ ...newResult, imageUrl: e.target.value })}
                        data-testid="input-result-image"
                      />
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">გაუქმება</Button>
                      </DialogClose>
                      <Button
                        onClick={() => createResultMutation.mutate(newResult)}
                        disabled={createResultMutation.isPending}
                        data-testid="button-save-result"
                      >
                        შენახვა
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {resultsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
                  </div>
                ) : results && results.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>სათაური</TableHead>
                          <TableHead>თარიღი</TableHead>
                          <TableHead>სურათი</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.map((result) => (
                          <TableRow key={result.id}>
                            <TableCell className="font-medium">{result.title}</TableCell>
                            <TableCell>
                              {new Date(result.date || result.createdAt!).toLocaleDateString("ka-GE")}
                            </TableCell>
                            <TableCell>
                              {result.imageUrl ? (
                                <a
                                  href={result.imageUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  ნახვა
                                </a>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    შედეგები არ არის
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
