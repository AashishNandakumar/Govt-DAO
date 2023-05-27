import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
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
import { providers, Contract } from "ethers";

function Home() {
  // state variables declaration
  const [loading, setLoading] = useState(false);
  // set the DAO treasury
  const [daoTreasury, setDaoTreasury] = useState("0");
  // set no of proposals
  const [proposals, setAllProposals] = useState([]);
  // const set balance of tokens
  const [tokenBalance, setTokenBalance] = useState(0);
  // Check if the wallet connected
  const [walletConnected, setWalletConnected] = useState(false);
  // set the owner
  const [owner, setIsOwner] = useState(false);
  //
  const [proposalId, setProposalId] = useState("");
  // hold the no of proposals:
  const [noOfProposals, setNoOfProposals] = useState("0");
  //
  const [selectedTab, setSelectedTab] = useState("");
  //
  const [title, setTitle] = useState("");
  //
  const [description, setDescription] = useState("");
  // An instance of web3Modal
  const web3modalRef = useRef();

  // begin components:
  // helper fxn
  async function getProviderOrSigner(Signer = false) {
    const provider = await web3modalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId != 11155111) {
      window.alert("Please change network to Sepolia!!!");
      throw new Error("Change network to sepolia");
    }

    if (Signer) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  }

  // helper fxn
  function getDaoContractInstance(providerOrSigner) {
    return new Contract(
      GOVT_DAO_CONTRACT_ADDRESS,
      GOVT_DAO_CONTRACT_ABI,
      providerOrSigner
    );
  }

  // helper fxn
  function getGDTokenContractInstance(providerOrSigner) {
    return new Contract(GD_TOKEN_ADDRESS, GD_TOKEN_ABI, providerOrSigner);
  }

  // Get the owner of DAO contract
  async function getDaoContractOwner() {
    try {
      const signer = await getProviderOrSigner(true);
      const contract = getDaoContractInstance(signer);

      const contractOwner = await contract.owner();

      const callerAddress = await signer.getAddress();

      if (contractOwner.toLowerCase() === callerAddress.toLowerCase()) {
        setIsOwner(true);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // helper fxn
  async function connectWallet() {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  }

  // withdraw ether from DAO
  async function withdrawETHFromDao() {
    try {
      const signer = await getProviderOrSigner(true);
      const daoContract = getDaoContractInstance(signer);

      const tx = await daoContract.withdrawETHFromDAO();
      setLoading(true);
      await tx.wait();
      setLoading(false);
      await getDaoTreasuryBalance();
    } catch (err) {
      console.error(err);
    }
  }

  async function getDaoTreasuryBalance() {
    try {
      const provider = await getProviderOrSigner();
      const contractBalance = await provider.getBalance(
        GOVT_DAO_CONTRACT_ADDRESS
      );
      setDaoTreasury(contractBalance.toString());
    } catch (err) {
      console.error(err);
    }
  }

  // get no of proposals
  async function getNoOfProposals() {
    try {
      const provider = await getProviderOrSigner();
      const daoContract = getDaoContractInstance(provider);
      const NoOfProposals = await daoContract.numProposals();
      setNoOfProposals(NoOfProposals.toString());
    } catch (err) {
      console.error(err);
    }
  }

  // get the user token balance
  async function getTokenBalance() {
    try {
      const signer = await getProviderOrSigner(true);
      const daoContract = getDaoContractInstance(signer);
      const noOfProposals = await daoContract.obj.balanceOf(
        signer.getAddress()
      );
      setTokenBalance(noOfProposals.toString());
    } catch (err) {
      console.error(err);
    }
  }

  // create a proposal
  async function createProposal() {
    try {
      const signer = await getProviderOrSigner(true);
      const daoContract = getDaoContractInstance(signer);
      const tx = await daoContract.createProposal(title, description);
      setLoading(true);
      await tx.wait();

      await getNoOfProposals();
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchProposalById(id) {
    try {
      const provider = await getProviderOrSigner();
      const daoContract = getDaoContractInstance(provider);
      const proposal = await daoContract.proposals(id);

      const parsedProposal = {
        id: proposal.id,
        title: proposal.title.toString(),
        desciption: proposal.desciption.toString(),
        deadline: new Date(parseInt(proposal.deadline.toString()) * 1000),
        yesVotes: proposal.yesVotes.toString(),
        noVotes: proposal.noVotes.toString(),
        executed: proposal.executed,
      };

      return parsedProposal;
    } catch (err) {
      console.error(err);
      window.alert(err.reason);
    }
  }

  // fetch all proposals
  async function fetchAllProposals() {
    try {
      const allProposals = [];
      for (let i = 0; i < noOfProposals; i++) {
        const proposal = await fetchProposalById(i);
        allProposals.push(proposal);
      }
      setAllProposals(allProposals);

      return allProposals;
    } catch (err) {
      console.error(err);
      window.alert(err.reason);
    }
  }

  // vote on a proposal
  async function voteOnProposal(proposalId, _vote) {
    try {
      const signer = await getProviderOrSigner(true);
      const daoContract = getDaoContractInstance(signer);

      let vote = _vote === "YES" ? 0 : 1;
      const tx = await daoContract.voteOnProposal(proposalId, vote);
      setLoading(true);
      await tx.wait();
      setLoading(false);
      await fetchAllProposals();
    } catch (err) {
      console.error(err);
      window.alert(err.reason);
    }
  }

  // execute the proposal
  async function executeProposal(proposalId) {
    try {
      const signer = await getProviderOrSigner(true);
      const daoContract = getDaoContractInstance(signer);

      const tx = await daoContract.executeProposal(proposalId);
      setLoading(true);
      await tx.wait();
      setLoading(false);

      await fetchAllProposals();
      await getDaoTreasuryBalance();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (!walletConnected) {
      web3modalRef.current = new Web3Modal({
        network: "sepolia",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet().then(() => {
        getDaoTreasuryBalance(),
          getTokenBalance(),
          getNoOfProposals(),
          getDaoContractOwner();
      });
    }
  }, [walletConnected]);

  useEffect(() => {
    if (selectedTab === "View Proposals") {
      fetchAllProposals();
    }
  }, [selectedTab]);

  // display the appropriate tabs whenver possible
  function renderTabs() {
    if (selectedTab === "Create Proposal") {
      return renderCreateProposalsTab();
    } else if (selectedTab === "View Proposals") {
      return renderViewProposalsTab();
    }
    return null;
  }

  // render a create proposal tabs
  function renderCreateProposalsTab() {
    if (loading) {
      return (
        <div className={styles.description}>Waiting for transaction...</div>
      );
    } else if (tokenBalance === 0) {
      return (
        <div className={styles.description}>
          You do not own any GD Tokens. <br />
          {/* Bold text */}
          <b>You cannot create or vote on proposals!!!</b>
        </div>
      );
    } else {
      return (
        <div>
          <label>Enter Title: </label>
          <input
            className={styles.input}
            placeholder="Title"
            type="string"
            onChange={(e) => setTitle(e.target.value)}
          />
          <br />
          <label>Enter Description: </label>
          <input
            className={styles.input}
            placeholder="Title"
            type="string"
            onChange={(e) => setDescription(e.target.value)}
          />
          <br />
          <button className={styles.button3} onClick={createProposal}>
            Create
          </button>
          <br />
        </div>
      );
    }
  }

  // render a view proposals tab
  function renderViewProposalsTab() {
    if (loading) {
      return (
        <div className={styles.description}>Waiting for transaction...</div>
      );
    } else if (proposals.length === 0) {
      return (
        <div className={styles.description}>
          <b>No proposals have been created yet!</b>
        </div>
      );
    } else {
      return (
        <div>
          {proposals.map((p, index) => (
            <div key={index} className={styles.proposalCard}>
              <p>Proposal ID: {p.proposalId}</p>
              <p>Title: {p.title}</p>
              <p>Description: {p.description}</p>
              <p>Deadline: {p.deadline.toLocaleString()}</p>
              <p>YES votes: {p.yesVotes}</p>
              <p>NO Votes: {p.noVotes}</p>
              <p>Executed?: {p.executed.toString()}</p>
              {p.deadline.getTime() > Date.now() && !p.executed ? (
                <div className={styles.flex}>
                  <button
                    className={styles.button2}
                    onClick={() => voteOnProposal(p.proposalId, "YES")}
                  >
                    Vote YES
                  </button>
                  <button
                    className={styles.button2}
                    onClick={() => voteOnProposal(p.proposalId, "NO")}
                  >
                    Vote NO
                  </button>
                </div>
              ) : p.deadline.getTime() < Date.now() && !p.executed ? (
                <div className={styles.flex}>
                  <button
                    className={styles.button2}
                    onClick={() => executeProposal(p.proposalId)}
                  >
                    Execute Proposal {p.YesVotes > p.NoVotes ? "(YES)" : "(NO)"}
                  </button>
                </div>
              ) : (
                <div className={styles.description}>
                  <b>Proposal Executed</b>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }
  }

  return (
    <div>
      <Head>
        <title>Noire DAO</title>
        <meta name="description" content="CryptoDevs DAO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Adding a ROUTER  */}
      {/* <header>
        <Link href="/help">
          <button className={styles.button}>HELP</button>
        </Link>
      </header> */}
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Noire 3.0</h1>
          <div className={styles.description}>Welcome to the future</div>
          <div className={styles.description}>
            Your GD Token Balance: <b>{tokenBalance}</b>
            <br />
            Treasury Balance: <b>{formatEther(daoTreasury)} ETH</b>
            <br />
            Total Number of Proposals: <b>{noOfProposals}</b>
          </div>
          <div className={styles.flex}>
            <button
              className={styles.button}
              onClick={() => setSelectedTab("Create Proposal")}
            >
              Create Proposal
            </button>
            <button
              className={styles.button}
              onClick={() => setSelectedTab("View Proposals")}
            >
              View Proposals
            </button>
          </div>
          {renderTabs()}
          {/* display withdraw button if the address is owner */}
          {owner ? (
            <div>
              {loading ? (
                <button className={styles.button}>Loading...</button>
              ) : (
                <button className={styles.button} onClick={withdrawETHFromDao}>
                  Withdraw DAO ETH
                </button>
              )}
            </div>
          ) : (
            ""
          )}
        </div>
        <div>
          <img className={styles.image} src="/dao-2.webp" />
        </div>
      </div>
      <footer className={styles.footer}>Made with &#10084; by Noire</footer>
    </div>
  );
}
export default Home;
