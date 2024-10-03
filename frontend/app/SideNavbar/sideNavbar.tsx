"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

import { useRouter } from "next/navigation";
import styles from "./SideNavbar.module.css"; 
import "bootstrap-icons/font/bootstrap-icons.css";

const SideBar = () => {
  const router = useRouter();

  const handleLogout = () => {
    console.log("Logout clicked");
    localStorage.removeItem("authToken");
    window.location.href = "/";
  };



  return (
    <>
      <ul className={styles.sidebar}>
        <div>
          <div className={styles.nav}>
            <Link href="/Dashboard">
              <Image
                src="/upicon.svg"
                alt="Logo"
                className={`${styles.logo2}`}
                width={50}
                height={50}
              />
              <p className={`${styles.dash}`}>Dashboard</p>
            </Link>
          </div>
        </div>
        <div>
          <div className={styles.nav}>
            <Link href={'/conversationmapping'}>
            
            <Image
              src="/mapingi.svg"
              alt="Logo"
              className={styles.logo2}
              width={50}
              height={50}
            />
            <p className={styles.dash}>Map Address</p>
            </Link>
          </div>
        </div>

        <div className={styles.log}>
          <div onClick={handleLogout}>Log out</div>
        </div>
      </ul>
    </>
  );
};

export default SideBar;
