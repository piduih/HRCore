
import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToAiStream } from '../../services/geminiService';
import { Icon } from '../common/Icon';
import { Button } from '../common/Button';

interface AiHelperChatProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    initialPrompt?: string;
    clearInitialPrompt?: () => void;
}

interface Message {
    sender: 'user' | 'bot';
    text: string;
}

const CHAT_HISTORY_STORAGE_KEY = 'hrCoreAiChatHistory';

export const AiHelperChat: React.FC<AiHelperChatProps> = ({ isOpen, setIsOpen, initialPrompt, clearInitialPrompt }) => {
    const [messages, setMessages] = useState<Message[]>(() => {
        try {
            const savedHistory = localStorage.getItem(CHAT_HISTORY_STORAGE_KEY);
            if (savedHistory) {
                const parsedHistory = JSON.parse(savedHistory);
                if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
                    return parsedHistory;
                }
            }
        } catch (error) {
            console.error("Failed to load chat history from localStorage", error);
        }
        return [{ sender: 'bot', text: "Hello! I'm your HR AI Assistant. How can I help you with Malaysian HR policies today?" }];
    });

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Effect to handle initial prompt
    useEffect(() => {
        if (initialPrompt && isOpen) {
            setInput(initialPrompt);
            clearInitialPrompt?.();
        }
    }, [initialPrompt, isOpen, clearInitialPrompt]);

    // Effect to scroll to bottom when new messages are added or chat opens
    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    // Effect to save chat history to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(CHAT_HISTORY_STORAGE_KEY, JSON.stringify(messages));
        } catch (error) {
            console.error("Failed to save chat history to localStorage", error);
        }
    }, [messages]);
    
    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;
        
        const userMessage: Message = { sender: 'user', text: input };
        const currentInput = input;
        
        setInput('');
        setIsLoading(true);
        setMessages(prev => [...prev, userMessage, { sender: 'bot', text: '' }]);

        try {
            const stream = sendMessageToAiStream(currentInput);
            for await (const chunk of stream) {
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    // Create a new message object to avoid mutation
                    newMessages[newMessages.length - 1] = { ...lastMessage, text: lastMessage.text + chunk };
                    return newMessages;
                });
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                newMessages[newMessages.length - 1] = { ...lastMessage, text: "I'm sorry, I'm having trouble connecting right now. Please try again later." };
                return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-primary text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-primary-700 transition-colors"
                aria-label="Open HR AI Assistant"
            >
                <Icon name={isOpen ? 'close' : 'bot'} className="w-8 h-8"/>
            </button>
            
            {isOpen && (
                 <div className="fixed bottom-24 right-6 w-full max-w-sm h-[60vh] bg-white rounded-lg shadow-2xl flex flex-col z-50">
                    <header className="bg-primary text-white p-4 rounded-t-lg flex items-center">
                        <Icon name="bot" className="w-6 h-6 mr-2" />
                        <h3 className="font-semibold">HR Policy Helper</h3>
                    </header>

                    <main className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0"><Icon name="bot" className="w-5 h-5 text-primary" /></div>}
                                <div className={`max-w-xs md:max-w-sm rounded-lg p-3 ${msg.sender === 'user' ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-800'}`}>
                                    <p className="text-sm" dangerouslySetInnerHTML={{__html: msg.text.replace(/\n/g, '<br />')}}/>
                                    {/* Blinking cursor effect for empty streaming messages */}
                                    {isLoading && index === messages.length - 1 && msg.text === '' && (
                                        <span className="inline-block w-2 h-4 bg-neutral-600 animate-pulse ml-1"></span>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </main>

                    <footer className="p-4 border-t">
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleSend()}
                                placeholder="Ask about EPF, SOCSO..."
                                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
                                disabled={isLoading}
                            />
                            <Button onClick={handleSend} disabled={isLoading} size="md">
                                <Icon name="send" className="w-5 h-5"/>
                            </Button>
                        </div>
                    </footer>
                </div>
            )}
        </>
    );
};
