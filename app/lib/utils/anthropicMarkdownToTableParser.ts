
export const anthropicParses = (rawText: string) => {

    // Remove the code block delimiters
    const jsonString = rawText.replace(/^```json\s*/, '').replace(/\s*```$/, '');

    // console.log('JSON String:', jsonString);

    let data;
    try {
        data = JSON.parse(jsonString);
        //   console.log('Parsed JSON:', data);
        const markdownTable: string = data.tableData;
        const lines = markdownTable.trim().split('\n');
        const headers = lines[0]
            .split('|')
            .map((header) => header.trim())
            .filter((header) => header.length > 0);
        console.log(headers);
        const dataRows = lines.slice(2);
        const transactions = dataRows.map((line) => {
            const values = line
                .split('|')
                .map((value) => value)
                .filter((value) => value.length > 0);

            const transaction: any = {};
            headers.forEach((header, index) => {
                transaction[header] = values[index] || '';
            });

            return transaction;
        });
        return transactions
    } catch (error) {
        console.error('Failed to parse JSON:', error);
        return null;
    }
}