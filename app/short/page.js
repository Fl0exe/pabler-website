import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@/generated/prisma_client/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { redirect } from "next/navigation";
import { createShortLink, editLink, deleteLink } from "@/lib/links";
import styles from "./page.module.css";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");

  // ---------------- Server Actions ----------------
  async function handleCreate(formData) {
    "use server";
    const url = formData.get("url")?.trim();
    const short = formData.get("shortUrl")?.trim();
    if (!url) return;

    await createShortLink(session.user.id, url, short || undefined);
    redirect("/short");
  }

  async function handleEdit(formData) {
    "use server";
    const id = formData.get("id");
    const url = formData.get("url")?.trim();
    const short = formData.get("shortUrl")?.trim();
    if (!url) return;

    await editLink(session, id, url, short || undefined);
    redirect("/short");
  }

  async function handleDelete(formData) {
    "use server";
    const id = formData.get("id");
    await deleteLink(session, id);
    redirect("/short");
  }

  // ---------------- Load data ----------------
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { links: true },
  });

  const links = user.links || [];

  return (
    <main className={styles.container}>
      {/* --- New Link --- */}
      <form action={handleCreate} className={styles.mainForm}>
        <input name="shortUrl" placeholder="Short (optional)" />
        <input name="url" placeholder="https://example.com" required />
        <button type="submit">Crunch it!</button>
      </form>

      {/* --- List Links --- */}
      <ul className={styles.linkList}>
        {links.map((l) => (
          <li key={l.id} className={styles.link}>
            {/* Edit Form */}
            <form action={handleEdit} className={styles.editForm}>
              <input type="hidden" name="id" value={l.id} />
              <span>
                <a
                  href={`/s/${l.shortCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {process.env.NEXT_PUBLIC_BASE_URL + "/s/"}
                </a>
                <input name="shortUrl" defaultValue={l.shortCode} />
              </span>
              {" → "}
              <input name="url" defaultValue={l.url} />
              <button type="submit">Edit</button>
            </form>

            {/* Delete Form */}
            <form action={handleDelete} className={styles.deleteForm}>
              <input type="hidden" name="id" value={l.id} />
              <button type="submit" className={styles.scaryButton}>
                Delete
              </button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}
