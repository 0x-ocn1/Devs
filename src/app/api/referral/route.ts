import {NextResponse } from 'next/server'
import supabase from "@/lib/supabase"

// --- GET ---
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get("code")
  const address = searchParams.get("address")?.toLowerCase()

  if (code) {
    // find by code
    const { data, error } = await supabase
      .from('referral_data')
      .select('*')
      .eq('code', code)
      .single()

    if (error) {
      console.error(error)
      return NextResponse.json(null)
    }

    return NextResponse.json(data || null)
  }

  if (address) {
    // find by owner address
    const { data, error } = await supabase
      .from('referral_data')
      .select('*')
      .eq('owner', address)
      .single()

    if (error || !data) {
      console.error(error)
      return NextResponse.json(null)
    }

    return NextResponse.json({
      refCode: data.code,
      referrer: null, // optional to track actual referrer
      invites: data.referred?.length || 0
    })
  }

  // get all
  const { data: allData, error: allErr } = await supabase
    .from('referral_data')
    .select('*')

  if (allErr) {
    console.error(allErr)
    return NextResponse.json([])
  }

  return NextResponse.json(allData)
}

// --- POST ---
// body: { action, code?, owner?, referred? }
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { action, code, owner, referred } = body

    if (action === "create") {
      if (!code || !owner) {
        return NextResponse.json({ error: "Missing code or owner" }, { status: 400 })
      }

      // check if exists
      const { data: exists, error: findErr } = await supabase
        .from('referral_data')
        .select('code')
        .eq('code', code)
        .single()

      if (exists) {
        return NextResponse.json({ error: "Code already exists" }, { status: 409 })
      }

      // insert
      const { data, error: insertErr } = await supabase
        .from('referral_data')
        .insert([{ 
          code, 
          owner: owner.toLowerCase(), 
          referred: [] 
        }])
        .select()
        .single()

      if (insertErr) {
        console.error(insertErr)
        return NextResponse.json({ error: "Failed to create" }, { status: 500 })
      }

      return NextResponse.json({ success: true, referral: data })
    }

    if (action === "addReferral") {
      if (!code || !referred) {
        return NextResponse.json({ error: "Missing code or referred" }, { status: 400 })
      }

      const lowerReferred = referred.toLowerCase()

      // fetch target record
      const { data: target, error: getErr } = await supabase
        .from('referral_data')
        .select('*')
        .eq('code', code)
        .single()

      if (getErr || !target) {
        return NextResponse.json({ error: "Code not found" }, { status: 404 })
      }

      if (!target.referred.includes(lowerReferred)) {
        target.referred.push(lowerReferred)

        const { error: updateErr } = await supabase
          .from('referral_data')
          .update({ referred: target.referred })
          .eq('code', code)

        if (updateErr) {
          console.error(updateErr)
          return NextResponse.json({ error: "Failed to update" }, { status: 500 })
        }
      }

      return NextResponse.json({ success: true, referral: target })
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 })
  } catch (err) {
    console.error("POST /api/referral error:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
