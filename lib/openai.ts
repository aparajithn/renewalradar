import OpenAI from 'openai';
import { ExtractedDates } from '@/types/contract';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function extractContractDates(contractText: string): Promise<ExtractedDates> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a contract analysis assistant. Extract key dates and terms from contracts.
          
Return JSON with these fields (use null if not found):
- start_date: YYYY-MM-DD format
- renewal_date: YYYY-MM-DD format  
- notice_period_days: number of days (e.g., 30, 60, 90)
- auto_renews: boolean (true if contract auto-renews, false otherwise)
- contract_value: number (annual value in dollars, no currency symbols)

Only extract information that is explicitly stated in the contract. Return valid JSON only.`
        },
        {
          role: 'user',
          content: `Extract the contract details from this text:\n\n${contractText.substring(0, 3000)}`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    });

    const result = completion.choices[0]?.message?.content;
    if (!result) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(result);
    
    return {
      start_date: parsed.start_date || undefined,
      renewal_date: parsed.renewal_date || undefined,
      notice_period_days: parsed.notice_period_days || undefined,
      auto_renews: parsed.auto_renews ?? false,
      contract_value: parsed.contract_value || undefined,
    };
  } catch (error) {
    console.error('OpenAI extraction error:', error);
    throw new Error('Failed to extract contract dates');
  }
}
