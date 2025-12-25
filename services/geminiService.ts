// All AI services are disabled.
export async function* sendMessageToAiStream(message: string, history: any[] = []): AsyncGenerator<string> {
    yield "";
}

export async function generateContent(prompt: string): Promise<string> {
    return "";
}