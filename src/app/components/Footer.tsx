import { FaDiscord, FaTwitter, FaBook } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-black text-white text-sm py-6 mt-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p>&copy; {new Date().getFullYear()} Raven Rush. All rights reserved.</p>

        <div className="flex items-center gap-4 mt-4 md:mt-0">
          {/* Powered by text */}
          <span className="opacity-80">Powered by</span>

          {/* Partner Logos */}
          {[
            "https://i.postimg.cc/J09Gb4WK/Arbitrum.png",
            "https://i.postimg.cc/G9wm47k5/polygon.png",
            "https://i.postimg.cc/tghtJwWL/solana.png",
            "https://i.postimg.cc/yNd34Gnm/Bnb-chain.png"
          ].map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`partner-${idx}`}
              className="w-6 h-6 md:w-7 md:h-7 object-contain opacity-80 hover:opacity-100 transition duration-200"
            />
          ))}

          {/* Social Icons */}
          <a href="https://discord.gg/ZcfGd3DJjd" target="_blank" rel="noopener noreferrer">
            <FaDiscord className="text-xl hover:text-gray-300" />
          </a>
          <a href="https://twitter.com/raven_rush1" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="text-xl hover:text-gray-300" />
          </a>
          <a href="https://raven-rush.gitbook.io/docs" target="_blank" rel="noopener noreferrer">
            <FaBook className="text-xl hover:text-gray-300" />
          </a>
        </div>
      </div>
    </footer>
  );
}
