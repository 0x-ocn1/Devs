"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";

type UserRefInfo = {
  refCode: string;
  referrer: string | null;
  invites: number;
};

type RefLeaderboardItem = {
  address: string;
  invites: number;
  rank: number;
};

export default function ReferralPanel() {
  const { address, isConnected } = useAccount();
  const [inputCode, setInputCode] = useState("");
  const [userRef, setUserRef] = useState<UserRefInfo | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [leaderboard, setLeaderboard] = useState<RefLeaderboardItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!address) return;

    async function fetchData() {
      try {
        // Fetch user referral data
        const userRes = await fetch(`/api/referral?address=${address}`);
        if (userRes.ok) {
          const data = await userRes.json();
          if (data?.refCode) {
            setUserRef(data);
            setSubmitted(!!data.referrer || true); // mark as submitted if code exists
          }
        }

        // Fetch leaderboard (already filtered in backend)
        const boardRes = await fetch("/api/referral");
        if (boardRes.ok) {
          const list = await boardRes.json() as RefLeaderboardItem[];
          setLeaderboard(list);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load referral data.");
      }
    }

    fetchData();
  }, [address]);

  const copyCode = () => {
    if (userRef?.refCode) {
      navigator.clipboard.writeText(userRef.refCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const submitReferral = async () => {
    if (!inputCode.trim()) {
      setError("Please enter a referral code.");
      return;
    }
    if (!address) {
      setError("Wallet not connected.");
      return;
    }
    if (inputCode.trim().toLowerCase() === address.toLowerCase()) {
      setError("You cannot refer yourself.");
      return;
    }

    try {
      // Add referral first
      const res = await fetch("/api/referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "addReferral", code: inputCode.trim(), referred: address }),
      });
      const data = await res.json();

      if (res.ok && data?.referral) {
        // Then create user's own code
        const newCode = address.slice(2, 8).toUpperCase();
        const createRes = await fetch("/api/referral", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "create", code: newCode, owner: address }),
        });
        const createData = await createRes.json();

        if (createRes.ok && createData?.referral) {
          setUserRef({
            refCode: createData.referral.code,
            referrer: inputCode.trim(),
            invites: 0,
          });
          setSubmitted(true);
          setError(null);
        } else {
          setError(createData?.error || "Failed to create your code.");
        }
      } else {
        setError(data?.error || "Invalid or already used code.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError("Failed to submit referral.");
    }
  };

  if (!mounted) return null;

  if (!isConnected || !address) {
    return (
      <motion.div
        className="mt-8 text-center text-purple-300 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        🔒 Connect your wallet to see your referral dashboard.
      </motion.div>
    );
  }

  return (
    <motion.section
      className="w-full max-w-3xl bg-gradient-to-br from-[#1e0038] to-[#3d0069] border border-purple-700/60 p-6 rounded-2xl mt-10 shadow-xl backdrop-blur-md"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
        <h2 className="text-2xl font-bold text-purple-200 flex items-center gap-2">
          👥 Referral Dashboard
          {userRef && (
            <span className="text-xs md:text-sm px-2 py-1 bg-purple-800 rounded-full">
              Invites: {userRef.invites}
            </span>
          )}
        </h2>
        {userRef?.refCode && (
          <button
            onClick={copyCode}
            className="mt-2 md:mt-0 px-3 py-1 text-xs bg-yellow-400 hover:bg-yellow-500 text-black rounded font-semibold shadow"
          >
            {copied ? "Copied!" : `Code: ${userRef.refCode}`}
          </button>
        )}
      </div>

      <motion.p
        className="text-purple-300 text-xs mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Invite friends using your code. Your code is generated after you join someone else’s invite!
      </motion.p>

      {error && <p className="text-red-500 text-xs mb-3">⚠ {error}</p>}

      {!submitted ? (
        <motion.div
          className="flex flex-col md:flex-row gap-3 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <input
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Enter a referral code"
            className="flex-1 px-3 py-2 rounded-lg bg-[#1c0b2a] border border-purple-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={submitReferral}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 rounded-lg text-white font-semibold shadow"
          >
            Submit & Join
          </button>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-2 mb-4 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-green-400">
            ✅ Joined! You used: <span className="font-semibold text-white">{userRef?.referrer || "N/A"}</span>
          </p>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={userRef?.refCode || "N/A"}
              className="flex-1 px-3 py-2 rounded-lg bg-[#1c0b2a] border border-purple-800 text-white cursor-default"
            />
            <button
              onClick={copyCode}
              className="px-3 py-1 text-xs bg-yellow-400 hover:bg-yellow-500 text-black rounded font-semibold shadow"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="text-gray-400 text-xs">Share your code to earn invites!</p>
        </motion.div>
      )}

      <div className="mt-5">
        <h3 className="text-lg font-semibold text-purple-200 mb-2">🏆 Top Referrers</h3>
        <div className="grid grid-cols-3 text-purple-400 text-xs border-b border-purple-700 pb-1 mb-1 font-bold">
          <span>Rank</span>
          <span>User</span>
          <span>Invites</span>
        </div>
        <ul className="space-y-1 text-sm text-white">
          {leaderboard.map((u, i) => (
            <li key={i} className="grid grid-cols-3 py-1 border-b border-purple-900">
              <span>#{u.rank}</span>
              <span>{u.address ? `${u.address.slice(0, 6)}...${u.address.slice(-4)}` : "Unknown"}</span>
              <span>{u.invites}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.section>
  );
}

