export interface Contract {
  id: string;
  user_id: string;
  name: string;
  vendor_name?: string;
  file_url: string;
  start_date?: string;
  renewal_date: string;
  notice_period_days?: number;
  auto_renews: boolean;
  contract_value?: number;
  notes?: string;
  reminder_30_sent: boolean;
  reminder_7_sent: boolean;
  reminder_day_sent: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExtractedDates {
  start_date?: string;
  renewal_date?: string;
  notice_period_days?: number;
  auto_renews?: boolean;
  contract_value?: number;
}
