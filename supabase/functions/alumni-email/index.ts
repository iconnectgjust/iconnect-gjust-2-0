// ============================================================
// alumni-email — transactional email for the Alumni portal
//
// Two message types:
//   kind = "registered"  → confirmation after a public submission
//   kind = "approved"    → sent when an admin approves a profile
//
// Abuse protection (important: this endpoint is reachable by
// anonymous visitors so the registration form can call it):
//   * "registered" only sends if a PENDING row with that exact
//     email was created in the last 10 minutes. A caller cannot
//     use this to email arbitrary strangers.
//   * "approved" requires a signed-in admin (Authorization JWT)
//     and the row must actually be approved.
// ============================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const FROM = Deno.env.get("ALUMNI_FROM_EMAIL") ?? "Team iConnect <support@iconnectgjust.in>";
const SITE = Deno.env.get("SITE_URL") ?? "https://www.iconnectgjust.in";
// Internal address that gets told about each new submission.
const NOTIFY = Deno.env.get("ALUMNI_NOTIFY_EMAIL") ?? "support@iconnectgjust.in";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });

const esc = (s: string) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function buildEmail(kind: string, name: string, slug: string) {
  if (kind === "approved") {
    const url = slug ? `${SITE}/alumni/${slug}` : `${SITE}/alumni`;
    return {
      subject: "Your iConnect Alumni Profile Has Been Approved",
      text:
`Hello ${name},

Congratulations!

Your Alumni profile has been successfully verified and approved.
You are now officially part of the iConnect Alumni Network.

You can view your profile here:
${url}

Thank you for remaining a valued member of Team iConnect.

Regards,
Team iConnect`,
      html:
`<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:#222">
  <p>Hello ${esc(name)},</p>
  <p><strong>Congratulations!</strong></p>
  <p>Your Alumni profile has been successfully verified and approved.<br>
     You are now officially part of the iConnect Alumni Network.</p>
  <p>You can view your profile here:<br>
     <a href="${url}" style="color:#8428f1">${url}</a></p>
  <p>Thank you for remaining a valued member of Team iConnect.</p>
  <p>Regards,<br><strong>Team iConnect</strong></p>
</div>`,
    };
  }

  return {
    subject: "Thank You for Registering as an iConnect Alumni",
    text:
`Hello ${name},

Thank you for registering with the iConnect Alumni Network.

We have successfully received your Alumni registration.
Our team will verify your submitted details.
Verification generally takes up to 7 working days.

Once approved, you will receive another confirmation email.

Thank you for staying connected with Team iConnect.

Regards,
Team iConnect`,
    html:
`<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:#222">
  <p>Hello ${esc(name)},</p>
  <p>Thank you for registering with the iConnect Alumni Network.</p>
  <p>We have successfully received your Alumni registration.<br>
     Our team will verify your submitted details.<br>
     Verification generally takes up to <strong>7 working days</strong>.</p>
  <p>Once approved, you will receive another confirmation email.</p>
  <p>Thank you for staying connected with Team iConnect.</p>
  <p>Regards,<br><strong>Team iConnect</strong></p>
</div>`,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const { kind, email, name, slug } = await req.json();

    if (!["registered", "approved"].includes(kind)) {
      return json({ error: "Unknown email kind" }, 400);
    }
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: "Invalid email" }, 400);
    }

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    // Populated on the "registered" path so the team can be notified.
    let submission: Record<string, unknown> | null = null;

    // ---- authorise the request against real database state ----
    if (kind === "approved") {
      // Must be an authenticated admin.
      const authHeader = req.headers.get("Authorization") ?? "";
      const token = authHeader.replace(/^Bearer\s+/i, "");
      const { data: userData } = await admin.auth.getUser(token);
      if (!userData?.user) return json({ error: "Not authorised" }, 401);

      const { data: row } = await admin
        .from("alumni_profiles")
        .select("id,status")
        .ilike("email", email)
        .maybeSingle();
      if (!row || row.status !== "approved") {
        return json({ error: "Profile is not approved" }, 409);
      }
    } else {
      // Anonymous path: only confirm a genuine, very recent submission.
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      const { data: row } = await admin
        .from("alumni_profiles")
        .select("id,status,submitted_at,full_name,email,contact,roles,current_organization,current_designation,linkedin,photo_url")
        .ilike("email", email)
        .gte("submitted_at", tenMinutesAgo)
        .maybeSingle();
      if (!row || row.status !== "pending") {
        return json({ error: "No recent pending registration for this address" }, 409);
      }
      submission = row;
    }

    const safeName = String(name ?? "there").slice(0, 120);
    const msg = buildEmail(kind, safeName, String(slug ?? "").slice(0, 160));

    const send = (to: string, subject: string, text: string, html: string) =>
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from: FROM, to: [to], subject, text, html }),
      });

    const res = await send(email, msg.subject, msg.text, msg.html);
    if (!res.ok) {
      const detail = await res.text();
      return json({ error: "Email provider rejected the request", detail }, 502);
    }

    // Tell the team a new submission is waiting for review. Sent after the
    // applicant's email and never allowed to fail the request — the
    // registration itself has already been stored either way.
    let notified = false;
    if (kind === "registered" && submission) {
      const s = submission as Record<string, string | string[]>;
      const roles = Array.isArray(s.roles) ? s.roles : [];
      const adminUrl = `${SITE}/admin`;
      const rows: Array<[string, string]> = [
        ["Name", String(s.full_name ?? "")],
        ["Email", String(s.email ?? "")],
        ["Contact", String(s.contact ?? "") || "—"],
        ["Roles at iConnect", roles.length ? roles.join("  ·  ") : "—"],
        ["Organization", String(s.current_organization ?? "") || "—"],
        ["Designation", String(s.current_designation ?? "") || "—"],
        ["LinkedIn", String(s.linkedin ?? "") || "—"],
        ["Photo", s.photo_url ? String(s.photo_url) : "not provided"],
      ];

      const notifyText =
        `New Alumni registration awaiting review\n\n` +
        rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
        `\n\nReview and approve it here: ${adminUrl}`;

      const notifyHtml =
        `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:#222">
          <p><strong>A new Alumni registration is awaiting review.</strong></p>
          <table cellpadding="6" style="border-collapse:collapse;font-size:14px">
            ${rows
              .map(
                ([k, v]) =>
                  `<tr><td style="color:#666;white-space:nowrap"><strong>${esc(k)}</strong></td><td>${esc(v)}</td></tr>`
              )
              .join("")}
          </table>
          <p><a href="${adminUrl}" style="color:#8428f1">Review and approve in the admin panel →</a></p>
        </div>`;

      try {
        const nres = await send(
          NOTIFY,
          `New Alumni registration — ${String(s.full_name ?? "")}`,
          notifyText,
          notifyHtml
        );
        notified = nres.ok;
      } catch {
        notified = false;
      }
    }

    return json({ ok: true, notified });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
