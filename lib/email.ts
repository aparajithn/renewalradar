import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendReminderEmailParams {
  to: string;
  userName: string;
  contractName: string;
  vendorName?: string;
  renewalDate: string;
  daysUntilRenewal: number;
  noticePeriodDays?: number;
  autoRenews: boolean;
  contractId: string;
}

export async function sendReminderEmail(params: SendReminderEmailParams) {
  const {
    to,
    userName,
    contractName,
    vendorName,
    renewalDate,
    daysUntilRenewal,
    noticePeriodDays,
    autoRenews,
    contractId,
  } = params;

  let subject = '';
  let urgency = '';

  if (daysUntilRenewal === 0) {
    subject = `🚨 [ACTION REQUIRED] Contract renewal TODAY`;
    urgency = 'Your contract renews TODAY!';
  } else if (daysUntilRenewal <= 7) {
    subject = `⚠️ [ACTION REQUIRED] Contract renewal in ${daysUntilRenewal} days`;
    urgency = `Your contract renews in ${daysUntilRenewal} days.`;
  } else {
    subject = `📅 Contract renewal in ${daysUntilRenewal} days`;
    urgency = `Your contract renews in ${daysUntilRenewal} days.`;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #dc2626;">${urgency}</h2>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Contract:</strong> ${contractName}</p>
        ${vendorName ? `<p><strong>Vendor:</strong> ${vendorName}</p>` : ''}
        <p><strong>Renewal Date:</strong> ${new Date(renewalDate).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
        ${noticePeriodDays ? `<p><strong>Notice Period:</strong> ${noticePeriodDays} days</p>` : ''}
        <p><strong>Auto-Renews:</strong> ${autoRenews ? 'Yes ⚠️' : 'No'}</p>
      </div>

      ${autoRenews && noticePeriodDays ? `
        <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #991b1b;">
            <strong>⚠️ Action Required:</strong> This contract auto-renews. 
            You must provide notice by ${new Date(new Date(renewalDate).getTime() - noticePeriodDays * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} if you want to cancel.
          </p>
        </div>
      ` : ''}

      <div style="margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/contracts/${contractId}" 
           style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View Contract Details
        </a>
      </div>

      <p style="color: #6b7280; font-size: 14px; margin-top: 40px;">
        — RenewalRadar<br/>
        Never miss a contract renewal deadline.
      </p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: 'RenewalRadar <noreply@renewalradar.com>',
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}
