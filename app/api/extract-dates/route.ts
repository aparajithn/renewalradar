import { NextRequest, NextResponse } from 'next/server';
import { extractContractDates } from '@/lib/openai';
// @ts-ignore
import pdfParse from 'pdf-parse-fork';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract text from PDF
    let contractText = '';
    try {
      const data = await pdfParse(buffer);
      contractText = data.text;
    } catch (pdfError) {
      console.error('PDF parsing error:', pdfError);
      return NextResponse.json(
        { error: 'Failed to parse PDF. Please ensure the file is a valid PDF.' },
        { status: 400 }
      );
    }

    if (!contractText || contractText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Could not extract text from PDF. The file may be scanned or empty.' },
        { status: 400 }
      );
    }

    // Use OpenAI to extract dates
    const extractedData = await extractContractDates(contractText);

    return NextResponse.json(extractedData);
  } catch (error: any) {
    console.error('Error in extract-dates API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to extract contract dates' },
      { status: 500 }
    );
  }
}
