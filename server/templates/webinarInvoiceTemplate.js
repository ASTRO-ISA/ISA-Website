export function webinarInvoiceTemplate({
  invoiceNo,
  user,
  webinar,
  payment,
  qrUrl,
  registrationToken,
}) {
  return `
  <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 700px; margin: auto; color: #333; border: 1px solid #ddd;">
    
    <!-- Organization Header -->
    <div style="text-align: center; margin-bottom: 15px;">
      <h2 style="margin: 0; font-size: 24px;">ISA Events</h2>
      <p style="margin: 4px 0; font-size: 12px;">
        123 Business Center, Delhi, India<br/>
        Email: support@isaevents.com | Phone: +91 98765 43210
      </p>
    </div>

    <h3 style="text-align: center; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">INVOICE</h3>

    <!-- Invoice Meta -->
    <div style="margin-top: 20px; font-size: 14px;">
      <strong>Invoice No:</strong> ${invoiceNo}<br/>
      <strong>Issued Date:</strong> ${new Date().toDateString()}<br/>
      <strong>Transaction ID:</strong> ${payment.transaction_id}<br/>
      <strong>Payment Method:</strong> ${payment.method}<br/>
    </div>

    <hr style="margin: 20px 0"/>

    <!-- Billing Details -->
    <h4>Bill To:</h4>
    <p style="font-size: 14px;">
      <strong>Name:</strong> ${user.name}<br/>
      <strong>Email:</strong> ${user.email}
    </p>

    <hr style="margin: 20px 0"/>

    <!-- Event Details -->
    <h4>Event Details:</h4>
    <table style="width:100%; border-collapse: collapse; font-size: 14px;">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">Event</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${webinar.title}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">Date</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${new Date(webinar.webinarDate).toDateString()}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">Location</td>
        <td style="padding: 8px; border: 1px solid #ddd;">
          ${webinar.isOffline ? webinar.location : 'Online'}
        </td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">Registration Token</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${registrationToken}</td>
      </tr>
    </table>

    <hr style="margin: 20px 0"/>

    <!-- Payment Summary -->
    <h4>Payment Summary:</h4>
    <table style="width:100%; border-collapse: collapse; font-size: 14px;">
      <tr style="background:#f3f3f3;">
        <th style="padding: 10px; border: 1px solid #ddd; text-align:left;">Description</th>
        <th style="padding: 10px; border: 1px solid #ddd; text-align:right;">Amount</th>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${webinar.title} Webinar Registration</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align:right;">₹${payment.amount}</td>
      </tr>
      <tr style="background:#f3f3f3;">
        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Total</strong></td>
        <td style="padding: 10px; border: 1px solid #ddd; text-align:right;"><strong>₹${payment.amount}</strong></td>
      </tr>
    </table>

    <!-- QR Code for Entry Validation -->
    <p style="text-align:center; margin-top: 25px;">
      <img src="${qrUrl}" alt="QR Code" style="max-width:160px;"/>
    </p>
    <p style="text-align:center; font-size:12px; color:#555;">
      Scan QR code at venue or during check-in for verification
    </p>

    <hr style="margin: 20px 0"/>

    <!-- Footer -->
    <p style="text-align:center; font-size:12px; color:#555;">
      Thank you for choosing ISA Events.<br/>
      For support, contact: support@isaevents.com
    </p>
  </div>
  `
}