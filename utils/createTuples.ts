export function createTuples(text: string, urls: string[]): [string, string][] {
    const tuples: [string, string][] = [];

    let remainingText = text;

    for (const url of urls) {
        const index = remainingText.indexOf(url);

        if (index !== -1) {
            const beforeText = remainingText.substring(0, index).trim();
            tuples.push([beforeText, url]);

            // Actualizar el remainingText para continuar con el próximo URL
            remainingText = remainingText.substring(index + url.length).trim();
        }
    }

    return tuples;
}