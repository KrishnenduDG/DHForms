import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schemas",
  dbCredentials: {
    // @ts-ignore
    url: process.env.DATABASE_URL!,
  },
});
