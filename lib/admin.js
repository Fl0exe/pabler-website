import { PrismaClient } from "@/generated/prisma_client/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export async function toggleSignup(session) {
  if (!session || session.user.role !== "admin") throw new Error("Forbidden");

  const setting = await prisma.appSetting.findFirst();
  if (!setting) throw new Error("AppSetting not found");

  return await prisma.appSetting.update({
    where: { id: setting.id },
    data: { allowSignup: !setting.allowSignup },
  });
}

export async function changeUserRole(session, userId, role) {
  if (!session || (session.user.role !== "admin" && session.user.id !== "0"))
    throw new Error("Forbidden");
  if (userId === "0") throw new Error("Cannot modify Superadmin");

  return await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
}
