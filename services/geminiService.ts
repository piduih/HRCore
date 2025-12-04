import { GoogleGenAI, Chat } from "@google/genai";

// Ensure the API key is available in the environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: apiKey! });

const systemInstruction = `You are a helpful and professional HR assistant for a company operating in Malaysia. 
Your primary role is to provide accurate and concise information about Malaysian labor laws, statutory contributions (like EPF, SOCSO, EIS, and PCB/Potongan Cukai Bulanan), and general HR best practices.
When asked about contribution rates or legal specifics, always mention that the user should verify with official sources like KWSP, PERKESO, or LHDN for the most current information.
Do not provide financial or legal advice. Keep your tone friendly, professional, and supportive.
Answer in clear, easy-to-understand language. Use bullet points or short paragraphs for clarity.`;

let chat: Chat | null = null;

const initializeChat = () => {
    if (!chat) {
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: systemInstruction,
            },
        });
    }
};

export async function* sendMessageToAiStream(message: string): AsyncGenerator<string> {
    if (!apiKey) {
        yield "I am currently offline as my API key is not configured. Please contact support.";
        return;
    }
    
    initializeChat();

    try {
        const responseStream = await chat!.sendMessageStream({ message: message });
        for await (const chunk of responseStream) {
            yield chunk.text;
        }
    } catch (error) {
        console.error("Error sending message to Gemini:", error);
        // Reset chat on error
        chat = null;
        yield "Sorry, I encountered an error while processing your request. Please try again.";
    }
}

export async function generateContent(prompt: string): Promise<string> {
    if (!apiKey) {
        return "AI service is unavailable. API key not configured.";
    }
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating content from Gemini:", error);
        return "Sorry, I encountered an error while processing your request. Please try again.";
    }
}
