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
    console.log("Logout clicked"); // Debugging line
    localStorage.removeItem("authToken");
    window.location.href = "/"   };
  return (
    <>
      <ul className="sidebar">
        <div>
          <li className="nav">
            <Link href="/Dashboard">
              <Image
                src="/upicon.svg"
                alt="Logo"
                className="logo2"
                width={50}
                height={50}
              />
              <p className="dash">Dashboard</p>
            </Link>{" "}
          </li>
        </div>
        <div>
          <li className="nav">
            <Link href="/conversationmapping">
              <Image
                src="/mapingi.svg"
                alt="Logo"
                className="logo2"
                width={50}
                height={50}
              />
              <p className="dash">Map Address</p>
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
