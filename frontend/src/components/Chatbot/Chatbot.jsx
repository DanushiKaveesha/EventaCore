import React, { useState, useRef, useEffect } from "react";
import { 
    ChatBubbleLeftEllipsisIcon, 
    XMarkIcon, 
    PaperAirplaneIcon,
    SparklesIcon
} from "@heroicons/react/24/outline";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hello! I am the EventaCore Assistant. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const response = await fetch("http://localhost:5000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMsg.text }),
            });

            if (response.status === 404) {
                setMessages((prev) => [...prev, { sender: "bot", text: "🚨 API Route Not Found! Please go to your backend terminal, press CTRL+C to stop it, and run 'npm start' again so it loads the new chatbot code." }]);
                setIsTyping(false);
                return;
            }

            const data = await response.json();
            
            if (data.success) {
                setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
            } else {
                setMessages((prev) => [...prev, { sender: "bot", text: "Sorry, I am having trouble connecting to the server right now." }]);
            }
        } catch (error) {
            console.error("Chatbot Error:", error);
            setMessages((prev) => [...prev, { sender: "bot", text: "Connection error. Make sure the backend server is running." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chatbot Window */}
            {isOpen && (
                <div className="bg-white w-80 md:w-96 rounded-2xl shadow-2xl overflow-hidden mb-4 border border-gray-200 transition-all duration-300 transform scale-100 flex flex-col h-[500px]">
                    {/* Header */}
                    <div className="bg-blue-600 p-4 text-white flex justify-between items-center shadow-md">
                        <div className="flex items-center gap-2">
                            <SparklesIcon className="w-5 h-5 text-yellow-300" />
                            <h3 className="font-semibold tracking-wide">Campus Assistant</h3>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="text-blue-100 hover:text-white transition-colors"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-3">
                        {messages.map((msg, idx) => (
                            <div 
                                key={idx} 
                                className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                                    msg.sender === "user" 
                                    ? "bg-blue-500 text-white rounded-br-none self-end" 
                                    : "bg-white border border-gray-200 text-gray-700 rounded-bl-none self-start shadow-sm"
                                }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="bg-white border border-gray-200 text-gray-500 p-3 rounded-2xl rounded-bl-none self-start shadow-sm max-w-[50%] flex gap-1 items-center">
                                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></span>
                                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Field */}
                    <form 
                        onSubmit={sendMessage}
                        className="p-3 bg-white border-t border-gray-200 flex items-center gap-2"
                    >
                        <input 
                            type="text" 
                            className="flex-1 bg-slate-100 px-4 py-2 rounded-full outline-none text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-100 transition-all"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button 
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className="bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all"
                        >
                            <PaperAirplaneIcon className="w-5 h-5 -rotate-45 ml-0.5" />
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`bg-blue-600 p-4 rounded-full shadow-2xl text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95 ${isOpen ? 'rotate-90 opacity-0 pointer-events-none absolute' : 'rotate-0 opacity-100'}`}
            >
                <ChatBubbleLeftEllipsisIcon className="w-7 h-7" />
            </button>
        </div>
    );
};

export default Chatbot;
