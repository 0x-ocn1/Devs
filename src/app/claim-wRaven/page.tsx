// src/app/claim-wRaven/page.tsx
'use client';

import { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function ClaimWRavenPage() {
  const [eligible, setEligible] = useState<null | boolean>(null);
  const [claimed, setClaimed] = useState(false);
  const [checking, setChecking] = useState(false);
  const [progress, setProgress] = useState(25); // example: 25% claimed

  const { isConnected } = useAccount();

  const { connect } = useConnect({
    connector: new WalletConnectConnector({
      options: {
        projectId: '00f59570459441f8131d3f6caa94ca43',
      },
    }),
  });

  const { disconnect } = useDisconnect();

  async function checkEligibility() {
    setChecking(true);
    // TODO: Replace with real API call to check tx count on chains
    await new Promise((res) => setTimeout(res, 1500));
    const fakeEligible = true; // fake result
    setEligible(fakeEligible);
    setChecking(false);
  }

  async function claimTokens() {
    // TODO: call claim contract here using wagmi writeContract
    await new Promise((res) => setTimeout(res, 1000));
    setClaimed(true);
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-4"
      style={{ backgroundImage: 'url(https://i.postimg.cc/Y2s64bFp/Raven-1.png)' }}
    >
      <motion.h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow mb-4">
        Claim Your wRaven Tokens
      </motion.h1>

      <Card className="max-w-md w-full bg-black/60 text-white backdrop-blur rounded-2xl shadow-lg">
        <CardContent className="flex flex-col gap-4 p-6">
          {!isConnected ? (
            <Button onClick={() => connect()}>Connect Wallet</Button>
          ) : eligible === null ? (
            <>
              <Button disabled={checking} onClick={checkEligibility}>
                {checking ? 'Checking...' : 'Check Eligibility'}
              </Button>
              <Button variant="secondary" onClick={() => disconnect()}>
                Disconnect
              </Button>
            </>
          ) : eligible === false ? (
            <p className="text-red-400">Wallet not eligible.</p>
          ) : claimed ? (
            <>
              <p className="text-green-400">Successfully claimed!</p>
              <a
                href="https://raven-rush.org/main-quest"
                target="_blank"
                className="underline text-purple-300"
              >
                Earn more points in our Pre-Testnet Quest
              </a>
            </>
          ) : (
            <>
              <Button onClick={claimTokens}>Claim 1000 wRaven</Button>
              <Button variant="secondary" onClick={() => disconnect()}>
                Disconnect
              </Button>
            </>
          )}

          <div className="w-full bg-gray-700 rounded-full h-3 mt-4">
            <div
              className="bg-purple-500 h-3 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-center">{progress}% claimed so far</p>
        </CardContent>
      </Card>
    </div>
  );
}

