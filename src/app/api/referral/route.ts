import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

type ReferralData = {
  code: string;
  owner: string;
  referred: string[];
};

// --- GET ---
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const address = searchParams.get("address")?.toLowerCase();

  try {
    if (code) {
      // Find by referral code
      const { data, error } = await supabase
        .from("referral_data")
        .select("*")
        .eq("code", code)
        .single();
      if (error) return NextResponse.json(null);
      return NextResponse.json(data || null);
    }

    if (address) {
      // Find by owner address
      const { data, error } = await supabase
        .from("referral_data")
        .select("*")
        .eq("owner", address)
        .single();
      if (error || !data) return NextResponse.json(null);
      return NextResponse.json({
        refCode: data.code,
        referrer: null,    // you can add logic if you track referrer address
        invites: data.referred?.length || 0,
      });
    }

    // Leaderboard: users with at least 1 invite
    const { data: allData, error: allErr } = await supabase
      .from("referral_data")
      .select("*");
    if (allErr) return NextResponse.json([]);

    const filtered = allData
      .filter(u => u.referred && u.referred.length > 0)
      .sort((a, b) => b.referred.length - a.referred.length)
      .map((u, idx) => ({
        address: u.owner,
        invites: u.referred.length,
        rank: idx + 1,
      }));

    return NextResponse.json(filtered);
  } catch (err) {
    console.error("GET /api/referral error:", err);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

// --- POST ---
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, code, owner, referred } = body;

    if (action === "create") {
      if (!code || !owner) {
        return NextResponse.json({ error: "Missing code or owner" }, { status: 400 });
      }

      const lowerOwner = owner.toLowerCase();

      // Check if user already has a code
      const { data: existingOwner } = await supabase
        .from("referral_data")
        .select("*")
        .eq("owner", lowerOwner)
        .single();
      if (existingOwner) {
        return NextResponse.json({ error: "User already has a referral code" }, { status: 409 });
      }

      // Check if code already exists
      const { data: existingCode } = await supabase
        .from("referral_data")
        .select("*")
        .eq("code", code)
        .single();
      if (existingCode) {
        return NextResponse.json({ error: "Code already exists" }, { status: 409 });
      }

      // Insert new referral code
      const { data, error: insertErr } = await supabase
        .from("referral_data")
        .insert([{ code, owner: lowerOwner, referred: [] }])
        .select()
        .single();
      if (insertErr) {
        console.error(insertErr);
        return NextResponse.json({ error: "Failed to create referral" }, { status: 500 });
      }

      return NextResponse.json({ success: true, referral: data });
    }

    if (action === "addReferral") {
      if (!code || !referred) {
        return NextResponse.json({ error: "Missing code or referred" }, { status: 400 });
      }

      const lowerReferred = referred.toLowerCase();

      // Find code's owner
      const { data: ownerData } = await supabase
        .from("referral_data")
        .select("*")
        .eq("code", code)
        .single();
      if (!ownerData) {
        return NextResponse.json({ error: "Referral code not found" }, { status: 404 });
      }

      if (ownerData.owner === lowerReferred) {
        return NextResponse.json({ error: "You cannot refer yourself" }, { status: 400 });
      }

      // Add referred address if not already added
      if (!ownerData.referred.includes(lowerReferred)) {
        const updatedReferred = [...ownerData.referred, lowerReferred];
        const { error: updateErr } = await supabase
          .from("referral_data")
          .update({ referred: updatedReferred })
          .eq("code", code);
        if (updateErr) {
          console.error(updateErr);
          return NextResponse.json({ error: "Failed to update referral" }, { status: 500 });
        }
        ownerData.referred = updatedReferred;
      }

      return NextResponse.json({ success: true, referral: ownerData });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("POST /api/referral error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
