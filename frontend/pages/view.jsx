import Head from "next/head";
import Image from "next/image";
import styles from "../styles/View.module.css";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import Web3Modal from "web3modal";
import {
  GOVT_DAO_CONTRACT_ADDRESS,
  GOVT_DAO_CONTRACT_ABI,
  GD_TOKEN_ADDRESS,
  GD_TOKEN_ABI,
} from "../Constants/pages";
import { formatEther } from "ethers/lib/utils";
import { providers, Contract, ethers, utils } from "ethers";
import Home from "./index.jsx";
// import React from "react";
// import styled from "styled-components";

function ViewField() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform form submission logic here
  };

  return (
    <div className={styles.Top}>
      <Head>
        <title>Noire DAO</title>
        <meta name="description" content="CryptoDevs DAO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <div className={styles.header}>
          {/* <button className={styles.radiobox}>.</button> */}

          <Link href="/">
            <button className={styles.Headerbutton}>HOME</button>
          </Link>
          <Link href="/joinUs">
            <button className={styles.Headerbutton}>JOIN US</button>
          </Link>
          <Link href="/view">
            <button className={styles.Headerbutton}>CONTACT US</button>
          </Link>
        </div>
      </header>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Get in touch with us!</h1>
        </div>
        <container>
          <form onSubmit={handleSubmit} className={styles.contents}>
            <label className={styles.labeling}>Username:</label>
            <input
              className={styles.inputs}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label className={styles.labeling}>Email:</label>
            <input
              className={styles.inputs}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className={styles.labeling}>Password:</label>
            <input
              className={styles.inputs}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label className={styles.labeling}>Confirm Password:</label>
            <input
              className={styles.inputs}
              type="password"
              value={password}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="submit" className={styles.submitButton}>
              Register
            </button>
          </form>
        </container>
        <div className={styles.endingPhrase}>
          Register, and we will mail you a confirmation link!
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.innerFooter}>
          {/* <h2 className={styles.footerText1}>NOIRE</h2> */}
          <h3 className={styles.footerText1}>
            Copyright &copy; 2023 Noire, Inc.
          </h3>
          <h4 className={styles.footerText1}>
            Legal Stuff | Privacy Policy | Security | Website Accessibility
          </h4>
        </div>
      </footer>
    </div>
  );
}
export default ViewField;
