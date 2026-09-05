import { db } from "@/db";
import { services, portfolioItems, settings, orders, messages, pageSections } from "@/db/schema";
import { asc, desc, eq, sql } from "drizzle-orm";
import { cache } from "react";

export const getServices = cache(async () => {
  return db.select().from(services).orderBy(asc(services.sortOrder));
});

export const getAllPortfolio = cache(async () => {
  return db
    .select()
    .from(portfolioItems)
    .orderBy(desc(portfolioItems.featured), asc(portfolioItems.sortOrder));
});

export const getFeaturedPortfolio = cache(async () => {
  return db
    .select()
    .from(portfolioItems)
    .where(eq(portfolioItems.featured, true))
    .orderBy(asc(portfolioItems.sortOrder))
    .limit(6);
});

export const getSettingsMap = cache(async () => {
  const rows = await db.select().from(settings);
  const map = new Map<string, string>();
  for (const r of rows) map.set(r.key, r.value);
  return map;
});

export const getSiteConfig = cache(async () => {
  const map = await getSettingsMap();
  return {
    logoText: map.get("logo_text")?.replace(/نکسا ?تک|نکساتک/gi, "تیم برنامه نویسی آسرو") || "تیم برنامه نویسی آسرو",
    logoImageUrl: map.get("logo_image_url") || null,
    footerAbout: map.get("footer_about") || "تیم حرفه‌ای برنامه‌نویسان برای طراحی وب‌سایت، توسعه اپلیکیشن و ارتقای سئو.",
    copyright: map.get("footer_copyright")?.replace(/نکسا ?تک|نکساتک/gi, "تیم برنامه نویسی آسرو") || "تیم برنامه نویسی آسرو — تمامی حقوق محفوظ است.",
  };
});

export const getSiteStats = cache(async () => {
  const [portfolioCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(portfolioItems);
  const map = await getSettingsMap();
  return {
    projects: Number(portfolioCount?.count ?? 0),
    clients: Number(map.get("stats_clients") ?? 120),
    years: Number(map.get("stats_years") ?? 8),
    team: Number(map.get("stats_team") ?? 14),
  };
});

export const getPageSections = cache(async () => {
  return db
    .select()
    .from(pageSections)
    .where(eq(pageSections.enabled, true))
    .orderBy(asc(pageSections.sortOrder));
});

export const getDashboardStats = cache(async () => {
  const [orderCount] = await db.select({ count: sql<number>`count(*)` }).from(orders);
  const [newOrders] = await db
    .select({ count: sql<number>`count(*)` })
    .from(orders)
    .where(eq(orders.status, "new"));
  const [messageCount] = await db.select({ count: sql<number>`count(*)` }).from(messages);
  const [unread] = await db
    .select({ count: sql<number>`count(*)` })
    .from(messages)
    .where(eq(messages.read, false));
  const [portfolioCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(portfolioItems);

  return {
    orders: Number(orderCount?.count ?? 0),
    newOrders: Number(newOrders?.count ?? 0),
    messages: Number(messageCount?.count ?? 0),
    unread: Number(unread?.count ?? 0),
    portfolio: Number(portfolioCount?.count ?? 0),
  };
});
