// src/app/api/user/route.ts
import { NextResponse } from "next/server";
import supabase from "@/lib/supabase"

console.log(NextResponse);


// Build leaderboard
function buildLeaderboard(users: any[]) {
  return [...users]
    .sort((a, b) => b.points - a.points)
    .map((u, i) => ({
      address: u.address,
      points: u.points,
      boosts: u.boosts,
      lastCheckIn: u.last_checkin,
      rank: i + 1,
    }))
}

// GET /api/user
// GET /api/user?address=0x...
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const addr = searchParams.get("address")?.toLowerCase()

  // fetch all users
  const { data: users, error } = await supabase.from('user_data').select('*')
  if (error) {
    console.error("Supabase fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }

  const leaderboard = buildLeaderboard(users || [])

  if (addr) {
    const current = leaderboard.find(u => u.address === addr) || null
    return NextResponse.json({ leaderboard, current })
  }

  return NextResponse.json(leaderboard)
}

// POST: { address, action: "checkin" | "boost" | "ensure" }
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { address, action } = body
    if (!address || typeof address !== "string" || !["checkin", "boost", "ensure"].includes(action)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    const normalized = address.toLowerCase()
    const now = Date.now()

    // fetch user
    const { data: user, error } = await supabase
      .from('user_data')
      .select('*')
      .eq('address', normalized)
      .single()

    let newUser = user

    if (!user) {
      // create user
      const { data, error: insertErr } = await supabase
        .from('user_data')
        .insert([{ address: normalized, points: 0, boosts: 0, last_checkin: null }])
        .select()
        .single()
      if (insertErr) {
        console.error(insertErr)
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
      }
      newUser = data
    }

    if (action === "checkin") {
      const cooldown = 6 * 60 * 60 * 1000 // 6 hours
      if (newUser.last_checkin && now - newUser.last_checkin < cooldown) {
        return NextResponse.json({ error: "Check-in cooldown active" }, { status: 429 })
      }
      const updated = await supabase
        .from('user_data')
        .update({ 
          points: newUser.points + 10, 
          last_checkin: now 
        })
        .eq('address', normalized)
      if (updated.error) throw updated.error
    }

    if (action === "boost") {
      const updated = await supabase
        .from('user_data')
        .update({ 
          points: newUser.points + 200, 
          boosts: newUser.boosts + 1 
        })
        .eq('address', normalized)
      if (updated.error) throw updated.error
    }

    // ensure: do nothing

    // fetch all users again to build leaderboard
    const { data: allUsers, error: fetchErr } = await supabase.from('user_data').select('*')
    if (fetchErr) {
      console.error(fetchErr)
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }

    const leaderboard = buildLeaderboard(allUsers || [])
    const current = leaderboard.find(u => u.address === normalized) || null

    return NextResponse.json({ success: true, user: current, leaderboard })
  } catch (err) {
    console.error("POST /api/user error:", err)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
