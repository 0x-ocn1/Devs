import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

interface User {
  address: string;
  points: number;
  boosts: number;
  last_checkin: number | null;
  completed_quests?: string[];
}

interface LeaderboardUser {
  address: string;
  points: number;
  boosts: number;
  lastCheckIn: number | null;
  rank: number;
}

function buildLeaderboard(users: User[]): LeaderboardUser[] {
  return [...users]
    .sort((a, b) => b.points - a.points)
    .map((u, i) => ({
      address: u.address,
      points: u.points,
      boosts: u.boosts,
      lastCheckIn: u.last_checkin,
      rank: i + 1,
    }));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const addr = searchParams.get("address")?.toLowerCase() ?? null;

  const { data: users, error } = await supabase.from("user_data").select("*");
  if (error || !users) {
    console.error("Supabase fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }

  const leaderboard = buildLeaderboard(users);

  if (addr) {
    const current = leaderboard.find((u) => u.address === addr) ?? null;
    return NextResponse.json({ leaderboard, current });
  }

  return NextResponse.json(leaderboard);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { address, action, taskId }: { address: string; action: string; taskId?: string } = body;

    if (!address || typeof address !== "string") {
      return NextResponse.json({ error: "Invalid address" }, { status: 400 });
    }

    const normalized = address.toLowerCase();

    // Fetch or create user
    const { data: user, error: fetchErr } = await supabase
      .from("user_data")
      .select("*")
      .eq("address", normalized)
      .single();

    let newUser = user as User | null;

    if (!newUser) {
      const { data, error: insertErr } = await supabase
        .from("user_data")
        .insert([{ address: normalized, points: 0, boosts: 0, last_checkin: null, completed_quests: [] }])
        .select()
        .single();
      if (insertErr || !data) {
        console.error(insertErr);
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
      }
      newUser = data as User;
    }

    // 🟢 Social quest: each task can be completed once, adds +2 points
    if (action === "social_quest" && taskId) {
      const completed = newUser.completed_quests || [];
      if (!completed.includes(taskId)) {
        completed.push(taskId);
        const { error: updateErr } = await supabase
          .from("user_data")
          .update({ points: newUser.points + 2, completed_quests: completed })
          .eq("address", normalized);
        if (updateErr) throw updateErr;

        return NextResponse.json({ success: true, newPoints: newUser.points + 2, clickedTasks: completed });
      } else {
        return NextResponse.json({ success: false, message: "Task already completed" });
      }
    }

    // fetch which tasks were completed
    if (action === "get_social_state") {
      const completed = newUser.completed_quests || [];
      return NextResponse.json({ clickedTasks: completed });
    }

    // keep other actions as before: checkin, boost, ensure
    // checkin & boost (short version, add your full logic here if needed)
    if (action === "checkin") {
      const now = Date.now();
      const cooldown = 6 * 60 * 60 * 1000;
      if (newUser.last_checkin && now - newUser.last_checkin < cooldown) {
        return NextResponse.json({ error: "Check-in cooldown active" }, { status: 429 });
      }
      await supabase
        .from("user_data")
        .update({ points: newUser.points + 10, last_checkin: now })
        .eq("address", normalized);
    }

    if (action === "boost") {
      await supabase
        .from("user_data")
        .update({ points: newUser.points + 200, boosts: newUser.boosts + 1 })
        .eq("address", normalized);
    }

    // ensure: do nothing

    // Rebuild leaderboard
    const { data: allUsers, error: allFetchErr } = await supabase.from("user_data").select("*");
    if (allFetchErr || !allUsers) {
      console.error(allFetchErr);
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }

    const leaderboard = buildLeaderboard(allUsers);
    const current = leaderboard.find((u) => u.address === normalized) ?? null;

    return NextResponse.json({ success: true, user: current, leaderboard });
  } catch (err) {
    console.error("POST /api/user error:", err);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
