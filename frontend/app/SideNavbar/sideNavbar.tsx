"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

import { useRouter } from "next/navigation";
import "./SideNavbar.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const SideBar = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Remove the token from local storage
    localStorage.removeItem("authToken");

    // Redirect to the home page
    router.push("/");
  };

  return (
    <>
      <ul className="sidebar">
        <div>
          <li className="nav">
            <Image
              src="/upicon.svg"
              alt="Logo"
              className="logo2"
              width={50}
              height={50}
            />
            <Link href="/Dashboard">
              <p className="dash">Dashboard</p>
            </Link>{" "}
          </li>
        </div>
        <div>
          <li className="nav">
          <Image
              src="/mapingi.svg"
              alt="Logo"
              className="logo2"
              width={50}
              height={50}
            />
            <Link href="/conversationmapping">
              <p className="dash">Mapped Add</p>
            </Link>
          </li>
        </div>

        <div className="log">
          <div onClick={handleLogout}>Log out</div>
        </div>
      </ul>
    </>
  );
};

export default SideBar;
