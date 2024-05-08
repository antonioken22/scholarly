import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const courseFlowsheet = await ctx.db.insert("courseFlowsheets", {
      program: args.title,
      userId,
      isArchived: false,
      isPublished: false,
    });

    return courseFlowsheet;
  },
});

export const getSidebar = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const courseFlowsheets = await ctx.db
      .query("courseFlowsheets")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return courseFlowsheets;
  },
});

export const getById = query({
  args: { courseFlowsheetId: v.id("courseFlowsheets") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const courseFlowsheet = await ctx.db.get(args.courseFlowsheetId);

    if (!courseFlowsheet) {
      throw new Error("Not found");
    }

    if (courseFlowsheet.isPublished && !courseFlowsheet.isArchived) {
      return courseFlowsheet;
    }

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    if (courseFlowsheet.userId !== userId) {
      throw new Error("Unauthorized");
    }

    return courseFlowsheet;
  },
});

export const archive = mutation({
  args: { id: v.id("courseFlowsheets") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingCourseFlowsheet = await ctx.db.get(args.id);

    if (!existingCourseFlowsheet) {
      throw new Error("Not found");
    }

    if (existingCourseFlowsheet.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const courseFlowsheet = await ctx.db.patch(args.id, {
      isArchived: true,
    });

    return courseFlowsheet;
  },
});

export const getTrash = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const courseFlowsheet = await ctx.db
      .query("courseFlowsheets")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .order("desc")
      .collect();

    return courseFlowsheet;
  },
});

export const restore = mutation({
  args: { id: v.id("courseFlowsheets") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingCourseFlowsheet = await ctx.db.get(args.id);

    if (!existingCourseFlowsheet) {
      throw new Error("Not found");
    }

    if (existingCourseFlowsheet.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const options: Partial<Doc<"courseFlowsheets">> = {
      isArchived: false,
    };

    const courseFlowsheet = await ctx.db.patch(args.id, options);

    return courseFlowsheet;
  },
});

export const remove = mutation({
  args: { id: v.id("courseFlowsheets") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingCourseFlowsheet = await ctx.db.get(args.id);

    if (!existingCourseFlowsheet) {
      throw new Error("Not found");
    }

    if (existingCourseFlowsheet.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const courseFlowsheet = await ctx.db.delete(args.id);

    return courseFlowsheet;
  },
});

export const update = mutation({
  args: {
    id: v.id("courseFlowsheets"),
    program: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return;
    }

    const userId = identity.subject;

    const { id, ...rest } = args;

    const existingCourseFlowsheet = await ctx.db.get(args.id);

    if (!existingCourseFlowsheet) {
      throw new Error("Not found");
    }

    if (existingCourseFlowsheet.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const courseFlowsheet = await ctx.db.patch(args.id, {
      ...rest,
    });

    return courseFlowsheet;
  },
});
