'use client';

import { motion } from 'framer-motion';
import {
  FaRocket,
  FaFlagCheckered,
  FaCogs,
  FaGlobe,
  FaSatelliteDish,
  FaTrophy,
  FaMapSigns,
  FaLayerGroup,
} from 'react-icons/fa';

const roadmap = [
  {
    title: 'Mission Launch',
    date: 'Q2 2025',
    desc: 'Raven Rush project revealed and alpha whitelist. distribute 30k Beta Pass NFTs to early supporters.',
    icon: <FaRocket className="text-cyan-400 text-3xl" />,
  },
  {
    title: 'Beta Test Drive',
    date: 'Q3 2025',
    desc: 'Game testnet launch, Early racing tournament and leaderboard system.',
    icon: <FaCogs className="text-indigo-400 text-3xl" />,
  },
  {
    title: 'Genesis Grand Prix',
    date: 'TBA',
    desc: 'Smart contract audit, Official Genesis Cup with rewards. Leaderboard reset, TGE, Airdrop and mainnet deployment.',
    icon: <FaFlagCheckered className="text-pink-400 text-3xl" />,
  },
  {
    title: 'Galaxy Expansion',
    date: 'TBA',
    desc: 'Interplanetary tracks, cross-chain racing, and community-driven seasons.',
    icon: <FaGlobe className="text-green-400 text-3xl" />,
  },
  {
    title: 'Lunar Tech Sync',
    date: 'TBA',
    desc: 'Deploy AI-driven racing bots and on-chain tuning garage.',
    icon: <FaSatelliteDish className="text-yellow-400 text-3xl" />,
  },
  {
    title: 'Champions Arena',
    date: 'TBA',
    desc: 'Stadium-style PVP and dynamic betting module.',
    icon: <FaTrophy className="text-purple-400 text-3xl" />,
  },
  {
    title: 'Multiverse Merge',
    date: 'TBA',
    desc: 'Cross-title GameFi tournaments and inter-game NFT mechanics.',
    icon: <FaLayerGroup className="text-orange-400 text-3xl" />,
  },
  {
    title: 'Beyond the Grid',
    date: 'TBA',
    desc: 'Community proposals, DAOs, and decentralized racing leagues.',
    icon: <FaMapSigns className="text-red-400 text-3xl" />,
  },
];

export default function RoadmapSection() {
  return (
    <section className="w-full text-white">
      {/* QUICK PROGRESS ROADMAP */}
      <div className="py-16 bg-black/80 backdrop-blur-sm text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-purple-300 mb-8 tracking-wide">
          🚀 Project Progress
        </h2>
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm md:text-base font-semibold tracking-wide">
          {['Pre-Testnet', 'Beta Testnet', 'TGE / Airdrop', 'Mainnet'].map((phase, i) => (
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`px-5 py-2 rounded-full border-2 ${
                i === 0
                  ? 'bg-purple-700 border-purple-500 text-white shadow-md'
                  : 'border-gray-600 text-gray-400 bg-black/40'
              }`}
            >
              {i === 0 && <span className="mr-1">🔥</span>}
              {phase}
            </motion.div>
          ))}
        </div>
      </div>

      {/* MAIN FULL ROADMAP */}
      <div className="py-28 px-4 md:px-16 bg-black bg-stars-pattern bg-cover relative">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-wide glow-text">
            🚦 The Raven Rushers
          </h2>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            From trackside whispers to galactic domination, here is our roadmap.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto border-l-[3px] border-cyan-500/50 pl-6">
          {roadmap.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="relative pl-10 pb-14 group"
            >
              {/* Pulse dot */}
              <div className="absolute -left-6 top-2">
                <div className="bg-black border-4 border-cyan-400 rounded-full p-2 shadow-xl animate-ping-slow group-hover:scale-110 transition">
                  {item.icon}
                </div>
              </div>

              {/* Card */}
              <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-cyan-800/60 rounded-2xl p-6 shadow-lg hover:shadow-cyan-500/40 transition-transform transform group-hover:scale-[1.01]">
                <h3 className="text-xl md:text-2xl font-semibold text-cyan-400 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2 italic">{item.date}</p>
                <p className="text-base text-gray-300 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Optional starscape overlay */}
        <div className="absolute inset-0 bg-stars opacity-[0.07] pointer-events-none" />
      </div>
    </section>
  );
}
