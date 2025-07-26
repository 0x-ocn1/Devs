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
      "More than a game, it’s a community. 🏁 Share race clips, win giveaways, vote on new features, and join weekly events. Whether you race, create, or vibe, there’s a place for you. 🚀",
    image: "https://i.postimg.cc/1zq0hYZX/65601744-ff2a-4cd5-868e-4d0d1e88c482.png",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-black text-white">
      <Navbar />

      <main className="flex-1 px-4 py-14 bg-black/90 backdrop-blur-md">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center mb-20">
          <motion.img
            src="https://i.postimg.cc/05YvjHFS/Raven-Rush-logo-2-0.png"
            alt="Raven Rush Logo"
            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.8)]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold text-purple-400 mt-6"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.8 }}
          >
            Race. Stake. Conquer.
          </motion.h1>
          <p className="mt-4 text-lg max-w-xl text-gray-300">
            Raven Rush is a decentralized PvP racing game. Compete for glory, trade in-game assets, and own your progress.
          </p>
        </section>

        {/* Animated Overview Sections */}
        <div className="space-y-32 max-w-7xl mx-auto px-4">
          {sections.map((sec, idx) => (
            <motion.section
              key={idx}
              className="grid md:grid-cols-2 gap-12 items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
              transition={{ duration: 0.6 + idx * 0.15 }}
            >
              <div className={`${idx % 2 === 1 ? 'md:order-2' : ''}`}>
                <img
                  src={sec.image}
                  alt={sec.title}
                  className="rounded-3xl shadow-2xl w-full object-cover"
                />
              </div>
              <div className="text-left">
                <h2 className="text-4xl font-bold text-purple-400 mb-4">{sec.title}</h2>
                <p className="text-gray-300 text-lg leading-relaxed max-w-prose">
                  {sec.description}
                </p>
              </div>
            </motion.section>
          ))}
        </div>


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

