import React from "react";
import styles from "./projects.module.css";
import globs from "@/app/page.module.css";
import { Gitlab } from "@gitbeaker/rest";
import Card from "@/components/card/card";
import { unstable_noStore as noStore } from "next/cache";

export default async function Projects() {
  noStore();

  const PLACEHOLDER_AVATAR = "/images/gl-placeholder.png";
  const api = new Gitlab({
    host: "https://gitlab.pabler.de",
  });
  try {
    let projects = await api.Projects.all({ maxPages: 1, perPage: 6 });

    return (
      <div className={globs.center}>
        {projects.map((project) => (
          <a href={project.web_url} key={project.id}>
            <Card topImage={project.avatar_url || PLACEHOLDER_AVATAR}>
              <div className="card-content">
                <h3>{project.name}</h3>
                <p className={styles.description}>
                  {project.description || "No description available."}
                </p>
              </div>
            </Card>
          </a>
        ))}
      </div>
    );
  } catch (error) {
    return (
      <div>
        Error fetching GitLab Projects
        <div>{error.message}</div>
      </div>
    );
  }
}
