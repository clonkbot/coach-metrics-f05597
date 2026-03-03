import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // Daily KPI entries
  kpiEntries: defineTable({
    userId: v.id("users"),
    date: v.string(), // YYYY-MM-DD format
    // Revenue metrics
    revenue: v.number(),
    newClients: v.number(),
    // Engagement metrics
    callsBooked: v.number(),
    callsCompleted: v.number(),
    // Content metrics
    contentPosted: v.number(),
    leadsGenerated: v.number(),
    // Client success metrics
    clientWins: v.number(),
    testimonials: v.number(),
    // Notes
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_date", ["userId", "date"]),

  // Goals for tracking targets
  goals: defineTable({
    userId: v.id("users"),
    metric: v.string(),
    dailyTarget: v.number(),
    weeklyTarget: v.number(),
    monthlyTarget: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_metric", ["userId", "metric"]),
});
