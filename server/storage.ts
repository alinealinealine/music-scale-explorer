import { users, scales, type User, type InsertUser, type Scale, type InsertScale } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Scale management methods
  getScale(id: number): Promise<Scale | undefined>;
  getScales(): Promise<Scale[]>;
  createScale(scale: InsertScale): Promise<Scale>;
  updateScale(id: number, scale: Partial<InsertScale>): Promise<Scale | undefined>;
  deleteScale(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getScale(id: number): Promise<Scale | undefined> {
    const [scale] = await db.select().from(scales).where(eq(scales.id, id));
    return scale || undefined;
  }

  async getScales(): Promise<Scale[]> {
    return await db.select().from(scales);
  }

  async createScale(insertScale: InsertScale): Promise<Scale> {
    const [scale] = await db
      .insert(scales)
      .values(insertScale)
      .returning();
    return scale;
  }

  async updateScale(id: number, updateData: Partial<InsertScale>): Promise<Scale | undefined> {
    const [scale] = await db
      .update(scales)
      .set(updateData)
      .where(eq(scales.id, id))
      .returning();
    return scale || undefined;
  }

  async deleteScale(id: number): Promise<boolean> {
    const result = await db.delete(scales).where(eq(scales.id, id));
    return result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();
