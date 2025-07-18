"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

type UserRefInfo = {
  refCode: string;
  referrer: string;
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
  const [mounted, setMounted] = useState(false); // ✅ added

  useEffect(() => {
    setMounted(true); // ✅ mark component as mounted
  }, []);

  useEffect(() => {
    if (!address) return;

    async function fetchData() {
      try {
        const userRes = await fetch(`/api/referral?address=${address}`);
        if (userRes.ok) {
          const data = await userRes.json();
          if (data?.refCode) {
            setUserRef(data);
            setSubmitted(!!data.referrer);
          }
        }

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

    try {
      const res = await fetch("/api/referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAddress: address, referralCode: inputCode.trim() }),
      });

      const data = await res.json();

      if (res.ok && data?.refCode) {
        setUserRef(data);
        setSubmitted(true);
        setError(null);
      } else if (data?.error) {
        setError(data.error);
      } else {
        setError("Invalid or already used code.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError("Failed to submit referral.");
    }
  };

  if (!mounted) return null; // ✅ avoid SSR mismatch / hydration error

  if (!isConnected || !address) {
    return (
      <div className="mt-8 text-center text-purple-300 text-sm">
        🔒 Connect your wallet to see referrals.
      </div>
    );
  }

  return (
    <section className="w-full max-w-3xl bg-black/60 border border-purple-700 p-6 rounded-lg mt-10 shadow-xl">
      <h2 className="text-xl font-bold text-purple-300 mb-4">
        👥 Referral Dashboard
        {userRef && (
          <span className="ml-2 text-sm text-purple-400">Invites: {userRef.invites}</span>
        )}
      </h2>

      {error && <p className="text-red-500 text-sm mb-2">⚠ {error}</p>}

      {!submitted ? (
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Enter a referral code"
            className="flex-1 px-3 py-2 rounded bg-[#120422] border border-purple-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={submitReferral}
            className="px-4 py-2 bg-purple-700 hover:bg-purple-800 rounded text-white font-semibold"
          >
            Submit
          </button>
        </div>
      ) : (
        <div className="space-y-2 mb-4 text-sm">
          <p className="text-green-400">
            ✅ Referral submitted! You used: <span className="font-bold text-white">{userRef?.referrer}</span>
          </p>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={userRef?.refCode || ""}
              className="flex-1 px-3 py-2 rounded bg-[#120422] border border-purple-800 text-white"
            />
            <button
              onClick={copyCode}
              className="px-3 py-1 text-sm bg-yellow-400 hover:bg-yellow-500 text-black rounded"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="text-gray-400 text-xs">Share your code to earn invite points!</p>
        </div>
      )}

      <div className="mt-4">
        <h3 className="text-lg font-semibold text-purple-200 mb-2">🏆 Leaderboard</h3>
        <div className="grid grid-cols-3 text-purple-400 text-xs border-b border-purple-800 pb-1 mb-1 font-bold">
          <span>Rank</span>
          <span>User</span>
          <span>Invites</span>
        </div>
        <ul className="space-y-1 text-sm text-white">
          {leaderboard.map((u, i) => (
            <li key={i} className="grid grid-cols-3 py-1 border-b border-purple-900">
              <span>#{u.rank}</span>
              <span>{u.address.slice(0, 6)}...{u.address.slice(-4)}</span>
              <span>{u.invites}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
