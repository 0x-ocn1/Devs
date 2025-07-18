// src/app/api/user/route.ts
import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";

// Type
type User = {
  address: string;
  points: number;
  boosts: number;
  lastCheckIn: number | null;
  lastBoost: number | null;
};

// JSON data file path:
const DATA_PATH = path.join(process.cwd(), "src", "app", "data", "user-data.json");

// Ensure file and directory exist
function ensureDataFile() {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, "[]", "utf8");
}

// Read data
function readUserData(): User[] {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_PATH, "utf8");
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse JSON:", e);
    return [];
  }
}

// Write data
function writeUserData(data: User[]) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf8");
}

// Build leaderboard
function buildLeaderboard(users: User[]) {
  return [...users]
    .sort((a, b) => b.points - a.points)
    .map((u, i) => ({
      address: u.address,
      points: u.points,
      boosts: u.boosts,
      lastCheckIn: u.lastCheckIn,
      rank: i + 1,
    }));
}

// GET /api/user
// GET /api/user?address=0x...
export async function GET(req: Request) {
  const users = readUserData();
  const leaderboard = buildLeaderboard(users);

  const { searchParams } = new URL(req.url);
  const addr = searchParams.get("address")?.toLowerCase();

  if (addr) {
    const current = leaderboard.find((u) => u.address === addr) || null;
    return NextResponse.json({ leaderboard, current });
  }

  return NextResponse.json(leaderboard);
}

// POST: { address, action: "checkin" | "boost" | "ensure" }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { address, action } = body;
    if (!address || typeof address !== "string" || !["checkin", "boost", "ensure"].includes(action)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const normalized = address.toLowerCase();
    const users = readUserData();

    let user = users.find((u) => u.address === normalized);
    if (!user) {
      user = { address: normalized, points: 0, boosts: 0, lastCheckIn: null, lastBoost: null };
      users.push(user);
    }

    const now = Date.now();

    if (action === "checkin") {
      const cooldown = 6 * 60 * 60 * 1000; // 6 hours
      if (user.lastCheckIn && now - user.lastCheckIn < cooldown) {
        return NextResponse.json({ error: "Check-in cooldown active" }, { status: 429 });
      }
      user.points += 10;
      user.lastCheckIn = now;
    }

    if (action === "boost") {
      user.points += 200;
      user.boosts += 1;
      user.lastBoost = now;
    }

    // ensure = do nothing, just makes sure user exists

    writeUserData(users);

    const leaderboard = buildLeaderboard(users);
    const current = leaderboard.find((u) => u.address === normalized) || null;

    return NextResponse.json({ success: true, user: current, leaderboard });
  } catch (err) {
    console.error("POST /api/user error:", err);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
