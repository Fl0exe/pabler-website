import { PrismaClient } from "../generated/prisma_client/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const setting = await prisma.AppSetting.findFirst();
  if (!setting) {
    await prisma.AppSetting.create({
      data: { allowSignup: true },
    });
    console.log("AppSetting created with allowSignup=true");
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
