"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import labels from "@/config/progressLabels.json";

export default function Progress() {
  function getRandomLabel(prevLabel) {
    let newLabel;
    do {
      newLabel = labels[Math.floor(Math.random() * labels.length)];
    } while (newLabel === prevLabel);
    return newLabel;
  }

  const [progress, setProgress] = useState(0);
  const [label, setLabel] = useState(getRandomLabel(null));

  useEffect(() => {
    let timeoutId;

    const updateBar = () => {
      setProgress((prev) => {
        if (prev >= 100) {
          setLabel((prevLabel) => getRandomLabel(prevLabel));
          return 0;
        }
        const next = Math.min(prev + Math.random() * 10, 100);
        return next;
      });

      const nextDelay = 200 + Math.random() * 800;
      timeoutId = setTimeout(updateBar, nextDelay);
    };

    updateBar();
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <main className={styles.container}>
      <div className={styles.progressbar}>
        <div className={styles.barfill} style={{ width: `${progress}%` }}></div>
      </div>
      <span key={label} className={styles.label}>
        {label}
      </span>
    </main>
  );
}
