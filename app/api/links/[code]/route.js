import { PrismaClient } from "@/generated/prisma_client/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

import { redirect } from "next/navigation";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export async function GET(_, { params }) {
  const { code } = await params;
  const link = await prisma.Link.findUnique({ where: { shortCode: code } });
  if (!link) return new Response("Not found", { status: 404 });
  return redirect(link.url);
}
