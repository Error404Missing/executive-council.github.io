import {
  users,
  teams,
  schedules,
  results,
  type User,
  type UpsertUser,
  type Team,
  type InsertTeam,
  type Schedule,
  type InsertSchedule,
  type Result,
  type InsertResult,
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserRole(id: string, role: string): Promise<User | undefined>;

  // Team operations
  getAllTeams(): Promise<Team[]>;
  getTeamById(id: string): Promise<Team | undefined>;
  getTeamByCaptainId(captainId: string): Promise<Team | undefined>;
  getApprovedTeams(): Promise<Team[]>;
  getBlockedTeams(): Promise<Team[]>;
  getVipTeams(): Promise<Team[]>;
  getPendingTeams(): Promise<Team[]>;
  createTeam(teamData: {
    name: string;
    tag: string;
    player1: string;
    player2: string;
    player3: string;
    player4: string;
    captainId: string;
    logo?: string;
    discordContact?: string;
  }): Promise<Team>;
  updateTeam(id: string, data: Partial<Team>): Promise<Team | undefined>;
  deleteTeam(id: string): Promise<void>;

  // Schedule operations
  getAllSchedules(): Promise<Schedule[]>;
  getScheduleById(id: string): Promise<Schedule | undefined>;
  createSchedule(schedule: InsertSchedule): Promise<Schedule>;
  updateSchedule(id: string, data: Partial<Schedule>): Promise<Schedule | undefined>;

  // Result operations
  getAllResults(): Promise<Result[]>;
  getResultById(id: string): Promise<Result | undefined>;
  createResult(result: InsertResult): Promise<Result>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserRole(id: string, role: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Team operations
  async getAllTeams(): Promise<Team[]> {
    return await db.select().from(teams);
  }

  async getTeamById(id: string): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team;
  }

  async getTeamByCaptainId(captainId: string): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.captainId, captainId));
    return team;
  }

  async getApprovedTeams(): Promise<Team[]> {
    return await db.select().from(teams).where(eq(teams.status, "approved"));
  }

  async getBlockedTeams(): Promise<Team[]> {
    return await db.select().from(teams).where(eq(teams.status, "blocked"));
  }

  async getVipTeams(): Promise<Team[]> {
    return await db
      .select()
      .from(teams)
      .where(and(eq(teams.isVip, true), eq(teams.status, "approved")));
  }

  async getPendingTeams(): Promise<Team[]> {
    return await db.select().from(teams).where(eq(teams.status, "pending"));
  }

  async createTeam(teamData: {
    name: string;
    tag: string;
    player1: string;
    player2: string;
    player3: string;
    player4: string;
    captainId: string;
    logo?: string;
    discordContact?: string;
  }): Promise<Team> {
    const [newTeam] = await db.insert(teams).values(teamData).returning();
    return newTeam;
  }

  async updateTeam(id: string, data: Partial<Team>): Promise<Team | undefined> {
    const [team] = await db
      .update(teams)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(teams.id, id))
      .returning();
    return team;
  }

  async deleteTeam(id: string): Promise<void> {
    await db.delete(teams).where(eq(teams.id, id));
  }

  // Schedule operations
  async getAllSchedules(): Promise<Schedule[]> {
    return await db.select().from(schedules);
  }

  async getScheduleById(id: string): Promise<Schedule | undefined> {
    const [schedule] = await db.select().from(schedules).where(eq(schedules.id, id));
    return schedule;
  }

  async createSchedule(schedule: InsertSchedule): Promise<Schedule> {
    const [newSchedule] = await db.insert(schedules).values(schedule).returning();
    return newSchedule;
  }

  async updateSchedule(id: string, data: Partial<Schedule>): Promise<Schedule | undefined> {
    const [schedule] = await db
      .update(schedules)
      .set(data)
      .where(eq(schedules.id, id))
      .returning();
    return schedule;
  }

  // Result operations
  async getAllResults(): Promise<Result[]> {
    return await db.select().from(results);
  }

  async getResultById(id: string): Promise<Result | undefined> {
    const [result] = await db.select().from(results).where(eq(results.id, id));
    return result;
  }

  async createResult(result: InsertResult): Promise<Result> {
    const [newResult] = await db.insert(results).values(result).returning();
    return newResult;
  }
}

export const storage = new DatabaseStorage();
