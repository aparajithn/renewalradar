import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendReminderEmail } from '@/lib/email';
import { differenceInDays, parseISO } from 'date-fns';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all contracts that need reminders
    const { data: contracts, error } = await supabase
      .from('contracts')
      .select('*, user:user_id(email)')
      .gte('renewal_date', today.toISOString().split('T')[0]);

    if (error) throw error;

    let remindersSent = 0;
    const errors: string[] = [];

    for (const contract of contracts || []) {
      const daysUntilRenewal = differenceInDays(parseISO(contract.renewal_date), today);
      
      let shouldSendReminder = false;
      let reminderField = '';

      // Check if we should send a reminder
      if (daysUntilRenewal === 30 && !contract.reminder_30_sent) {
        shouldSendReminder = true;
        reminderField = 'reminder_30_sent';
      } else if (daysUntilRenewal === 7 && !contract.reminder_7_sent) {
        shouldSendReminder = true;
        reminderField = 'reminder_7_sent';
      } else if (daysUntilRenewal === 0 && !contract.reminder_day_sent) {
        shouldSendReminder = true;
        reminderField = 'reminder_day_sent';
      }

      if (shouldSendReminder && contract.user?.email) {
        try {
          await sendReminderEmail({
            to: contract.user.email,
            userName: contract.user.email.split('@')[0],
            contractName: contract.name,
            vendorName: contract.vendor_name,
            renewalDate: contract.renewal_date,
            daysUntilRenewal,
            noticePeriodDays: contract.notice_period_days,
            autoRenews: contract.auto_renews,
            contractId: contract.id,
          });

          // Mark reminder as sent
          await supabase
            .from('contracts')
            .update({ [reminderField]: true })
            .eq('id', contract.id);

          remindersSent++;
        } catch (error: any) {
          console.error(`Failed to send reminder for contract ${contract.id}:`, error);
          errors.push(`Contract ${contract.name}: ${error.message}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      remindersSent,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// Allow GET for testing
export async function GET() {
  return NextResponse.json({
    message: 'Cron endpoint is active. Use POST with Bearer token to trigger.',
  });
}
