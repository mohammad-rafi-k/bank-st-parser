import { NextResponse } from 'next/server';
import { ai } from "@/app/lib/utils/geminiClient";
import { z } from 'genkit';
import { anthropic } from "@/app/lib/utils/anthropicClient";
import { parseMarkdownTable } from '@/app/lib/utils/markdownTableParser';
import { anthropicParses } from "@/app/lib/utils/anthropicMarkdownToTableParser";




const ExtractStatementDataInputSchema = z.object({
    pdfDataUri: z
        .string()
        .describe(
            'The bank statement in pdf or jpeg format as a base64 encoded string',
        ),
});
export type ExtractStatementDataInput = z.infer<typeof ExtractStatementDataInputSchema>;

const ExtractStatementDataOutputSchema = z.object({
    transactions: z
        .array(
            z.object({
                date: z.string(),
                description: z.string(),
                amount: z.number(),
                type: z.enum(['credit', 'debit']),
                balance: z.number(),
            })
        ),
});

const PROMPT = `You are an expert financial data extractor.

You will receive a bank statement PDF in data URI format.

Your task is to:
1. Extract all transaction data from the PDF and format it into a structured table in Markdown format. The table should include columns for Date, Description of the transaction, Debit amount, Credit amount, and Running Balance, if available. If any of these columns are not present in the statement, omit them from the Markdown table. Ensure the Markdown is clean and follows standard syntax (headers, separator, rows).

Statement PDF: {{media url=pdfDataUri}}

Return all extracted information in the specified JSON output format. If a piece of information (e.g., account number) is not found, you may omit the field or return it as an empty string. For tableData, if no transactions are found or the table cannot be parsed, you can return an empty string or a Markdown table with only headers and a message like "No transactions found".
`;

const processWithGemini = async (fileBuffer: string) => {
    // Process with Gemini
    const prompt = PROMPT;

    const promptDefinition = ai.definePrompt({
        name: 'extractStatementDataPrompt',
        input: { schema: ExtractStatementDataInputSchema },
        output: { schema: ExtractStatementDataOutputSchema },
        prompt: prompt
    })

    const extractStatementDataFlow = ai.defineFlow(
        {
            name: 'extractStatementDataFlow',
            inputSchema: ExtractStatementDataInputSchema,
            outputSchema: ExtractStatementDataOutputSchema,
        },
        async (input: ExtractStatementDataInput) => {
            const { output } = await promptDefinition(input);
            console.log('AI output:', output)
            if (!output) {
                // Handle cases where the AI might return nothing
                // You could throw an error or return a default/empty structure
                console.error('AI prompt did not return any output for extractStatementDataFlow.');
                // Consider what a "safe" default is. For now, an object respecting the schema with undefineds.
                return {
                    transactions: []
                };
            }
            // Ensure all optional fields are at least present as undefined if not returned by AI
            return {
                transactions: output.transactions
            };
        }
    );
    const extractedData = await extractStatementDataFlow({
        pdfDataUri: fileBuffer
    });
    return extractedData;
}

const processWithAnthropic = async (fileBuffer: string) => {
    // console.log(fileBuffer)
    // console.log("Processing PDF with Anthropic... : ", fileBuffer);
    // if(1<2) throw new Error('found')
    // Claude 3.5 Sonnet and newer models support direct PDF input.
    const CLAUDE_MODEL = "claude-3-5-sonnet-20241022";
    try {
        if (!fileBuffer) {
            return "No PDF base64 string provided.";
        }

        // Clean the base64 data - remove data URI prefix if present
        let cleanBase64 = fileBuffer;
        if (fileBuffer.startsWith('data:')) {
            cleanBase64 = fileBuffer.split(',')[1];
        }

        console.log("Sending base64 encoded PDF for analysis to Claude...");
        // Create the prompt
        const prompt = PROMPT;
        // Make API call
        const message = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 4000,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "document",
                            source: {
                                type: "base64",
                                media_type: 'application/pdf',
                                data: cleanBase64
                            }
                        }
                    ]
                }
            ],
            system: prompt,
        });
        console.log('Claude response: ', message)
        return message.content;
    } catch (error: any) {
        console.error(`Error processing PDF from base64 with Anthropic API: ${error.message}`);
        if (error.response && error.response.data) {
            // Log more detailed API error response if available
            console.error("API Error Details:", JSON.stringify(error.response.data, null, 2));
        }
        return `Error: ${error.message}`;
    }

}


export async function POST(request: Request) {
    try {
        const { fileBuffer } = await request.json();
        const extractedData = await processWithGemini(fileBuffer);
        console.log('Parsed Gemini:', extractedData)
        const anthropicData: any = await processWithAnthropic(fileBuffer);
        let parsed = []
        if (Array.isArray(anthropicData)) {
            const parsedAnthropic = anthropicParses(anthropicData[0]['text'])
            console.log('Parsed Anthropic:', parsedAnthropic)
        }
        return NextResponse.json({ status: 'success', data: { gemini: extractedData, anthropic: anthropicData } });
    } catch (error) {
        console.error('Error processing document:', error);
        return NextResponse.json({ error: 'Failed to process document' }, { status: 500 });
    }
}
