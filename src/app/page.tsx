"use client";

import { motion } from "framer-motion";
import Footer from './components/Footer';
import Navbar from './components/Navbar';

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
      "No randomness – just pure skill. Race in free mode to train, stake tokens in PvP to earn based on performance, or climb weekly leaderboards to win big. Your victories and assets belong to you.",
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
      "Climb the leaderboard by completing quests to unlock Genesis Rewards, airdrops, and perks. Limited to 30k Beta Pass holders. Race now, secure your spot, and claim exclusive benefits before launch.",
    image: "https://i.postimg.cc/VNTpfhTC/Genesis-Reward.png",
  },
  {
    title: "Join our Community",
    description:
      "More than a game – it’s a community. 🏁 Share race clips, win giveaways, vote on new features, and join weekly events. Whether you race, create, or vibe – there’s a place for you in the Rush. 🚀",
    image: "https://i.postimg.cc/1zq0hYZX/65601744-ff2a-4cd5-868e-4d0d1e88c482.png",
  },
];

export default function HomePage() {
  return (
    <div
      className="flex flex-col min-h-screen font-sans"
      style={{
        backgroundImage: 'url("https://i.postimg.cc/Y2s64bFp/Raven-1.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#050013",
      }}
    >
      <Navbar />

      <main className="flex-1 text-white px-4 py-14 bg-black/90 backdrop-blur-sm flex flex-col items-center">
        {/* Hero */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center mb-16 space-y-4"
        >
          <motion.img
            src="https://i.postimg.cc/05YvjHFS/Raven-Rush-logo-2-0.png"
            alt="Raven Rush Logo"
            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.8)]"
            whileHover={{ scale: 1.07 }}
          />
          <h1 className="text-5xl md:text-7xl font-extrabold text-purple-400 tracking-wide drop-shadow-xl">
            Race. Stake. Conquer.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed">
            Raven Rush is a decentralized PvP racing game. Compete for glory, trade in-game assets, and own your progress.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-5">
            {[
              { label: "🎟️ Join the Waitlist", href: "https://tally.so/r/nGVddZ" },
              { label: "🚀 Mint Beta Pass", href: "https://raven-rush-beta-pass.nfts2.me/" },
              { label: "📖 Read our Docs", href: "https://raven-rush.gitbook.io/docs" },
              { label: "🛡️ Join Guild", href: "https://guild.xyz/raven-rush" }
            ].map((btn) => (
              <motion.a
                key={btn.label}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.96 }}
                href={btn.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-purple-700 hover:bg-purple-800 px-6 py-2 rounded-lg font-semibold shadow-[0_0_12px_rgba(139,92,246,0.6)] transition-all duration-200"
              >
                {btn.label}
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Section Cards: 3 top + 2 bottom */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl w-full">
          {sections.slice(0, 3).map((section) => (
            <motion.div
              key={section.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="bg-black/60 border border-purple-600/50 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-purple-700/40 transition-all duration-300"
            >
              <img
                src={section.image}
                alt={section.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-5 space-y-2">
                <h3 className="text-xl font-bold text-purple-300">{section.title}</h3>
                <p className="text-gray-300">{section.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 max-w-5xl w-full">
          {sections.slice(3).map((section) => (
            <motion.div
              key={section.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="bg-black/60 border border-purple-600/50 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-purple-700/40 transition-all duration-300"
            >
              <img
                src={section.image}
                alt={section.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-5 space-y-2">
                <h3 className="text-xl font-bold text-purple-300">{section.title}</h3>
                <p className="text-gray-300">{section.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Roadmap Section */}
        <motion.section
          className="mt-20 bg-gradient-to-br from-[#120022] via-[#2d0040] to-[#3a006a] rounded-2xl p-10 max-w-7xl w-full text-white shadow-[0_0_25px_rgba(139,92,246,0.5)] border border-purple-700/40"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <motion.img
              src="https://i.postimg.cc/R0D7j5Yj/Road-map-0.png"
              alt="Roadmap"
              className="w-full md:w-1/2 rounded-xl object-cover"
              whileHover={{ scale: 1.02 }}
            />
            <div className="md:w-1/2 space-y-5">
              <h3 className="text-4xl font-bold text-purple-300">🚗 Roadmap</h3>
              <div className="space-y-4 text-gray-200 text-base leading-relaxed">
                <div>
                  <span className="font-semibold text-purple-400">🚧 Phase 1: Build the Community</span><br />
                  Launch waitlist & Galxe campaigns to onboard 30,000 early supporters.
                </div>
                <div>
                  <span className="font-semibold text-purple-400">🚀 Phase 2: Beta Launch</span><br />
                  Testers play PvP, join tournaments, and share feedback.
                </div>
                <div>
                  <span className="font-semibold text-purple-400">🌍 Phase 3: Global Launch</span><br />
                  Full gameplay, marketplace, tournaments & mobile version.
                </div>
              </div>
            </div>
          
          </div>
        </motion.section>
{/* Horizontal Scrollable Gallery */}
<motion.section
  className="mt-20 w-full max-w-7xl px-2"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={fadeIn}
  transition={{ duration: 0.7 }}
>
  <h2 className="text-3xl md:text-4xl font-extrabold text-purple-300 mb-6 text-center">
    🎮 Featured Assets & Highlights
  </h2>
  <div className="overflow-x-auto scrollbar-hide">
    <div className="flex gap-6 snap-x snap-mandatory overflow-x-scroll px-1 pb-4">
      {[
        {
          title: "Cyber Racer",
          image: "https://i.postimg.cc/L6ndr3Fc/Cyber-racer.png",
        },
        {
          title: "Legendary Helmet",
          image: "https://i.postimg.cc/4NhL6Lgx/Legendary-helment.png",
        },
        {
          title: "Mystic Booster",
          image: "https://i.postimg.cc/J0XFzP70/Mystic-Booster.png",
        },
        {
          title: "NFT Garage",
          image: "https://i.postimg.cc/Vv8TGV3d/nft-garage.jpg",
        },
        {
          title: "Champion Podium",
          image: "https://i.postimg.cc/vHB1kkBG/champoin-podium.png",
        },
      ].map((item, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.06 }}
          className="snap-center min-w-[240px] md:min-w-[300px] bg-black/60 rounded-2xl border border-purple-600/40 shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-purple-500/40 overflow-hidden transition-all duration-300"
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
          />
          <div className="p-3 text-center">
            <h4 className="text-lg font-semibold text-purple-300">{item.title}</h4>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</motion.section>

      </main>

      <Footer />
    </div>
  );
}
