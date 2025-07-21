// src/app/main-quest/page.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useDisconnect, useChainId } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ReferralPanel from "./ReferralPanel";
import SocialQuestSection from "./SocialQuestSection";



const CONTRACT_ADDRESS = "0xf9A82430E15429fD377F513A83F6eF353cf22629";
const CONTRACT_ABI = [
  "function checkIn() external payable",
  "function boost() external payable"
];

type LeaderboardUser = {
  address: string;
  points: number;
  rank: number;
  boosts?: number;
  lastCheckIn?: number;
};

export default function QuestPage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId(); 


  const [mounted, setMounted] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [message, setMessage] = useState("");
  const [points, setPoints] = useState<number | null>(null);
  const [rank, setRank] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [boostCount, setBoostCount] = useState(0);
  const [lastCheckIn, setLastCheckIn] = useState<number | null>(null);
  const [recentTxs, setRecentTxs] = useState<string[]>([]);
  const [cooldown, setCooldown] = useState<number | null>(null);
 
    useEffect(() => {
  setMounted(true);
}, []);



  const toggleSidebar = () => setShowSidebar(!showSidebar);

  const networkName =
    chainId === 42161
      ? "Arbitrum One"
      : chainId === 1
      ? "Ethereum Mainnet"
      : chainId
      ? `Chain ID: ${chainId}`
      : "Unknown";

  const getCooldownTime = (lastTime: number) => {
    const remaining = 6 * 60 * 60 * 1000 - (Date.now() - lastTime);
    return remaining > 0 ? remaining : null;
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    if (lastCheckIn) {
      const interval = setInterval(() => {
        const remaining = getCooldownTime(lastCheckIn);
        setCooldown(remaining);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCooldown(null);
    }
  }, [lastCheckIn]);

  async function handleTransaction(type: "checkin" | "boost") {
  if (!address) {
    setMessage("❌ Wallet not connected.");
    return;
  }

  try {
    if (!window.ethereum) throw new Error("Wallet not detected");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    const value = type === "checkin" ? ethers.parseEther("0.00002") : ethers.parseEther("0.001");

    setLoading(true);
    setMessage(type === "checkin" ? "🧭 Checking in..." : "⚡ Boosting...");

    const tx = await contract[type === "checkin" ? "checkIn" : "boost"]({ value });
    await tx.wait();

    const res = await fetch('/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, action: type }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data?.message || "Backend error");

        if (data.newPoints) {
      setPoints(data.newPoints); // update immediately
    }
    if (type === "boost" && data.newBoosts !== undefined) {
      setBoostCount(data.newBoosts);
    }
    if (type === "checkin") {
      setLastCheckIn(Date.now()); // so cooldown shows immediately
    }
    setMessage(type === "checkin" ? "✅ Check-in successful!" : "✅ Boost successful!");
    await fetchLeaderboard(); // still refresh fully after

  } finally {
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  }
}



 const fetchLeaderboard = useCallback(async () => {
  try {
    const res = await fetch("/api/user");
    const data = await res.json();

    console.log("Fetched leaderboard data:", data); // debug

    if (Array.isArray(data)) {
      setLeaderboard(data);
      const current = data.find(
        (u: LeaderboardUser) => u.address.toLowerCase() === address?.toLowerCase()
      );
      if (current) {
        setPoints(current.points);
        setRank(current.rank);
        setBoostCount(current.boosts || 0);
        if (current.lastCheckIn) setLastCheckIn(current.lastCheckIn);
      }
    } else if (data && data.leaderboard) {
      setLeaderboard(data.leaderboard);
      const current = data.current;
      if (current) {
        setPoints(current.points);
        setRank(current.rank);
        setBoostCount(current.boosts || 0);
        if (current.lastCheckIn) setLastCheckIn(current.lastCheckIn);
      }
    } else {
      console.warn("Unexpected data format:", data);
    }
  } catch (e) {
    console.error("Fetch leaderboard failed:", e);
  }
}, [address]);


   useEffect(() => {
  if (address) {
    // Always ensure user exists first
    fetch('/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, action: 'ensure' }),
    })
    .then(() => fetchLeaderboard())
    .catch((e) => console.error("Ensure user failed:", e));
  }
}, [address, fetchLeaderboard]);



  return (
    <div
      className="flex flex-col min-h-screen text-white bg-cover bg-center"
      style={{ backgroundImage: 'url("https://i.postimg.cc/Y2s64bFp/Raven-1.png")' }}
    >
      <Navbar />
      <main className="flex-1 px-6 pt-24 flex flex-col items-center relative overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 via-transparent to-purple-900/70 pointer-events-none animate-pulse"></div>
  
  <h1 className="text-5xl md:text-6xl font-black text-purple-400 mb-4 drop-shadow-[0_2px_8px_rgba(139,92,246,0.8)] tracking-wide animate-fadeIn">
        Pre-Testnet
          Quest
  </h1>
  
  <p className="relative max-w-2xl text-center text-base md:text-lg text-purple-100 mb-8 leading-relaxed backdrop-blur-md bg-purple-800/20 p-4 rounded-xl shadow-md">
    ✅ <strong className="text-purple-300">Check in daily</strong> for just 
    <span className="text-emerald-400 font-semibold"> 0.00002 ETH</span> to earn points! ⚡ 
    Boost your score anytime for 
    <span className="text-emerald-400 font-semibold"> 0.002 ETH</span> (optional).  
    Complete <strong className="text-purple-300">social quests</strong> for an extra 
    <span className="text-yellow-400 font-semibold"> +12 bonus points</span>, invite your friends, 
    climb the leaderboard, and secure your spot in upcoming rewards! 🏆  
    <em className="block mt-2 text-xs text-purple-300">Note: Bots will be blocked from rewards. Join us on Discord to learn how it all works!</em>
  </p>

        {mounted && isConnected ? (
  <>
    <div className="text-sm text-white/90 mb-6 flex flex-wrap items-center gap-3 justify-center md:justify-start font-medium">
      <span className="bg-black/50 px-3 py-1 rounded border border-purple-600">
        <strong className="text-purple-300">Connected:</strong> {address?.slice(0, 6)}...{address?.slice(-4)}
      </span>
      <span className="bg-black/50 px-3 py-1 rounded border border-purple-600">
        <strong className="text-purple-300">Network:</strong> {networkName}
      </span>
      <button
        onClick={() => setShowProfile(true)}
        className="text-sm font-semibold px-3 py-1 rounded bg-purple-700 hover:bg-purple-800"
      >
        👤 Profile
      </button>
      <button
        onClick={() => disconnect()}
        className="text-sm font-semibold text-red-400 underline hover:text-red-300"
      >
        Disconnect
      </button>
    </div>
    


      <div className="flex flex-col md:flex-row gap-6 justify-between items-center w-full max-w-5xl">
  <div className="text-center bg-black/60 border border-purple-800 px-6 py-4 rounded-lg shadow-md">
    <p className="text-sm text-purple-300">⭐ Total Points</p>
    <p className="text-2xl font-bold">
  {points !== null ? points : 'Loading...'}
</p>

    {rank !== null && (
      <p className="text-sm font-semibold text-yellow-300 mt-1">🎖️ Rank: #{rank}</p>
    )}
  </div>

  <div className="flex flex-col items-center">
    <button
      onClick={() => handleTransaction("checkin")}
      disabled={loading || (cooldown !== null && cooldown > 0)}
      className={`w-40 py-3 rounded-md font-semibold transition ${
        loading
          ? "bg-gray-600 cursor-not-allowed"
          : cooldown
          ? "bg-blue-600 cursor-not-allowed"
          : "bg-purple-600 hover:bg-purple-700"
      }`}
    >
      {loading ? "⏳ Processing..." : "🧭 Check-in"}
    </button>
    {cooldown && cooldown > 0 && (
      <p className="mt-2 text-xl font-bold text-yellow-300 animate-pulse">
        ⏱ Next check-in: {formatTime(cooldown)}
      </p>
    )}
  </div>

  <div className="flex flex-col items-center">
    <button
      onClick={() => handleTransaction("boost")}
      disabled={loading}
      className="w-40 py-3 rounded-md font-semibold bg-yellow-500 hover:bg-yellow-600 text-black transition shadow"
    >
      {loading ? "⏳ Boosting..." : `⚡ Boost (${boostCount})`}
    </button>
  </div>
</div>

{message && (
  <div className="mt-4 text-center text-sm font-semibold text-yellow-300 animate-pulse">
    {message}
  </div>
)}

<SocialQuestSection 
  address={address || ""} 
  refreshLeaderboard={fetchLeaderboard} 
  setPoints={setPoints}
/>



            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ duration: 0.3 }}
                  className="fixed right-0 top-0 h-full w-full max-w-sm bg-[#0a001a] border-l border-purple-800 p-6 z-50 shadow-lg overflow-y-auto"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-purple-400">My Profile</h2>
                    <button onClick={() => setShowProfile(false)} className="text-red-400 hover:underline">Close</button>
                  </div>
                  <div className="space-y-4 text-sm">
                    <div>
                      <span className="text-gray-400">Address:</span>
                      <div className="cursor-pointer hover:underline" onClick={() => navigator.clipboard.writeText(address || "")}>{address}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Total Points:</span>
                      <p className="font-semibold">{points}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Rank:</span>
                      <p className="font-semibold text-yellow-400">#{rank}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Boosts Used:</span>
                      <p className="font-semibold text-purple-300">{boostCount}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Recent Transactions:</span>
                      <ul className="list-disc list-inside text-xs text-blue-300 space-y-1">
                        {recentTxs.length > 0 ? (
                          recentTxs.map((tx, i) => (
                            <li key={i}>
                              <a href={`https://arbiscan.io/tx/${tx}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                {tx.slice(0, 10)}...
                              </a>
                            </li>
                          ))
                        ) : (
                          <li>No recent transactions</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <aside className="w-full max-w-5xl bg-black/60 rounded-lg p-6 mt-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-bold text-purple-300">🏆 Leaderboard</h3>
                <button onClick={toggleSidebar} className="text-sm text-gray-400 hover:text-white">
                  {showSidebar ? "Hide Panel" : "Show Panel"}
                </button>
              </div>
              <AnimatePresence>
                {showSidebar && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-3 text-sm text-purple-200 font-bold border-b border-purple-800 pb-2 mb-2">
                      <span>Rank</span>
                      <span>User</span>
                      <span>Points</span>
                    </div>
                    <ul className="space-y-1 text-sm text-white">
  {leaderboard.slice(0, 50).map((user, i) => {
    const isTop3 = user.rank <= 3;
    return (
      <li
        key={i}
        className={`grid grid-cols-3 items-center py-2 px-2 rounded-md transition ${
          isTop3
            ? "bg-gradient-to-r from-purple-800 to-purple-900 text-yellow-300 font-semibold"
            : "hover:bg-purple-950 border-b border-purple-900"
        }`}
      >
        <span className="text-center">#{user.rank}</span>
        <span className="text-center">{user.address.slice(0, 6)}...{user.address.slice(-4)}</span>
        <span className="text-center">{user.points}</span>
      </li>
    );
  })}
</ul>

                  </motion.div>
                )}
              </AnimatePresence>
            </aside>
          </>
        ) : (
          <div className="mt-6">
            <ConnectButton />
          </div>
        )}

        <ReferralPanel />

       
      </main>
      <Footer />
    </div>
  );
}
