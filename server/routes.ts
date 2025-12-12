import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin } from "./replitAuth";
import { insertTeamSchema, insertScheduleSchema, insertResultSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes - allow unauthenticated access to check auth status
  app.get("/api/auth/user", async (req: any, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.claims?.sub) {
        return res.json(null);
      }
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.json(null);
    }
  });

  // Public team routes
  app.get("/api/teams", async (req, res) => {
    try {
      const teams = await storage.getApprovedTeams();
      res.json(teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
      res.status(500).json({ message: "Failed to fetch teams" });
    }
  });

  app.get("/api/teams/blocked", async (req, res) => {
    try {
      const teams = await storage.getBlockedTeams();
      res.json(teams);
    } catch (error) {
      console.error("Error fetching blocked teams:", error);
      res.status(500).json({ message: "Failed to fetch blocked teams" });
    }
  });

  app.get("/api/teams/vip", async (req, res) => {
    try {
      const teams = await storage.getVipTeams();
      res.json(teams);
    } catch (error) {
      console.error("Error fetching VIP teams:", error);
      res.status(500).json({ message: "Failed to fetch VIP teams" });
    }
  });

  // Get current user's team
  app.get("/api/teams/my", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const team = await storage.getTeamByCaptainId(userId);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      res.json(team);
    } catch (error) {
      console.error("Error fetching user team:", error);
      res.status(500).json({ message: "Failed to fetch team" });
    }
  });

  // Register team
  app.post("/api/teams", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;

      // Check if user already has a team
      const existingTeam = await storage.getTeamByCaptainId(userId);
      if (existingTeam) {
        return res.status(400).json({ message: "You already have a team registered" });
      }

      const validatedData = insertTeamSchema.parse(req.body);
      const team = await storage.createTeam({
        ...validatedData,
        captainId: userId,
      });
      res.status(201).json(team);
    } catch (error: any) {
      console.error("Error creating team:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid team data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create team" });
    }
  });

  // Public schedule routes
  app.get("/api/schedules", async (req, res) => {
    try {
      const schedules = await storage.getAllSchedules();
      res.json(schedules);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      res.status(500).json({ message: "Failed to fetch schedules" });
    }
  });

  // Public result routes
  app.get("/api/results", async (req, res) => {
    try {
      const results = await storage.getAllResults();
      res.json(results);
    } catch (error) {
      console.error("Error fetching results:", error);
      res.status(500).json({ message: "Failed to fetch results" });
    }
  });

  // Admin routes
  app.get("/api/admin/teams", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const teams = await storage.getAllTeams();
      res.json(teams);
    } catch (error) {
      console.error("Error fetching all teams:", error);
      res.status(500).json({ message: "Failed to fetch teams" });
    }
  });

  app.patch("/api/admin/teams/:id", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const team = await storage.updateTeam(id, updateData);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      res.json(team);
    } catch (error) {
      console.error("Error updating team:", error);
      res.status(500).json({ message: "Failed to update team" });
    }
  });

  app.delete("/api/admin/teams/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteTeam(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting team:", error);
      res.status(500).json({ message: "Failed to delete team" });
    }
  });

  // Admin schedule routes
  app.post("/api/admin/schedules", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertScheduleSchema.parse(req.body);
      const schedule = await storage.createSchedule(validatedData);
      res.status(201).json(schedule);
    } catch (error: any) {
      console.error("Error creating schedule:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid schedule data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create schedule" });
    }
  });

  // Admin result routes
  app.post("/api/admin/results", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertResultSchema.parse(req.body);
      const result = await storage.createResult(validatedData);
      res.status(201).json(result);
    } catch (error: any) {
      console.error("Error creating result:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid result data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create result" });
    }
  });

  return httpServer;
}
