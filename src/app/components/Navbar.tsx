import Link from "next/link";
import { useState } from "react";
import { Menu, X, Twitter, MessageCircleMore } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const baseButton =
    "inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition text-sm";
  const solidButton =
    `${baseButton} bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-md hover:shadow-purple-600/50 hover:scale-105`;
  const outlineButton =
    `${baseButton} border border-purple-500 text-purple-300 hover:bg-purple-700/20 hover:scale-105`;

  return (
    <header className="bg-black text-white w-full shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <img
            src="https://i.postimg.cc/05YvjHFS/Raven-Rush-logo-2-0.png"
            alt="Raven Rush Logo"
            className="w-8 h-8 rounded-full border-2 border-purple-700"
          />
          <span className="text-xl font-bold tracking-wide">Raven Rush</span>
        </Link>

        <button className="md:hidden" onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className="hidden md:flex gap-4 text-sm font-medium items-center">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <Link href="/main-quest" className={solidButton}>Main Quest</Link>
          <Link href="/claim-wRaven" className={solidButton}>Claim wRaven</Link>
          <a
            href="https://discord.gg/ZcfGd3DJjd"
            target="_blank"
            rel="noopener noreferrer"
            className={outlineButton}
          >
            <MessageCircleMore size={16} /> Discord
          </a>
          <a
            href="https://twitter.com/raven_rush1"
            target="_blank"
            rel="noopener noreferrer"
            className={outlineButton}
          >
            <Twitter size={16} /> Twitter
          </a>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 bg-black text-sm space-y-3 mt-2">
          <Link href="/" onClick={toggleMenu} className="block">Home</Link>
          <Link href="/main-quest" onClick={toggleMenu} className={solidButton}>Main Quest</Link>
          <Link href="/claim-wRaven" onClick={toggleMenu} className={solidButton}>Claim wRaven</Link>
          <a
            href="https://discord.gg/ZcfGd3DJjd"
            target="_blank"
            rel="noopener noreferrer"
            onClick={toggleMenu}
            className={outlineButton}
          >
            <MessageCircleMore size={16} /> Discord
          </a>
          <a
            href="https://twitter.com/raven_rush1"
            target="_blank"
            rel="noopener noreferrer"
            onClick={toggleMenu}
            className={outlineButton}
          >
            <Twitter size={16} /> Twitter
          </a>
        </div>
      )}
    </header>
  );
}
