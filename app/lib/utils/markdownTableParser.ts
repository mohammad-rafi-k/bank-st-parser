
export interface TableData {
    headers: string[];
    rows: string[][];
}

export function parseMarkdownTable(markdown: string): TableData | null {
    if (!markdown || typeof markdown !== 'string') {
        return null;
    }

    const lines = markdown.trim().split('\n');
    if (lines.length < 2) return null; // Must have at least header and one data row (or header and separator)

    const rawHeaders = lines[0].split('|').map(h => h.trim()).filter(Boolean);

    // Find the separator line
    let separatorIndex = -1;
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].includes('---')) {
            separatorIndex = i;
            break;
        }
    }

    if (separatorIndex === -1 && lines.length > 1 && lines[1].match(/^\|?\s*:(?:-)+:\s*\|?/)) {
        // If a proper separator line like |:----:| is present without ---, it might be a common variant
        separatorIndex = 1;
    } else if (separatorIndex === -1) { // If no clear separator, assume first line is header, rest is data
        // This case is problematic, as there's no standard on how to differentiate data from separator
        // For now, let's assume only the first line is header and the rest are rows.
        // A more robust parser would be needed for complex cases.
        // Let's try to be a bit smarter: if the second line has '---', it's a separator.
        if (lines.length > 1 && lines[1].includes('---')) {
            separatorIndex = 1;
        } else {
            // Fallback: assume simple structure if no clear separator found
            // Treat all lines after header as data
            separatorIndex = 0; // This means no separator line, first line is header, next are data
        }
    }


    const headers = rawHeaders.length > 0 ? rawHeaders : [];
    if (headers.length === 0) return null;

    const rows: string[][] = [];
    const dataLinesStart = separatorIndex + 1;

    for (let i = dataLinesStart; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line.startsWith('|') && !line.endsWith('|') && !line.includes('|')) continue; // Skip non-table lines

        // Remove leading/trailing pipes if they exist, then split
        const cells = line.replace(/^\||\|$/g, '').split('|').map(cell => cell.trim());

        // Ensure row has same number of columns as headers, pad if necessary
        // Or, if the AI generates slightly off tables, this might truncate or pad.
        // For now, let's take what we get, up to header length.
        rows.push(cells.slice(0, headers.length));
    }

    // If no rows were parsed but there were lines after header/separator, it might be a formatting issue.
    // For now, this is a simple parser.
    if (headers.length > 0) { // Return even if rows is empty, as long as headers are present
        return { headers, rows };
    }

    return null;
}