import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("customer"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const portfolioCategoryEnum = pgEnum("portfolio_category", [
  "web",
  "app",
  "seo",
  "ecommerce",
  "branding",
]);

export const portfolioItems = pgTable("portfolio_items", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  category: portfolioCategoryEnum("category").notNull().default("web"),
  imageUrl: text("image_url"),
  liveUrl: text("live_url"),
  demoUrl: text("demo_url"),
  technologies: text("technologies").array(),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const services = pgTable("services", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  gradient: text("gradient").notNull(),
  features: text("features").array(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const orderStatusEnum = pgEnum("order_status", [
  "new",
  "in_review",
  "in_progress",
  "completed",
  "rejected",
]);

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  service: text("service").notNull(),
  budget: text("budget"),
  description: text("description").notNull(),
  status: orderStatusEnum("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------- Blog ----------
export const blogPosts = pgTable("blog_posts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  coverUrl: text("cover_url"),
  category: text("category").notNull().default("عمومی"),
  author: text("author").notNull().default("تیم برنامه نویسی آسرو"),
  tags: text("tags").array(),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),
  published: boolean("published").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------- Courses ----------
export const courses = pgTable("courses", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  coverUrl: text("cover_url"),
  level: text("level").notNull().default("مقدماتی"),
  instructor: text("instructor").notNull().default("تیم برنامه نویسی آسرو"),
  price: integer("price").notNull().default(0), // toman; 0 = free
  totalDuration: text("total_duration"),
  published: boolean("published").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const courseSessions = pgTable("course_sessions", {
  id: text("id").primaryKey(),
  courseId: text("course_id").notNull(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  videoUrl: text("video_url").notNull(),
  duration: text("duration"),
  isPreview: boolean("is_preview").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const enrollmentStatusEnum = pgEnum("enrollment_status", [
  "pending",
  "paid",
  "free",
]);

export const enrollments = pgTable("enrollments", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  courseId: text("course_id").notNull(),
  status: enrollmentStatusEnum("status").notNull().default("pending"),
  amount: integer("amount").notNull().default(0),
  authority: text("authority"),
  refId: text("ref_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------- Testimonials ----------
export const testimonials = pgTable("testimonials", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role"),
  content: text("content").notNull(),
  rating: integer("rating").notNull().default(5),
  avatarUrl: text("avatar_url"),
  approved: boolean("approved").notNull().default(false),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------- Templates ----------
export const templateCategories = pgTable("template_categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const templates = pgTable("templates", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  coverUrl: text("cover_url"),
  gallery: text("gallery").array(),
  price: integer("price").notNull().default(0),
  category: text("category").notNull().default("فروشگاهی"),
  categoryId: text("category_id"),
  technology: text("technology"),
  version: text("version"),
  compatibility: text("compatibility"),
  rating: integer("rating").notNull().default(5),
  ratingCount: integer("rating_count").notNull().default(0),
  features: text("features").array(),
  liveUrl: text("live_url"),
  demoUrl: text("demo_url"),
  downloadUrl: text("download_url"),
  filePath: text("file_path"),
  fileName: text("file_name"),
  sales: integer("sales").notNull().default(0),
  published: boolean("published").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------- Template addons ----------
export const addons = pgTable("addons", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull().default(0),
  type: text("type").notNull().default("option"), // "file" | "option"
  filePath: text("file_path"),
  fileName: text("file_name"),
  templateId: text("template_id"), // null = global addon
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const templateOrderStatusEnum = pgEnum("template_order_status", [
  "pending",
  "paid",
]);

export const templateOrders = pgTable("template_orders", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  templateId: text("template_id").notNull(),
  addonIds: text("addon_ids").array(),
  amount: integer("amount").notNull().default(0),
  status: templateOrderStatusEnum("status").notNull().default("pending"),
  authority: text("authority"),
  refId: text("ref_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------- Page builder ----------
export const pageSections = pgTable("page_sections", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  title: text("title"),
  subtitle: text("subtitle"),
  enabled: boolean("enabled").notNull().default(true),
  count: integer("count").notNull().default(3),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ---------- Template tutorials ----------
export const templateTutorials = pgTable("template_tutorials", {
  id: text("id").primaryKey(),
  templateId: text("template_id").notNull(),
  title: text("title").notNull(),
  type: text("type").notNull().default("video"), // "video" | "text"
  videoUrl: text("video_url"),
  content: text("content"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------- Template FAQs ----------
export const templateFaqs = pgTable("template_faqs", {
  id: text("id").primaryKey(),
  templateId: text("template_id").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ---------- Template updates (changelog) ----------
export const templateUpdates = pgTable("template_updates", {
  id: text("id").primaryKey(),
  templateId: text("template_id").notNull(),
  version: text("version").notNull(),
  title: text("title").notNull(),
  changes: text("changes").notNull(), // newline separated
  releasedAt: timestamp("released_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------- Template questions (user Q&A) ----------
export const templateQuestions = pgTable("template_questions", {
  id: text("id").primaryKey(),
  templateId: text("template_id").notNull(),
  userId: text("user_id"),
  name: text("name").notNull(),
  email: text("email"),
  question: text("question").notNull(),
  answer: text("answer"),
  answered: boolean("answered").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------- Support tickets ----------
export const ticketStatusEnum = pgEnum("ticket_status", [
  "open",
  "answered",
  "closed",
]);

export const supportTickets = pgTable("support_tickets", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  templateId: text("template_id").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: ticketStatusEnum("status").notNull().default("open"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const ticketReplies = pgTable("ticket_replies", {
  id: text("id").primaryKey(),
  ticketId: text("ticket_id").notNull(),
  userId: text("user_id"),
  isStaff: boolean("is_staff").notNull().default(false),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------- SEO metadata ----------
export const pageMeta = pgTable("page_meta", {
  id: text("id").primaryKey(),
  path: text("path").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  keywords: text("keywords"),
  ogImage: text("og_image"),
  noIndex: boolean("no_index").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type User = typeof users.$inferSelect;
export type PortfolioItem = typeof portfolioItems.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Setting = typeof settings.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type CourseSession = typeof courseSessions.$inferSelect;
export type Enrollment = typeof enrollments.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type Template = typeof templates.$inferSelect;
export type TemplateCategory = typeof templateCategories.$inferSelect;
export type TemplateOrder = typeof templateOrders.$inferSelect;
export type Addon = typeof addons.$inferSelect;
export type PageSection = typeof pageSections.$inferSelect;
export type TemplateTutorial = typeof templateTutorials.$inferSelect;
export type TemplateFaq = typeof templateFaqs.$inferSelect;
export type TemplateUpdate = typeof templateUpdates.$inferSelect;
export type SupportTicket = typeof supportTickets.$inferSelect;
export type TemplateQuestion = typeof templateQuestions.$inferSelect;
export type TicketReply = typeof ticketReplies.$inferSelect;
export type PageMeta = typeof pageMeta.$inferSelect;
