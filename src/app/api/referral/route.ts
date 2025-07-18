import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";

// --- Types ---
type Referral = {
  code: string;            // e.g. "raven123"
  owner: string;           // wallet address (always lowercase)
  referred: string[];      // list of addresses that used this code
};

// --- File Location ---
const DATA_PATH = path.join(
  process.cwd(),
  "src",
  "app",
  "data",
  "referral-data.json"
);

// --- Helpers ---
function ensureDataFile() {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_PATH)) {
    fs.writeFileSync(DATA_PATH, "[]", "utf8");
  }
}

function readReferralData(): Referral[] {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_PATH, "utf8").trim();
  if (!raw) return [];
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

function writeReferralData(data: Referral[]) {
  ensureDataFile();
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf8");
}

// --- GET ---
export async function GET(req: Request) {
  const data = readReferralData();
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const address = searchParams.get("address");

  if (code) {
    const item = data.find((r) => r.code === code);
    return NextResponse.json(item || null);
  }

  if (address) {
    // find record where owner matches this address
    const item = data.find((r) => r.owner === address.toLowerCase());
    if (item) {
      return NextResponse.json({
        refCode: item.code,
        referrer: null,            // or set actual referrer if you track it
        invites: item.referred.length,
      });
    } else {
      return NextResponse.json(null);
    }
  }

  return NextResponse.json(data);
}


// --- POST ---
// body: { action, code?, owner?, referred? }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, code, owner, referred } = body;
    const data = readReferralData();

    if (action === "create") {
      if (!code || !owner) {
        return NextResponse.json({ error: "Missing code or owner" }, { status: 400 });
      }
      if (data.find((r) => r.code === code)) {
        return NextResponse.json({ error: "Code already exists" }, { status: 409 });
      }
      const newReferral: Referral = {
        code,
        owner: owner.toLowerCase(),
        referred: [],
      };
      data.push(newReferral);
      writeReferralData(data);
      return NextResponse.json({ success: true, referral: newReferral });
    }

    if (action === "addReferral") {
      if (!code || !referred) {
        return NextResponse.json({ error: "Missing code or referred" }, { status: 400 });
      }
      const target = data.find((r) => r.code === code);
      if (!target) {
        return NextResponse.json({ error: "Code not found" }, { status: 404 });
      }
      const lowerReferred = referred.toLowerCase();
      if (!target.referred.includes(lowerReferred)) {
        target.referred.push(lowerReferred);
        writeReferralData(data);
      }
      return NextResponse.json({ success: true, referral: target });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("POST /api/user/referral error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
