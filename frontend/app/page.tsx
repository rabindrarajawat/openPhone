"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

import 'bootstrap/dist/js/bootstrap.bundle.min';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:8000/users/login", {
        email,
        password
      });
  
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        router.push("/Dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginItem}>
        <h1 className={`text-center ${styles.fontLogin}`}>Login to Your Account</h1>

        <h5 className={`text-center text-secondary mt-4 ${styles.fontCommon}`}>
          "Welcome to the Admin Portal."
        </h5>
        <h5 className={`text-center text-secondary ${styles.fontCommon}`}>
          Please log in to access and manage your system's settings and data securely."
        </h5>
      </div>
      <div className={`d-flex justify-content-between align-items-center ${styles.textBox}`}>
        <div className={styles.inputBoxLeft}>
          <div>
            <input
              type="text"
              aria-label="Email"
              className={`form-control px-3 py-3 ${styles.textBorder}`}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            />
          </div>
          {error && (
            <div className="text-danger mt-3">
              {error}
            </div>
          )}
          <div>
            <button
              className={`btn btn-outline-secondary px-3 py-3 mt-3 text-dark  ${styles.loginButton}`}
              onClick={handleLogin}
            >
              <span className={styles.textLogin}>Login to Your Account</span>
            </button>
          </div>
        </div>
        <div>
        </div>
      </div>
    </div>
  );
}
