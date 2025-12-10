import { prisma } from "@/lib/prisma";

const validTlds = [
  "com",
  "org",
  "net",
  "io",
  "dev",
  "app",
  "edu",
  "gov",
  "de",
  "fr",
  "uk",
  "nl",
  "info",
  "co",
];

function normalizeUrl(url) {
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  return url;
}

function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    const tld = parsed.hostname.split(".").pop().toLowerCase();
    return validTlds.includes(tld);
  } catch {
    return false;
  }
}

export async function createShortLink(
  userId,
  rawUrl,
  shortCode = Math.random().toString(36).substring(2, 8),
) {
  const url = normalizeUrl(rawUrl);
  if (!isValidUrl(url)) throw new Error("Invalid URL");

  return await prisma.link.create({
    data: { url, shortCode, userId },
  });
}

export async function editLink(session, id, newUrl, newShort) {
  const link = await prisma.link.findUnique({ where: { id } });
  if (!link) throw new Error("Link not found");

  if (
    session.user.id !== "0" &&
    link.userId !== session.user.id &&
    session.user.role !== "admin"
  ) {
    throw new Error("Forbidden");
  }

  const url = normalizeUrl(newUrl);
  if (!isValidUrl(url)) throw new Error("Invalid URL");

  return await prisma.link.update({
    where: { id },
    data: { url, shortCode: newShort || link.shortCode },
  });
}

export async function deleteLink(session, id) {
  const link = await prisma.link.findUnique({ where: { id } });
  if (!link) throw new Error("Link not found");

  if (
    session.user.id !== "0" &&
    link.userId !== session.user.id &&
    session.user.role !== "admin"
  ) {
    throw new Error("Forbidden");
  }

  return await prisma.link.delete({ where: { id } });
}
