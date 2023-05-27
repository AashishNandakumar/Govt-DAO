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

function ViewField() {
  return (
    <div>
      <Head>
        <title>Noire DAO</title>
        <meta name="description" content="CryptoDevs DAO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <div className={styles.header}>
          <button className={styles.radiobox}>.</button>

          <Link href="/">
            <button className={styles.Headerbutton}>HOME</button>
          </Link>
          <Link href="/joinUs">
            <button className={styles.Headerbutton}>JOIN US</button>
          </Link>
          <Link href="/view">
            <button className={styles.Headerbutton}>VIEW</button>
          </Link>
        </div>
      </header>
      <div className={styles.main}>
        <div className={styles.contents}>
          <h1 className={styles.title}>View our recent proposals</h1>
        </div>
      </div>

      <footer className={styles.footer}>Made with &#10084; by Noire</footer>
    </div>
  );
}
export default ViewField;
