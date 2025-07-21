import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import Providers from './Providers';

export const metadata = {
  title: 'Raven Rush',
  description: 'Race. Stake. Conquer. Raven Rush is a decentralized PvP racing game.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

