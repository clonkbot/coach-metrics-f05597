import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("goals")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const getByMetric = query({
  args: { metric: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db
      .query("goals")
      .withIndex("by_user_and_metric", (q) => q.eq("userId", userId).eq("metric", args.metric))
      .first();
  },
});

export const upsert = mutation({
  args: {
    metric: v.string(),
    dailyTarget: v.number(),
    weeklyTarget: v.number(),
    monthlyTarget: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("goals")
      .withIndex("by_user_and_metric", (q) => q.eq("userId", userId).eq("metric", args.metric))
      .first();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: now,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("goals", {
        userId,
        ...args,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

export const remove = mutation({
  args: { id: v.id("goals") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const goal = await ctx.db.get(args.id);
    if (!goal || goal.userId !== userId) throw new Error("Not found");

    await ctx.db.delete(args.id);
  },
});
