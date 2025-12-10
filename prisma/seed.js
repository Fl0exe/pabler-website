import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

async function main() {
  const setting = await prisma.appSetting.findFirst();
  if (!setting) {
    await prisma.appSetting.create({
      data: { allowSignup: true },
    });
    console.log("AppSetting created with allowSignup=true");
  }

  const userCount = await prisma.user.count();
  if (userCount <= 0) {
    await prisma.user.create({
      data: {
        email: "admin@admin.org",
        password: await bcrypt.hash("admin", 10),
        role: "admin",
      },
    });
    console.log("Default admin user has been created");
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
