import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

interface User {
  address: string;
  points: number;
  boosts: number;
  last_checkin: number | null;
  completed_quests?: string[] | string;
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
    .filter((u) => u.points >= 50)
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

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { address, action, taskId }: { address: string; action: string; taskId?: string } = body;

    if (!address || typeof address !== "string") {
      return NextResponse.json({ error: "Invalid address" }, { status: 400 });
    }

    const normalized = address.toLowerCase();

    // 🔍 Fetch user
    let { data: user, error: fetchErr } = await supabase
      .from("user_data")
      .select("*")
      .eq("address", normalized)
      .single();

    if (fetchErr && fetchErr.code !== "PGRST116") {
      console.error("Fetch error:", fetchErr);
      return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }

    // 👶 If user doesn't exist, create
    if (!user) {
  console.log("👶 New user detected, creating:", normalized);
  const { error: insertErr } = await supabase
    .from("user_data")
    .insert([{ address: normalized, points: 0, boosts: 0, last_checkin: null, completed_quests: JSON.stringify([]) }]);

    
    

  if (insertErr) {
    console.error("Insert error:", insertErr);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }

  // 🐛 Refetch to continue with up-to-date data
  const { data: refetchedUser, error: refetchErr } = await supabase
    .from("user_data")
    .select("*")
    .eq("address", normalized)
    .single();

  if (refetchErr || !refetchedUser) {
    console.error("Refetch error after insert:", refetchErr);
    return NextResponse.json({ error: "Failed to refetch user" }, { status: 500 });
  }

  user = refetchedUser;

  // ✅ Stop here if the only intent was to ensure user exists
  if (action === "ensure") {
    return NextResponse.json({ success: true, message: "User created" });
  }
}


    const newUser = user as User;

    // ✅ Handle social quest
    if (action === "social_quest" && taskId && typeof taskId === "string") {
      console.log("🧩 Social quest for task:", taskId);

      let completed: string[] = [];

      if (Array.isArray(newUser.completed_quests)) {
        completed = newUser.completed_quests;
      } else if (typeof newUser.completed_quests === "string") {
        try {
          const parsed = JSON.parse(newUser.completed_quests);
          if (Array.isArray(parsed)) completed = parsed;
        } catch (e) {
          console.warn("Parsing completed_quests failed:", e);
        }
      }

      if (completed.includes(taskId)) {
        return NextResponse.json({ success: false, message: "Task already completed" });
      }

      completed.push(taskId);

      const { error: updateErr } = await supabase
        .from("user_data")
        .update({
          points: newUser.points + 2,
          completed_quests: JSON.stringify(completed), // ✅ always save as JSON string
  })
  .eq("address", normalized);
      if (updateErr) {
        console.error("Update error (social quest):", updateErr);
        return NextResponse.json({ success: false, message: "Failed to update quest" });
      }

      return NextResponse.json({ success: true, newPoints: newUser.points + 2, clickedTasks: completed });
    }

    // ✅ Get completed social state
    if (action === "get_social_state") {
  let completed: string[] = [];
  if (typeof newUser.completed_quests === "string") {
    try {
      const parsed = JSON.parse(newUser.completed_quests);
      if (Array.isArray(parsed)) completed = parsed;
    } catch (e) {
      console.warn("Parsing failed:", e);
    }
  } else if (Array.isArray(newUser.completed_quests)) {
    completed = newUser.completed_quests;
  }
  return NextResponse.json({ clickedTasks: completed });
}


    // ✅ Check-in logic
    if (action === "checkin") {
  const now = Date.now();
  const cooldown = 6 * 60 * 60 * 1000;

  if (newUser.last_checkin && now - newUser.last_checkin < cooldown) {
    console.log("⏳ Check-in cooldown active");
    return NextResponse.json({ error: "Check-in cooldown active" }, { status: 429 });
  }

  console.log("✅ Check-in for", normalized);

  const { error: updateErr } = await supabase
    .from("user_data")
    .update({ points: newUser.points + 10, last_checkin: now })
    .eq("address", normalized);

  if (updateErr) {
    console.error("Check-in update error:", updateErr);
    return NextResponse.json({ error: "Check-in failed" }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    newPoints: newUser.points + 10,
    message: "Checked in successfully",
  });
}


    // ✅ Boost logic
   if (action === "boost") {
  console.log("🚀 Boost for", normalized);

  const { error: updateErr } = await supabase
    .from("user_data")
    .update({ points: newUser.points + 200, boosts: newUser.boosts + 1 })
    .eq("address", normalized);

  if (updateErr) {
    console.error("Boost update error:", updateErr);
    return NextResponse.json({ error: "Boost failed" }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    newPoints: newUser.points + 200,
    newBoosts: newUser.boosts + 1,
    message: "Boost successful",
  });
}


    // ✅ Re-fetch all users and return leaderboard
    const { data: allUsers, error: allFetchErr } = await supabase.from("user_data").select("*");

    if (allFetchErr || !allUsers) {
      console.error("Fetch all error:", allFetchErr);
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }

    const leaderboard = buildLeaderboard(allUsers);
    const current = leaderboard.find((u) => u.address === normalized) ?? null;

    return NextResponse.json({ success: true, user: current, leaderboard });

  } catch (err) {
    console.error("Unhandled POST /api/user error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}