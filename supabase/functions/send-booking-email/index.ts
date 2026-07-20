// supabase/functions/send-booking-email/index.ts
//
// Triggered by a Supabase Database Webhook on UPDATE of the `booking_form` table.
// Sends the requester an email when status changes to 'approved' or 'rejected'.
//
// Deploy with:   supabase functions deploy send-booking-email
// Set secret:    supabase secrets set RESEND_API_KEY=your_resend_api_key

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

// Must be an email on a domain you've verified in Resend.
// Resend's shared test domain (onboarding@resend.dev) also works while testing,
// but only delivers to your own verified Resend account email.
const FROM_EMAIL = "UNC BIDYO <bookings@uncbidyo.org>";

// Must be a publicly reachable URL — email clients load images over the
// internet, they can't read local files. Once the site is deployed, the
// same logo used in Navbar/Footer works here too.
const LOGO_URL = "https://unc-bidyo-wesbite-kuof.vercel.app/images/bidyo.png";

serve(async (req) => {
  try {
    const payload = await req.json();

    // Supabase Database Webhooks POST: { type, table, record, old_record, schema }
    const booking = payload.record;
    const previous = payload.old_record;

    // Ignore inserts, and updates that didn't actually change status
    if (!booking || !previous || booking.status === previous.status) {
      return new Response(JSON.stringify({ skipped: true }), { status: 200 });
    }

    if (booking.status !== "approved" && booking.status !== "rejected") {
      return new Response(JSON.stringify({ skipped: true }), { status: 200 });
    }

    if (!booking.email) {
      return new Response(JSON.stringify({ error: "Booking has no email" }), { status: 400 });
    }

    // booking_form stores the name split across three columns, not a single `name` field
    const fullName = [booking.firstName, booking.middleName, booking.lastName]
      .filter(Boolean)
      .join(" ");

    const isApproved = booking.status === "approved";

    const subject = isApproved
      ? "Your booking with UNC BIDYO is confirmed!"
      : "Update on your UNC BIDYO booking request";

    const logoHeader = `
      <div style="text-align:center; padding:24px 0;">
        <img src="${LOGO_URL}" alt="UNC BIDYO" width="64" height="64" style="border-radius:50%; display:inline-block;" />
      </div>
    `;

    const html = isApproved
      ? `
        ${logoHeader}
        <p>Hi ${fullName || "there"},</p>
        <p>Good news — your booking request${booking.eventTitle ? ` for <strong>${booking.eventTitle}</strong>` : ""}${booking.startDate ? ` on <strong>${booking.startDate}</strong>` : ""} has been <strong>approved</strong>.</p>
        <p>We'll follow up shortly with next steps. If you have questions in the meantime, just reply to this email.</p>
        <p>— UNC BIDYO</p>
      `
      : `
        ${logoHeader}
        <p>Hi ${fullName || "there"},</p>
        <p>Thanks for reaching out to UNC BIDYO. Unfortunately, we're unable to accommodate your request${booking.eventTitle ? ` for <strong>${booking.eventTitle}</strong>` : ""}${booking.startDate ? ` on <strong>${booking.startDate}</strong>` : ""} at this time.</p>
        <p>Feel free to reach out if you'd like to try another date.</p>
        <p>— UNC BIDYO</p>
      `;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: booking.email,
        reply_to: "uncbidyoorg@gmail.com",
        subject,
        html,
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error("Resend error:", errText);
      return new Response(JSON.stringify({ error: errText }), { status: 502 });
    }

    return new Response(JSON.stringify({ sent: true }), { status: 200 });
  } catch (err) {
    console.error("send-booking-email error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
