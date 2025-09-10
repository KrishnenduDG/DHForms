import { drizzle } from "drizzle-orm/node-postgres";

const APP_VERSION = process.env.APP_VERSION;
const PORT = process.env.PORT;
const P_FOR_DH = process.env.P_FOR_DH!;
const G_FOR_DH = process.env.G_FOR_DH!;

const db = drizzle(process.env.DATABASE_URL);

export { APP_VERSION, db, G_FOR_DH, P_FOR_DH, PORT };
