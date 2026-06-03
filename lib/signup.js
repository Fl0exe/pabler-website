"use server";

import { PrismaClient } from "@/generated/prisma_client/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcrypt";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export async function signupUser(email, password) {
  const setting = await prisma.appSetting.findFirst();
  if (!setting?.allowSignup) throw new Error("Signups disabled");

  if ((await prisma.User.count({ where: { email } })) > 0)
    throw new Error("User Exists");

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.User.create({
    data: { email, password: hashed },
  });

  return user;
}
