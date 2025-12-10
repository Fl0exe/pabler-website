"use client";

import { useEffect, useState } from "react";
import styles from "./navbar.module.css";
import Link from "next/link";
import items from "@/config/navbar.items.json";
import Hamburger from "@/public/icons/hamburger-menu.svg";
import Image from "next/image";
import SignIn from "./signin";
import { SessionProvider } from "next-auth/react";

export default function Navbar() {
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);
  const [isToggleButtonVisible, setIsToggleButtonVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsNavbarVisible(window.innerWidth > 999);
      setIsToggleButtonVisible(window.innerWidth <= 999);

      const handleResize = () => {
        setIsNavbarVisible(window.innerWidth > 999);
        setIsToggleButtonVisible(window.innerWidth <= 999);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const toggleNavbar = () => {
    setIsNavbarVisible(!isNavbarVisible);
  };

  return (
    <div>
      {isToggleButtonVisible && (
        <button
          className={`button ${styles.navbarButton}`}
          onClick={toggleNavbar}
        >
          <Hamburger />
        </button>
      )}
      {isNavbarVisible && (
        <div
          className={`${styles.navbar} ${isToggleButtonVisible ? styles.floatingNavbar : ""}`}
        >
          <div className={styles.navbarContainer}>
            {items.map((item) => (
              <NavbarItem key={item.name} href={item.path}>
                {item.name}
              </NavbarItem>
            ))}
          </div>
          <SessionProvider>
            <SignIn />
          </SessionProvider>
        </div>
      )}
    </div>
  );
}

function NavbarItem({ href, children }) {
  if (href === "/" && children === "Logo") {
    return (
      <Link href={href}>
        <div className={styles.logo}>
          <Image
            src="/images/pabler.png"
            alt="Pabler"
            width={125}
            height={125}
            className={styles.logo}
          />
        </div>
      </Link>
    );
  }

  return (
    <Link className={styles.navbarItem} href={href}>
      {children}
    </Link>
  );
}
