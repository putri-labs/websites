import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    console.error("[contact] RESEND_API_KEY env var not set")
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
  }

  const contactEmail = process.env.CONTACT_EMAIL
  if (!contactEmail) {
    console.error("[contact] CONTACT_EMAIL env var not set")
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const { name, email, firmName, message } = body as {
    name?: string
    email?: string
    firmName?: string
    message?: string
  }

  if (!name || !email || !firmName || !message) {
    return NextResponse.json(
      { error: "All fields are required: name, email, firmName, message" },
      { status: 400 }
    )
  }

  if (name.length > 100 || firmName.length > 200 || message.length > 5000 || email.length > 254) {
    return NextResponse.json({ error: "Input too long" }, { status: 400 })
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    await resend.emails.send({
      from: "CustomsPro Contact <noreply@custompro.in>",
      to: contactEmail,
      replyTo: email,
      subject: `Contact from ${name} — ${firmName}`,
      text: [`Name: ${name}`, `Email: ${email}`, `Firm: ${firmName}`, "", "Message:", message].join("\n"),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[contact] Resend error:", err)
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    )
  }
}
