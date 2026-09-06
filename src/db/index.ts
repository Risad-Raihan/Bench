import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { applyForceIpv4 } from "./force-ipv4";

applyForceIpv4();

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
