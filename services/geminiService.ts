
import { GoogleGenAI, Chat } from "@google/genai";

const systemInstruction = `You are a helpful and professional HR assistant for a company operating in Malaysia. 
Your primary role is to provide accurate and concise information about Malaysian labor laws, statutory contributions (like EPF, SOCSO, EIS, and PCB/Potongan Cukai Bulanan), and general HR best practices.
When asked about contribution rates or legal specifics, always mention that the user should verify with official sources like KWSP, PERKESO, or LHDN for the most current information.
Do not provide financial or legal advice. Keep your tone friendly, professional, and supportive.
Answer in clear, easy-to-understand language. Use bullet points or short paragraphs for clarity.`;

let chatSession: Chat | null = null;

const getAiClient = () => {
    // Priority 1: Check Local Storage for manually entered key
    const localKey = localStorage.getItem('HR_CORE_GEMINI_KEY');
    if (localKey) {
        return new GoogleGenAI({ apiKey: localKey });
    }

    // Priority 2: Check Environment Variable (set via AI Studio button)
    const apiKey = process.env.API_KEY;
    if (apiKey) {
        return new GoogleGenAI({ apiKey });
    }

    throw new Error("API_KEY environment variable not set and no local key found.");
};

export async function* sendMessageToAiStream(message: string): AsyncGenerator<string> {
    try {
        if (!chatSession) {
            const ai = getAiClient();
            chatSession = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: systemInstruction,
                },
            });
        }

        const responseStream = await chatSession.sendMessageStream({ message: message });
        for await (const chunk of responseStream) {
            yield chunk.text;
        }
    } catch (error) {
        console.error("Error sending message to Gemini:", error);
        // Reset chat session on error so we try to reconnect next time
        chatSession = null;
        yield "Maaf, terdapat masalah sambungan API. Sila semak tetapan API Key anda.";
    }
}

export async function generateContent(prompt: string): Promise<string> {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || "";
    } catch (error) {
        console.error("Error generating content from Gemini:", error);
        return "Maaf, saya tidak dapat menjana kandungan buat masa ini. Sila semak tetapan API Key anda.";
    }
}
