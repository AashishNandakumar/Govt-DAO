import Head from "next/head";
import Image from "next/image";
import styles from "../styles/JoinUs.module.css";
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

function JoinUs() {
  //
  const web3modalRef2 = useRef();
  //
  const [walletConnected2, setWalletConnected2] = useState(false);
  //
  const [loading2, setLoading2] = useState(false);
  //
  async function getProviderOrSigner(Signer = true) {
    const provider = await web3modalRef2.current.connect();
    const web3provider = new providers.Web3Provider(provider);

    const { chainId } = await web3provider.getNetwork();
    if (chainId !== 11155111) {
      window.alert("Please connect to Sepolia Network");
      throw new Error("Please connect to Sepolia");
    }
    if (Signer) {
      const signer = web3provider.getSigner();
      return signer;
    }
    return web3provider;
  }

  function getGDTokenContractInstance(providerOrSigner) {
    return new Contract(GD_TOKEN_ADDRESS, GD_TOKEN_ABI, providerOrSigner);
  }

  async function MintToken() {
    try {
      const signer = await getProviderOrSigner(true);
      const GDcontract = getGDTokenContractInstance(signer);

      const tx = await GDcontract.mint({
        value: ethers.utils.parseEther("0.00001"),
      });
      setLoading2(true);
      await tx.wait();
      setLoading2(false);
      window.alert("Tokens Minted!!, plese proceed back to HOME");
    } catch (err) {
      console.error(err);
    }
  }
  // helper fxn
  async function connectWallet() {
    try {
      await getProviderOrSigner();
      setWalletConnected2(true);
    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    if (!walletConnected2) {
      web3modalRef2.current = new Web3Modal({
        network: "sepolia",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected2]);

  // useEffect(() => {}, [loading2]);
  return (
    <div className={styles.Top}>
      <Head>
        <title>Noire 3.0 </title>
        {/* Fill later */}
        <meta name="description" content="CryptoDevs DAO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <div className={styles.header}>
          {/* <button className={styles.radiobox}>.</button> */}
          {/* <p className={styles.radioboxDesc}>Connected</p> */}
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
      <div>
        <div className={styles.main}>
          <div className={styles.contents}>
            <h1 className={styles.title}>Why Join Us?</h1>
            <div className={styles.innerContents}>
              <p>
                <b className={styles.innerValue}>Transparent Decision-Making</b>{" "}
                - Our governance framework ensures transparency in the
                decision-making process.{" "}
              </p>
              <p>
                <b className={styles.innerValue}>Equal Participation</b> - We
                believe in the power of every token holder's voice. Our
                governance framework ensures that all token holders have an
                equal opportunity to participate in the decision-making process.
              </p>
              <p>
                <b className={styles.innerValue}>Community Engagement</b> -
                Joining us means becoming a part of a vibrant and engaged
                community.{" "}
              </p>
              <p>
                <b className={styles.innerValue}>Impactful Decisions</b> - Your
                participation in our governance mechanisms allows you to
                directly contribute to important decisions that impact the
                organization.
              </p>
            </div>
            <div className={styles.endingPhrase}>
              <h2>Don't waste anymore time, join us now!</h2>
              <h2></h2>
            </div>
          </div>
          <button className={styles.Bodybutton} onClick={MintToken}>
            Join Us
          </button>
          {/* <button className={styles.Bodybutton}>Already a Member</button> */}
        </div>
      </div>
      <footer className={styles.footer}>
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
      </footer>
    </div>
  );
}

export default JoinUs;
