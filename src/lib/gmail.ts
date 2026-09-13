import { getAccessToken } from '../auth';

export const sendInvoiceEmail = async (booking: any, customerEmail: string) => {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google');

  const emailLines = [
    `To: ${customerEmail}`,
    'Subject: Payment Invoice - Service Society',
    'Content-Type: text/html; charset=utf-8',
    '',
    `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #1e293b; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Service Invoice</h1>
          <p style="margin: 5px 0 0; color: #94a3b8;">Booking ID: ${booking.id}</p>
        </div>
        <div style="padding: 20px;">
          <p>Hi ${booking.customerName},</p>
          <p>Thank you for using our services. Here is your digital invoice.</p>
          
          <h3 style="border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Service Details</h3>
          <p><strong>Service:</strong> ${booking.serviceName}</p>
          <p><strong>Worker:</strong> ${booking.workerName}</p>
          
          <h3 style="border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Payment Breakdown</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #64748b;">Base Labour Rate</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 500;">₹${booking.pricing.baseLabour}</td>
            </tr>
            ${booking.pricing.materialsTotal > 0 ? `
            <tr>
              <td style="padding: 8px 0; color: #64748b;">Spare Parts</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 500;">₹${booking.pricing.materialsTotal}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 12px 0; font-weight: bold; font-size: 18px; border-top: 2px solid #e2e8f0;">Total Paid</td>
              <td style="padding: 12px 0; text-align: right; font-weight: bold; font-size: 18px; color: #10b981; border-top: 2px solid #e2e8f0;">₹${booking.pricing.netPayable}</td>
            </tr>
          </table>
          <p style="margin-top: 30px; font-size: 12px; color: #94a3b8; text-align: center;">Payment Method: ${booking.paymentMethod || 'Online'} | Paid At: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `
  ];

  const email = emailLines.join('\r\n');
  const base64EncodedEmail = btoa(unescape(encodeURIComponent(email))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: base64EncodedEmail,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error('Failed to send email: ' + (err.error?.message || 'Unknown error'));
  }

  return response.json();
};
