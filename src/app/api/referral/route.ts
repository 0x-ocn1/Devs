import { NextResponse } from "next/server"
import supabase from "@/lib/supabase"

// Define type for referral_data table
type ReferralData = {
  code: string
  owner: string
  referred: string[]
}

// --- GET ---
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get("code")
  const address = searchParams.get("address")?.toLowerCase()

  try {
    if (code) {
      // Find by code
      const { data, error } = await supabase
        .from("referral_data")
        .select("*")
        .eq("code", code)
        .single<ReferralData>()

      if (error) {
        console.error(error)
        return NextResponse.json(null)
      }

      return NextResponse.json(data || null)
    }

    if (address) {
      // Find by owner address
      const { data, error } = await supabase
        .from("referral_data")
        .select("*")
        .eq("owner", address)
        .single<ReferralData>()

      if (error || !data) {
        console.error(error)
        return NextResponse.json(null)
      }

      return NextResponse.json({
        refCode: data.code,
        referrer: null, // optional: to track actual referrer
        invites: data.referred?.length || 0,
      })
    }

    // Get all referral codes
    const { data: allData, error: allErr } = await supabase
      .from("referral_data")
      .select("*")

    if (allErr) {
      console.error(allErr)
      return NextResponse.json([])
    }

    return NextResponse.json(allData)
  } catch (err) {
    console.error("GET /api/referral error:", err)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}

// --- POST ---
// Body: { action: "create" | "addReferral", code?: string, owner?: string, referred?: string }
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { action, code, owner, referred } = body

    if (action === "create") {
      if (!code || !owner) {
        return NextResponse.json({ error: "Missing code or owner" }, { status: 400 })
      }

      // Check if code already exists
      const { data: exists } = await supabase
        .from("referral_data")
        .select("code")
        .eq("code", code)
        .single<ReferralData>()

      if (exists) {
        return NextResponse.json({ error: "Code already exists" }, { status: 409 })
      }

      // Insert new referral
      const { data, error: insertErr } = await supabase
        .from("referral_data")
        .insert([{ code, owner: owner.toLowerCase(), referred: [] }])
        .select()
        .single<ReferralData>()

      if (insertErr) {
        console.error(insertErr)
        return NextResponse.json({ error: "Failed to create referral" }, { status: 500 })
      }

      return NextResponse.json({ success: true, referral: data })
    }

    if (action === "addReferral") {
      if (!code || !referred) {
        return NextResponse.json({ error: "Missing code or referred" }, { status: 400 })
      }

      const lowerReferred = referred.toLowerCase()

      // Fetch target referral
      const { data: target, error: getErr } = await supabase
        .from("referral_data")
        .select("*")
        .eq("code", code)
        .single<ReferralData>()

      if (getErr || !target) {
        console.error(getErr)
        return NextResponse.json({ error: "Referral code not found" }, { status: 404 })
      }

      // Update referred list if new
      if (!target.referred.includes(lowerReferred)) {
        const updatedReferred = [...target.referred, lowerReferred]

        const { error: updateErr } = await supabase
          .from("referral_data")
          .update({ referred: updatedReferred })
          .eq("code", code)

        if (updateErr) {
          console.error(updateErr)
          return NextResponse.json({ error: "Failed to update referral" }, { status: 500 })
        }

        target.referred = updatedReferred
      }

      return NextResponse.json({ success: true, referral: target })
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 })
  } catch (err) {
    console.error("POST /api/referral error:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
