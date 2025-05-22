import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/app/types/supabase';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function downloadFile(url: string) {
  const response = await fetch(url);
  return Buffer.from(await response.arrayBuffer());
}

export async function POST(request: Request) {
  try {
    const { fileUrl, fileType } = await request.json();
    
    // Download the file
    const fileBuffer = await downloadFile(fileUrl);
    
    // Process with Gemini
    const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    const prompt = `Extract banking transaction details from this document. 
                   Return the data in JSON format with the following structure:
                   {
                     "transactions": [
                       {
                         "date": "YYYY-MM-DD",
                         "description": "string",
                         "amount": number,
                         "type": "credit" | "debit",
                         "balance": number
                       }
                     ],
                     "accountInfo": {
                       "bankName": "string",
                       "accountNumber": "string",
                       "statementPeriod": {
                         "from": "YYYY-MM-DD",
                         "to": "YYYY-MM-DD"
                       }
                     }
                   }`;

    const geminiResult = await geminiModel.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: fileType,
          data: fileBuffer.toString('base64')
        }
      }
    ]);
    const geminiResponse = await geminiResult.response;
    const geminiParsedData = JSON.parse(geminiResponse.text());

    // For this example, we'll skip the DeepSeek implementation
    // In a real application, you would implement similar logic for DeepSeek
    const deepseekResult = null;

    // Compare results and update verification status
    const verificationStatus = deepseekResult ? 
      (JSON.stringify(geminiParsedData) === JSON.stringify(deepseekResult) ? 'verified' : 'mismatch') 
      : 'pending';

    // Update the document record
    const { error } = await supabase
      .from('documents')
      .update({
        parsed_data: geminiParsedData,
        gemini_result: geminiParsedData,
        deepseek_result: deepseekResult,
        status: 'completed',
        verification_status: verificationStatus
      })
      .eq('file_url', fileUrl);

    if (error) throw error;

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error processing document:', error);
    return NextResponse.json(
      { error: 'Failed to process document' },
      { status: 500 }
    );
  }
}
