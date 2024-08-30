"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Home() {
  const Base_Url = process.env.NEXT_PUBLIC_BASE_URL;

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${Base_Url}users/login`, {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        router.push("/Dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginItem}>
        <h1 className={`text-center ${styles.fontLogin}`}>
          Login to Your Account
        </h1>

        <h5 className={`text-center text-secondary mt-4 ${styles.fontCommon}`}>
          Welcome to the Admin Portal.
        </h5>
        <h5 className={`text-center text-secondary ${styles.fontCommon}`}>
          Please log in to access and manage your system settings and data
          securely.
        </h5>
      </div>
      <div className={`${styles.textBox}`}>
        <div className={styles.inputBoxLeft}>
          <div>
            <input
              type="text"
              aria-label="Email"
              className={`form-control px-3 py-3 ${styles.textBorder}`}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress} // Add this line
            />
          </div>
          <div>
            <input
              type="password"
              aria-label="Password"
              className={`form-control px-3 py-3 mt-3 ${styles.textBorder}`}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress} // Add this line
            />
          </div>
          {error && <div className="text-danger mt-3">{error}</div>}
          <div>
            <button
              className={`btn btn-outline-secondary px-3 py-3 mt-3 text-dark ${styles.loginButton}`}
              onClick={handleLogin}
            >
              <span className="d-flex-column">
                <span className={styles.loginSet}>Login to Your Account</span>
                <span className={styles.arrow}>
                  <i>
                    <Image
                      src="/arrow.png"
                      alt="arrow img"
                      className="logo1"
                      width={25}
                      height={20}
                    />
                  </i>
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
