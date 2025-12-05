// This service has been disabled as requested.
// Stub functions are provided to prevent build errors.

export async function* sendMessageToAiStream(message: string, history: { sender: 'user' | 'bot', text: string }[] = []): AsyncGenerator<string> {
    yield "AI features are disabled.";
}

export async function generateContent(prompt: string): Promise<string> {
    return "AI features are disabled.";
}