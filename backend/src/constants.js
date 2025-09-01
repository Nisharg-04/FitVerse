export const DB_NAME = "FitVerse";

export const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export const roles = ["user", "owner", "admin"];

export function getGymApproveMailContent(
  ownerName,
  gymName,
  dashboardUrl,
  supportEmail
) {
  return `<!DOCTYPE html>
<html lang="en" style="margin:0;padding:0;">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width"/>
  <title>FitVerse – Gym Approved</title>
  <style>
    /* Prefer inline styles for max email compatibility */
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 20px !important; }
      .btn { display: block !important; width: 100% !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background:#f5f7fb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#111827;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f5f7fb; padding: 24px 0;">
    <tr>
      <td align="center">
        <table class="container" role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 6px 24px rgba(0,0,0,0.06);">
          <!-- Header -->
          <tr>
            <td style="background:#0b5cff; padding:24px;">
              <table width="100%" role="presentation">
                <tr>
                  <td align="left">
                    <div style="font-size:20px; font-weight:700; color:#ffffff; letter-spacing:0.3px;">FitVerse</div>
                    <div style="font-size:12px; color:rgba(255,255,255,0.85); margin-top:4px;">All-in-One Fitness Platform</div>
                  </td>
                  <td align="right">
                    <span style="display:inline-block; background:#ffffff; color:#0b5cff; font-size:11px; font-weight:700; padding:6px 10px; border-radius:999px;">GYM APPROVED</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero -->
          <tr>
            <td style="padding:32px 32px 8px 32px;">
              <div style="font-size:22px; font-weight:800; color:#0b5cff; margin-bottom:8px;">Congratulations, ${ownerName}!</div>
              <div style="font-size:16px; color:#374151; line-height:1.6;">
                Your gym <strong>${gymName}</strong> has been <strong>approved</strong> and is now ready to welcome the FitVerse community.
              </div>
            </td>
          </tr>

          <!-- Info Card -->
          <tr>
            <td style="padding:8px 32px 0 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border:1px solid #e5e7eb; border-radius:12px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <table role="presentation" width="100%">
                      <tr>
                        <td style="font-size:14px; color:#6b7280; padding-bottom:6px;">Status</td>
                      </tr>
                      <tr>
                        <td style="font-size:16px; font-weight:700; color:#10b981; padding-bottom:12px;">Approved & Live</td>
                      </tr>
                      <tr>
                        <td style="font-size:14px; color:#374151;">
                          Next steps:
                          <ul style="padding-left:18px; margin:8px 0; line-height:1.6;">
                            <li>Review your gym profile details</li>
                            <li>Add/update photos, amenities, timings</li>
                            <li>Track visits and wallet redemptions</li>
                          </ul>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:24px 32px 8px 32px;" align="left">
              <a href="${dashboardUrl}" class="btn" style="background:#0b5cff; color:#ffffff; text-decoration:none; font-weight:700; font-size:14px; padding:12px 18px; border-radius:10px; display:inline-block;">
                Open Dashboard
              </a>
              <div style="font-size:12px; color:#6b7280; margin-top:10px;">
                Trouble with the button? Copy and paste this link into your browser:<br/>
                <span style="word-break:break-all; color:#0b5cff;">${dashboardUrl}</span>
              </div>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:8px 32px;">
              <hr style="border:none; border-top:1px solid #e5e7eb; margin:0;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 32px 24px 32px; font-size:12px; color:#6b7280;">
              Need help? Email us at <a href="mailto:${supportEmail}" style="color:#0b5cff; text-decoration:none;">${supportEmail}</a>.
              <br/>
              You’re receiving this because you manage <strong>${gymName}</strong> on FitVerse.
              <div style="margin-top:14px; color:#9ca3af;">© ${new Date().getFullYear()} FitVerse. All rights reserved.</div>
            </td>
          </tr>
        </table>

        <!-- Brand Footer Line -->
        <div style="font-size:11px; color:#9ca3af; margin-top:14px;">
          FitVerse • Fitness made flexible
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function getGymRejectMailContent(ownerName, gymName, reason, adminName) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Gym Rejection Notice</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, Helvetica, sans-serif; background:#f9fafb; color:#111827;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px;">
    <tr>
      <td align="center">
        <table width="600" style="background:#ffffff; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.08); padding:24px;">
          
          <!-- Header -->
          <tr>
            <td style="font-size:20px; font-weight:bold; color:#b91c1c; padding-bottom:16px;">
              Application Update
            </td>
          </tr>
          
          <!-- Message -->
          <tr>
            <td style="font-size:16px; line-height:1.6; color:#374151;">
              Hello <strong>${ownerName}</strong>,<br/><br/>
              We regret to inform you that your gym <strong>${gymName}</strong> could not be approved.
            </td>
          </tr>

          <!-- Reason -->
          <tr>
            <td style="margin-top:12px; font-size:15px; background:#fef2f2; border:1px solid #fecaca; border-radius:8px; padding:12px; color:#991b1b;">
              <strong>Reason:</strong> ${reason}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="font-size:14px; color:#6b7280; padding-top:20px; line-height:1.5;">
              Rejected by: <strong>${adminName}</strong><br/>
              You may correct the issues and resubmit your application.<br/><br/>
              Thank you for your understanding.<br/>
              – FitVerse Team
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
