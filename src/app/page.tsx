"use client";

import { motion } from "framer-motion";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import RoadmapSection from "./components/RoadmapSection";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const sections = [
  {
    title: "About Raven Rush",
    description:
      "Raven Rush is a fast-paced, skill-based PvP racing game where every move counts. Blaze through futuristic tracks, outsmart rivals, and earn real rewards. Race, strategize, and build your racing legacy on-chain.",
    image: "https://i.postimg.cc/Y2s64bFp/Raven-1.png",
  },
  {
    title: "Why Play Raven Rush?",
    description:
      "No randomness, just pure skill. Race in free mode to train, stake tokens in PvP to earn based on performance, or climb weekly leaderboards to win big. Your victories and assets belong to you.",
    image: "https://i.postimg.cc/JnZ73jCG/Race-to-Glory.png",
  },
  {
    title: "Beta Pass NFT",
    description:
      "Mint your Beta Pass NFT to access Raven Rush testnet early. Play before launch, unlock exclusive in-game rewards, and claim special perks reserved for early supporters.",
    image: "https://i.postimg.cc/tJFyK6X8/Raven-Rush-Beta-Pass-Resized.png",
  },
  {
    title: "Leaderboard & Genesis Rewards",
    description:
      "Climb the leaderboard by completing quests to unlock Genesis Rewards, airdrops, and perks. Race now, secure your spot, and claim exclusive benefits before launch.",
    image: "https://i.postimg.cc/VNTpfhTC/Genesis-Reward.png",
  },
  {
    title: "Join our Community",
    description:
      "More than a game, it is a community. 🏁 Share race clips, win giveaways, vote on new features, and join weekly events. Whether you race, create, or vibe, there is a place for you. 🚀",
    image: "https://i.postimg.cc/1zq0hYZX/65601744-ff2a-4cd5-868e-4d0d1e88c482.png",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-black text-white">
      <Navbar />

<main className="flex-1 px-4 py-14 bg-black/90 backdrop-blur-md">

  {/* 🌌 Fullscreen Background Image Layer */}
  <div
    className="absolute inset-0 -z-10 bg-no-repeat bg-cover bg-center opacity-20 pointer-events-none"
    style={{
      backgroundImage: `url('https://i.postimg.cc/GhTCRtCH/Raven-1.png')`,
    }}
  />

  {/* 🌌 Cinematic Preview */}
  <section className="relative bg-black border-b border-purple-800 py-10 px-4 md:px-16 text-center">
    <motion.p
      className="text-purple-400 uppercase tracking-widest text-sm md:text-base mb-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Enter the Race Before It Begins
    </motion.p>
    <motion.h2
      className="text-2xl md:text-4xl font-extrabold text-white mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      The Future of PvP Racing is On-Chain
    </motion.h2>
    <motion.p
      className="text-gray-300 max-w-3xl mx-auto text-base md:text-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      Raven Rush is more than a game, it is a decentralized racing universe where every second, every upgrade, every decision matters. Are you ready to race for glory?
    </motion.p>
  </section>

  {/* 👥 Social Proof Strip */}
  <section className="bg-black border-b border-purple-800 py-6 px-4 md:px-16 text-center">
    <motion.p
      className="text-gray-400 text-sm md:text-base"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      🔥 Over <span className="text-purple-400 font-semibold">1,000</span> early signups • Backed by top builders in Web3 • 
    </motion.p>
  </section>

  {/* ⚙️ Feature Highlights */}
  <section className="bg-black border-b border-purple-800 py-6 px-4 md:px-16">
    <div className="flex flex-wrap justify-center gap-4 text-purple-300 text-sm font-medium">
      {[
        "Skill-Based Racing",
        "On-Chain Leaderboards",
        "NFT Upgrades",
        "Zero RNG",
        "PvP Earnings",
        "Cross-Chain Ready"
      ].map((item, i) => (
        <motion.div
          key={i}
          className="px-4 py-2 bg-purple-900/20 rounded-full border border-purple-600 shadow-sm hover:shadow-purple-700 transition"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * i }}
        >
          {item}
        </motion.div>
      ))}
    </div>
  </section>

  {/* 🔥 Raven Rush Overview Block */}
<section className="relative z-10 px-4 md:px-16 py-28 bg-black/90 text-white text-center border-y border-purple-700">
  <motion.h2
    className="text-5xl md:text-6xl font-extrabold text-purple-400 mb-6 tracking-tight"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    Race. Earn. Dominate.
  </motion.h2>
  <motion.p
    className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl mb-12"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    Skill meets speed in Raven Rush, a next-gen PvP racing world where your wins are truly yours.
  </motion.p>

 {/* 📍 Place this just before the “About Raven Rush” block */}
<section className="mt-24 mb-12 text-center">
  <h3 className="text-lg text-purple-300 font-semibold mb-6">
    Start your journey with Raven Rush:
  </h3>
  <div className="flex flex-wrap justify-center gap-4">
    {/* Primary CTA */}
    <a
      href="https://raven-rush.org/claim-wRaven"
      target="_blank"
      rel="noopener noreferrer"
      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full shadow-md transition-transform duration-200 hover:scale-105"
    >
      🚀 Join Pre-Testnet
    </a>

    {/* Secondary - Outline style */}
    <a
      href="https://guild.xyz/raven-rush"
      target="_blank"
      rel="noopener noreferrer"
      className="px-6 py-3 border border-purple-500 text-purple-300 hover:bg-purple-600 hover:text-white font-semibold rounded-full transition duration-200 hover:scale-105"
    >
      🤝 Join Guild
    </a>

    {/* Secondary - Outline style */}
    <a
      href="https://raven-rush.gitbook.io/docs"
      target="_blank"
      rel="noopener noreferrer"
      className="px-6 py-3 border border-purple-500 text-purple-300 hover:bg-purple-600 hover:text-white font-semibold rounded-full transition duration-200 hover:scale-105"
    >
      📘 Explore Our Docs
    </a>
  </div>
</section>


  <div className="grid md:grid-cols-2 gap-12 text-left max-w-5xl mx-auto">
    {[
      {
        title: "About Raven Rush",
        desc: "Raven Rush is a fast-paced, skill-based PvP racing game. Blaze through futuristic tracks, outsmart rivals, and earn real rewards. Every race is a step toward building your on-chain legacy.",
      },
      {
        title: "Why Play Raven Rush?",
        desc: "No randomness, no gimmicks. Just pure skill. Practice in free mode, stake tokens in PvP, or conquer weekly leaderboards. Win, earn, and evolve.",
      },
      {
        title: "Beta Pass NFT",
        desc: "Mint your Beta Pass to access early testnet gameplay. Unlock exclusive perks, early features, and a permanent spot in the Raven Rush Hall of Fame.",
      },
      {
        title: "Leaderboard & Genesis Rewards",
        desc: "Complete quests and dominate the leaderboards to secure Genesis rewards, $Raven airdrops, and legendary in-game assets.",
      },
      {
        title: "Join Our Community",
        desc: "Raven Rush is not just a game, it's a movement. Share race clips, join AMAs, vote on features, and shape the future. All racers welcome. 🏁",
      },
      {
        title: "A Living, Evolving Game World",
        desc: "Raven Rush is more than a launch, it is a living ecosystem. Community proposals, new track releases, NFT upgrades, and balance patches will shape the game over time. Be part of the future by helping build it.",
      },
    ].map((item, i) => (
      <motion.div
        key={i}
        className="bg-black/60 p-6 border border-purple-700 rounded-xl shadow-md hover:shadow-purple-600/40 transition"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.15, duration: 0.5 }}
      >
        <h3 className="text-xl font-bold text-purple-300 mb-3">{item.title}</h3>
        <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
      </motion.div>
    ))}
  </div>
</section>

         {/* wRaven Token Section */}
<section className="mt-32 max-w-4xl mx-auto px-4 text-center">
  <motion.h2
    className="text-4xl font-bold text-purple-300 mb-6"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0 },
    }}
    transition={{ duration: 0.6 }}
  >
    🔄 Claim wRaven, Earn Real $Raven
  </motion.h2>
  <motion.p
    className="text-gray-300 text-lg leading-relaxed mb-8 max-w-2xl mx-auto"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: 0.2 }}
  >
    Claim your <strong className="text-purple-400">wRaven</strong> and convert it to <strong className="text-purple-400">$Raven</strong> before launch.  
    $Raven fuels the entire game economy, use it to race, upgrade gear, mint NFTs, and stake in PvP.  
    Early players get a head start.
  </motion.p>
  <motion.a
    href="https://raven-rush.org/claim-wRaven"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block bg-purple-600 hover:bg-purple-700 transition-colors text-white font-bold py-3 px-6 rounded-full shadow-lg"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.97 }}
  >
    🚀 Claim wRaven & Join Pre-Testnet Quest
  </motion.a>
</section>

        {/* Featured Assets */}
        <section className="mt-32 max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-purple-300 text-center mb-10">
            🎮 Featured Assets & Highlights
          </h2>
          <div className="overflow-x-auto">
            <div className="flex gap-6 snap-x snap-mandatory px-2 pb-4">
              {["Cyber Racer", "Legendary Helmet", "Mystic Booster", "NFT Garage", "Champion Podium"].map((title, i) => (
                <motion.div
                  key={i}
                  className="snap-center min-w-[240px] md:min-w-[300px] bg-black/60 border border-purple-600 rounded-2xl shadow-md overflow-hidden"
                  whileHover={{ scale: 1.06 }}
                >
                  <img
                    src={`https://i.postimg.cc/${[
                      "L6ndr3Fc/Cyber-racer.png",
                      "4NhL6Lgx/Legendary-helment.png",
                      "J0XFzP70/Mystic-Booster.png",
                      "DfGpspFy/nft-garage.png",
                      "vHB1kkBG/champoin-podium.png",
                    ][i]}`}
                    alt={title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3 text-center">
                    <h4 className="text-lg font-semibold text-purple-300">{title}</h4>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Roadmap Section */}
        <RoadmapSection />

        {/* New: Racer’s Mindset Section */}
        <section className="mt-32 max-w-6xl mx-auto px-4">
          <motion.h2
            className="text-4xl font-bold text-purple-300 text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            🧠 The Racer Mindset
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Precision Over Luck",
                desc: "Every corner counts. True racers master the track, not RNG. Raven Rush rewards skill, not chance.",
              },
              {
                title: "Earn What You Burn",
                desc: "The more you grind, the more you shine. Victories earn assets. Assets earn value.",
              },
              {
                title: "Evolve to Dominate",
                desc: "Upgrade, adapt, and refine your style. Racing is not just speed — it is evolution under pressure.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-black/60 border border-purple-700 rounded-xl p-6 shadow-lg hover:shadow-purple-500/30"
              >
                <h3 className="text-xl font-bold text-purple-300 mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Powered By Section */}
<section className="relative mt-32 py-12 bg-gradient-to-br from-purple-900/30 via-black to-purple-800/20 rounded-3xl shadow-[0_0_40px_rgba(168,85,247,0.4)] max-w-5xl mx-auto px-6 text-center">
  <motion.h2
    className="text-2xl md:text-3xl font-bold text-purple-300 mb-8"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    🔗 Built with the Power of Leading Chains
  </motion.h2>
  <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
    {[
      { name: "Arbitrum", src: "J09Gb4WK/Arbitrum.png" },
      { name: "Polygon", src: "G9wm47k5/polygon.png" },
      { name: "Solana", src: "tghtJwWL/solana.png" },
      { name: "BNB Chain", src: "yNd34Gnm/Bnb-chain.png" },
    ].map((chain, idx) => (
      <motion.div
        key={chain.name}
        className="bg-black/60 hover:bg-black/80 border border-purple-500 rounded-xl p-3 shadow-inner backdrop-blur-sm transition duration-300"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 + idx * 0.15, duration: 0.4 }}
      >
        <img
          src={`https://i.postimg.cc/${chain.src}`}
          alt={chain.name}
          className="w-10 h-10 md:w-12 md:h-12 object-contain grayscale hover:grayscale-0 transition duration-300"
        />
        <p className="mt-2 text-sm text-purple-200">{chain.name}</p>
      </motion.div>
    ))}
  </div>
</section>
      </main>

      <Footer />
    </div>
  );
}

