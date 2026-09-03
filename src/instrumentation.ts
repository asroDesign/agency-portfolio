export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { seedDatabase } = await import("@/db/seed");
    try {
      await seedDatabase();
    } catch (err) {
      // Seeding is best-effort at startup; the DB may not be ready yet.
      console.warn("[instrumentation] seed skipped:", err);
    }
  }
}
