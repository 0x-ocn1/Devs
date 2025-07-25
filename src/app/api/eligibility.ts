import type { NextApiRequest, NextApiResponse } from 'next';

const API_KEY = process.env.EXPLORER_API_KEY; // store key in .env

const ENDPOINTS = {
  ethereum: `https://api.etherscan.io/api?module=account&action=txlist`,
  arbitrum: `https://api.arbiscan.io/api?module=account&action=txlist`,
  bnb: `https://api.bscscan.com/api?module=account&action=txlist`,
  polygon: `https://api.polygonscan.com/api?module=account&action=txlist`,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const address = req.query.address as string;
  if (!address) return res.status(400).json({ error: "Address required" });

  for (const [chain, base] of Object.entries(ENDPOINTS)) {
    try {
      const url = `${base}&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${API_KEY}`;
      const resp = await fetch(url);
      const data = await resp.json();
      if (data.status === "1" && data.result.length >= 10) {
        return res.status(200).json({ eligible: true, chain });
      }
    } catch (err) {
      console.error(chain, err);
    }
  }

  return res.status(200).json({ eligible: false });
}
