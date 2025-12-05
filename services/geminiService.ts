
import { GoogleGenAI, Chat } from "@google/genai";

const systemInstruction = `You are a helpful and professional HR assistant for a company operating in Malaysia. 
Your primary role is to provide accurate and concise information about Malaysian labor laws, statutory contributions (like EPF, SOCSO, EIS, and PCB/Potongan Cukai Bulanan), and general HR best practices.
When asked about contribution rates or legal specifics, always mention that the user should verify with official sources like KWSP, PERKESO, or LHDN for the most current information.
Do not provide financial or legal advice. Keep your tone friendly, professional, and supportive.
Answer in clear, easy-to-understand language. Use bullet points or short paragraphs for clarity.`;

type Provider = 'gemini' | 'openai' | 'anthropic';

let chatSession: Chat | null = null;

const getActiveProvider = (): Provider => {
    return (localStorage.getItem('HR_CORE_ACTIVE_PROVIDER') as Provider) || 'gemini';
};

const getApiKey = (provider: Provider): string | undefined => {
    if (provider === 'gemini') {
        return localStorage.getItem('HR_CORE_GEMINI_KEY') || process.env.API_KEY;
    }
    if (provider === 'openai') {
        return localStorage.getItem('HR_CORE_OPENAI_KEY') || undefined;
    }
    if (provider === 'anthropic') {
        return localStorage.getItem('HR_CORE_ANTHROPIC_KEY') || undefined;
    }
    return undefined;
};

// --- GEMINI IMPLEMENTATION ---
const getGeminiClient = (apiKey: string) => {
    return new GoogleGenAI({ apiKey });
};

// --- OPENAI IMPLEMENTATION ---
async function* streamOpenAI(apiKey: string, messages: any[]): AsyncGenerator<string> {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemInstruction },
                    ...messages
                ],
                stream: true
            })
        });

        if (!response.ok) throw new Error(`OpenAI API Error: ${response.statusText}`);
        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            const lines = chunk.split("\n");
            for (const line of lines) {
                if (line.startsWith("data: ")) {
                    const data = line.slice(6);
                    if (data === "[DONE]") return;
                    try {
                        const json = JSON.parse(data);
                        const content = json.choices[0]?.delta?.content || "";
                        if (content) yield content;
                    } catch (e) {
                        // ignore parse errors for partial chunks
                    }
                }
            }
        }
    } catch (error) {
        console.error("OpenAI Stream Error:", error);
        yield "Error connecting to OpenAI.";
    }
}

// --- ANTHROPIC IMPLEMENTATION ---
async function* streamAnthropic(apiKey: string, messages: any[]): AsyncGenerator<string> {
    try {
        // Convert 'user'/'bot' to 'user'/'assistant'
        const anthropicMessages = messages.map(m => ({
            role: m.role === 'bot' ? 'assistant' : 'user',
            content: m.content
        }));

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
                'dangerously-allow-browser': 'true' // Required for client-side calls
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20240620',
                max_tokens: 1024,
                system: systemInstruction,
                messages: anthropicMessages,
                stream: true
            })
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Anthropic API Error: ${err}`);
        }
        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            const lines = chunk.split("\n");
            for (const line of lines) {
                if (line.startsWith("event: content_block_delta")) {
                    // The next line usually contains the data
                    continue; 
                }
                if (line.startsWith("data: ")) {
                    try {
                        const json = JSON.parse(line.slice(6));
                        if (json.type === 'content_block_delta' && json.delta?.text) {
                            yield json.delta.text;
                        }
                    } catch (e) {
                         // ignore
                    }
                }
            }
        }
    } catch (error) {
        console.error("Anthropic Stream Error:", error);
        yield "Error connecting to Anthropic. Note: Browser-based calls might be blocked by CORS unless you use a proxy.";
    }
}

// --- UNIFIED EXPORTS ---

export async function* sendMessageToAiStream(message: string, history: { sender: 'user' | 'bot', text: string }[] = []): AsyncGenerator<string> {
    const provider = getActiveProvider();
    const apiKey = getApiKey(provider);

    if (!apiKey) {
        yield "Sila tetapkan API Key di bahagian Tetapan (Settings) atau log masuk semula.";
        return;
    }

    // GEMINI STRATEGY
    if (provider === 'gemini') {
        try {
            if (!chatSession) {
                const ai = getGeminiClient(apiKey);
                chatSession = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: { systemInstruction },
                    history: history.map(h => ({
                        role: h.sender === 'user' ? 'user' : 'model',
                        parts: [{ text: h.text }]
                    }))
                });
            }
            const responseStream = await chatSession.sendMessageStream({ message });
            for await (const chunk of responseStream) {
                yield chunk.text;
            }
        } catch (error) {
            console.error("Gemini Error:", error);
            chatSession = null;
            yield "Ralat sambungan Gemini.";
        }
        return;
    }

    // OPENAI STRATEGY
    if (provider === 'openai') {
        const formattedMessages = history.map(h => ({
            role: h.sender === 'user' ? 'user' : 'assistant',
            content: h.text
        }));
        formattedMessages.push({ role: 'user', content: message });
        
        yield* streamOpenAI(apiKey, formattedMessages);
        return;
    }

    // ANTHROPIC STRATEGY
    if (provider === 'anthropic') {
        const formattedMessages = history.map(h => ({
            role: h.sender === 'user' ? 'user' : 'assistant',
            content: h.text
        }));
        formattedMessages.push({ role: 'user', content: message });

        yield* streamAnthropic(apiKey, formattedMessages);
        return;
    }
}

export async function generateContent(prompt: string): Promise<string> {
    const provider = getActiveProvider();
    const apiKey = getApiKey(provider);

    if (!apiKey) return "API Key missing.";

    try {
        // Gemini
        if (provider === 'gemini') {
            const ai = getGeminiClient(apiKey);
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { systemInstruction }
            });
            return response.text || "";
        }

        // OpenAI
        if (provider === 'openai') {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'system', content: systemInstruction },
                        { role: 'user', content: prompt }
                    ]
                })
            });
            const json = await response.json();
            return json.choices?.[0]?.message?.content || "Error generating content.";
        }

        // Anthropic
        if (provider === 'anthropic') {
             const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'content-type': 'application/json',
                    'dangerously-allow-browser': 'true'
                },
                body: JSON.stringify({
                    model: 'claude-3-5-sonnet-20240620',
                    max_tokens: 1024,
                    system: systemInstruction,
                    messages: [{ role: 'user', content: prompt }]
                })
            });
            const json = await response.json();
            return json.content?.[0]?.text || "Error generating content.";
        }

    } catch (error) {
        console.error("Generate Content Error:", error);
        return "Error generating content. Please check API settings.";
    }

    return "Provider not supported.";
}
