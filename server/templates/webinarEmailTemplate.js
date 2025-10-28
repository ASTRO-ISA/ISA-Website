export function webinarEmailTemplate(user, webinar, qrUrl) {
    return `
      <div style="font-family: Arial, sans-serif; line-height:1.5;">
        <h3>Webinar Registration Confirmed</h3>
        <p>Hi ${user.name},</p>
        <p>You have successfully registered for <b>"${webinar.title}"</b> on <b>${new Date(webinar.webinarDate).toDateString()}</b>.</p>
        <p style="background:#f9f9f9; padding:12px; border-left:4px solid #4F46E5; margin:20px 0;">
          <strong>Important:</strong> A copy of the QR code has been attached to this email. Save it to access the webinar without internet issues.
        </p>
        <p style="text-align:center;">
          <img src="${qrUrl}" alt="QR Code" style="max-width:200px;"/>
        </p>
        <p>– ISA</p>
      </div>
    `
}