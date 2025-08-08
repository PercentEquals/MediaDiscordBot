export async function downloadBlob(url: string, options?: RequestInit): Promise<Blob> {
    if (!url) {
        throw new Error('No url provided!');
    }

    if (!url.startsWith('http')) {
        throw new Error('Invalid url provided!');
    }

    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`Could not download from ${url}`);
    }

    //@ts-ignore - Blob is a Blob...
    return response.blob();
}