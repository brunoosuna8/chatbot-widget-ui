export const extractImageUrls = (text: string): string[] => {
    const urlRegex = /!\[.*?\]\((.*?)\)/g;
    const urls: string[] = [];
    let match;

    while ((match = urlRegex.exec(text)) !== null) {
        urls.push(match[1]);
    }

    return urls;
};