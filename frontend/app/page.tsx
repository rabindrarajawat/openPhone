"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';



export default function Home() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.loginItem}>
        <h1 className={`text-center ${styles.fontLogin}`}>Login to Your Account</h1>

        <h5 className={`text-center text-secondary mt-4 ${styles.fontCommon}`}>
          "Welcome to the Admin Portal.{" "}
        </h5>
        <h5 className={`text-center text-secondary ${styles.fontCommon}`}>
          Please log in to access and manage your system's settings and data
          securely."
        </h5>{" "}
      </div>
      <div
        className={`d-flex justify-content-between align-items-center ${styles.textBox}`}
      >
        <div className={styles.inputBoxLeft}>
          <div className="">
            <input
              type="text"
              aria-label="First name"
              className={`form-control px-3 py-3 ${styles.textBorder}`}
              placeholder="Email"
            />
          </div>
          <div className=" ">
            <input
              type="text"
              aria-label="First name"
              className={`form-control px-3 py-3 mt-3  ${styles.textBorder}`}
              placeholder="Password"
            />
          </div>
          <div className="">
            <button
              className={`btn btn-outline-secondary  px-3 py-3 mt-3 text-dark ${styles.loginButton}`}
              onClick={() => router.push("/Dashboard")}
            >
              {" "}
              Login to Your Account
            </button>
          </div>
        </div>
        <div>

        </div>
      </div>
    </div>
  );
}
