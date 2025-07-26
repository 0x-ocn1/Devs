"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAccount, useDisconnect, useChainId } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

const CONTRACT_ADDRESS = "0x930E93872F95f3A78A23Ed7F26F6fCE4CC4A5528";
const CONTRACT_ABI = ["function claim() external payable"];
const TOTAL_TOKENS = 49000000;
const ETHERSCAN_API_KEY = "HQT9UMMZSQD6MWSY2MIJQR9JJ16CX1W7TV";

const apiBaseUrls: { [key: string]: string } = {
  ethereum: "https://api.etherscan.io/api",
  arbitrum: "https://api.arbiscan.io/api",
  polygon: "https://api.polygonscan.com/api",
  bsc: "https://api.bscscan.com/api",
};

export default function ClaimWRavenPage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();

  const [claimed, setClaimed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [claimedCount, setClaimedCount] = useState(1000000); // Replace with real backend if needed
  const [eligible, setEligible] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  const [showQuestLink, setShowQuestLink] = useState(false);

  const progress = Math.min(100, (claimedCount / TOTAL_TOKENS) * 100);

  const networkName =
    chainId === 42161
      ? "Arbitrum One"
      : chainId === 1
      ? "Ethereum Mainnet"
      : chainId
      ? `Chain ID: ${chainId}`
      : "Unknown";

  async function checkEligibility() {
    if (!address) return;

    setCheckingEligibility(true);
    setMessage("🔍 Checking eligibility...");

    try {
      const chains = ["ethereum", "arbitrum", "polygon", "bsc"];
      let isEligible = false;

      for (const chain of chains) {
        const url = `${apiBaseUrls[chain]}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data?.result?.length >= 10) {
          isEligible = true;
          break;
        }
      }

      if (isEligible) {
        setEligible(true);
        setMessage("✅ You're eligible to claim!");
      } else {
        setMessage("❌ Not enough transactions on supported chains.");
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to check eligibility.");
    } finally {
      setCheckingEligibility(false);
    }
  }

  async function claimTokens() {
    if (!address || !eligible) {
      setMessage("❌ You must be eligible before claiming.");
      return;
    }

    try {
      setLoading(true);
      setMessage("⏳ Claiming tokens...");

      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.claim({ value: ethers.parseEther("0.000025") });
      await tx.wait();

      await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });

      setClaimed(true);
      setClaimedCount((prev) => prev + 1000);
      setShowQuestLink(true);
      setMessage("✅ Successfully claimed!");
    } catch (e: any) {
      console.error(e);
      setMessage("❌ Claim failed.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  }

  return (
    <div
      className="flex flex-col min-h-screen text-white bg-cover bg-center"
      style={{ backgroundImage: 'url("https://i.postimg.cc/Y2s64bFp/Raven-1.png")' }}
    >
      <Navbar />

      <main className="flex-1 px-6 pt-24 flex flex-col items-center relative overflow-hidden">
        <motion.h1
          className="text-5xl md:text-6xl font-black text-purple-400 mb-4 drop-shadow"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Claim Your wRaven Tokens
        </motion.h1>

        <p className="text-center text-base md:text-lg text-purple-100 mb-8 leading-relaxed bg-purple-800/20 p-4 rounded-xl">
          🪂 Connect your wallet, check if you’re eligible, and claim wRaven! Eligibility is based on your activity on Arbitrum, Polygon, BNB, and Ethereum, no approvals needed, just one interaction. wRaven will be redeemable for $RAVEN at TGE <br />
          Progress: <span className="text-yellow-300 font-semibold">{Math.floor(progress)}%</span>
        </p>

        {isConnected ? (
          <>
            <div className="text-sm text-white/90 mb-6 flex flex-wrap items-center gap-3 justify-center font-medium">
              <span className="bg-black/50 px-3 py-1 rounded border border-purple-600">
                <strong className="text-purple-300">Connected:</strong> {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <span className="bg-black/50 px-3 py-1 rounded border border-purple-600">
                <strong className="text-purple-300">Network:</strong> {networkName}
              </span>
              <button
                onClick={() => disconnect()}
                className="text-sm font-semibold text-red-400 underline hover:text-red-300"
              >
                Disconnect
              </button>
            </div>

            <button
              onClick={checkEligibility}
              disabled={checkingEligibility || eligible}
              className={`mb-4 px-6 py-3 rounded font-semibold bg-blue-600 hover:bg-blue-700 ${
                eligible ? "bg-green-600 cursor-not-allowed" : ""
              }`}
            >
              {checkingEligibility ? "⏳ Checking..." : eligible ? "✅ Eligible" : "🔍 Check Eligibility"}
            </button>

            <button
              onClick={claimTokens}
              disabled={loading || claimed || !eligible}
              className={`w-52 py-3 rounded-md font-semibold transition ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : claimed
                  ? "bg-green-600"
                  : !eligible
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {loading ? "⏳ Claiming..." : claimed ? "✅ Claimed!" : "🎁 Claim 1000 wRaven"}
            </button>

            {message && (
              <p className="mt-4 text-center text-sm font-semibold text-yellow-300 animate-pulse">{message}</p>
            )}

            <div className="w-full max-w-md bg-gray-700 rounded-full h-3 mt-6 overflow-hidden">
              <div
                className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-center mt-1">{Math.floor(progress)}% of tokens claimed</p>

            {showQuestLink && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-8 bg-purple-900/30 p-6 rounded-xl text-center"
              >
                <h3 className="text-lg font-bold text-yellow-300 mb-2">🎯 Earn More Rewards!</h3>
                <p className="text-sm text-purple-200 mb-3">Your journey has just started. Join the quest & earn more wRaven points.</p>
                <a
                  href="https://raven-rush.org/main-quest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-5 py-2 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-400"
                >
                  Start Pre-Testnet Quest
                </a>
              </motion.div>
            )}
          </>
        ) : (
          <div className="mt-6">
            <ConnectButton />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
