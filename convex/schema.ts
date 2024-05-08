import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    userId: v.string(),
    isArchived: v.boolean(),
    parentDocument: v.optional(v.id("documents")),
    content: v.optional(v.string()),
    icon: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    isPublished: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_user_parent", ["userId", "parentDocument"]),

  courseFlowsheets: defineTable({
    program: v.string(),
    academicYear: v.optional(v.string()),
    yearLevel: v.optional(v.string()),
    semester: v.optional(v.string()),
    course: v.optional(v.string()),
    courseRelationship: v.optional(v.string()),
    userId: v.string(),
    isArchived: v.boolean(),
    content: v.optional(v.string()),
    icon: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    isPublished: v.boolean(),
  }).index("by_user", ["userId"]),
});
