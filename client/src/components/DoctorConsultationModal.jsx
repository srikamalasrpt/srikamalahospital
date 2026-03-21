import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Activity, Sparkles, Phone, CalendarCheck } from 'lucide-react';

const DoctorConsultationModal = ({ isOpen, onClose, doctor }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const endOfMessagesRef = useRef(null);

    useEffect(() => {
        if (isOpen && doctor) {
            setMessages([{
                id: Date.now(),
                sender: 'ai',
                text: `Hello, I'm the AI assistant for ${doctor.name}. How can I help you today regarding ${doctor.specialty} or general hospital inquiries?`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
            setInput('');
        }
    }, [isOpen, doctor]);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !doctor) return;

        const userMsg = { id: Date.now(), sender: 'user', text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const { chatWithAI } = await import('../utils/api');
            const chatHistory = messages.map(m => {
                const text = typeof m.text === 'string' && m.text.includes('|||') ? m.text.split('|||')[1].trim() : m.text;
                return `${m.sender.toUpperCase()}: ${text}`;
            }).join('\n');

            const prompt = `You are the digital medical assistant for ${doctor.name}, a specialist in ${doctor.specialty} at Sri Kamala Hospital (Contact: 99480 76665). 
Behavior Rules:
1. If the user greets you or says casual things like 'hi' or 'how are you', respond warmly, conversationally, and naturally.
2. If the user provides symptoms, be highly empathetic, answer concisely (max 3 sentences), and advise booking an appointment with ${doctor.name}.

Recent Conversation Context:
${chatHistory}

User's New Message: "${userMsg.text}"

CRITICAL RULE: You MUST format your precise response as: 
[Telugu Translation of response]
|||
[English Translation of response]`;

            const resp = await chatWithAI(prompt);


            setMessages(prev => [...prev, {
                id: Date.now(),
                sender: 'ai',
                text: resp.data.response || "I am currently unavailable due to network issues. Please contact the front desk at 99480 76665.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } catch (err) {
            console.error("Consultation Error:", err);
            setMessages(prev => [...prev, {
                id: Date.now(),
                sender: 'ai',
                text: "My connection to the hospital servers is weak right now. Please call our reception directly at 99480 76665.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-hospital-dark/80 backdrop-blur-md z-40 pointer-events-auto" onClick={onClose} />
                    <motion.div initial={{ opacity: 0, y: 100, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
                        className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 md:w-[450px] md:h-[600px] bg-white rounded-t-[40px] md:rounded-[40px] shadow-4xl z-50 overflow-hidden flex flex-col pointer-events-auto border-2 border-hospital-primary/10">

                        {/* Header */}
                        <div className="bg-hospital-dark p-6 relative flex flex-col items-center flex-shrink-0">
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-white overflow-hidden">
                                <Activity size={120} className="-mr-10 -mt-10" />
                            </div>
                            <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-full p-2">
                                <X size={20} />
                            </button>

                            <div className="w-16 h-16 rounded-full border-2 border-hospital-primary/50 overflow-hidden relative mb-4 shadow-lg group">
                                <div className="absolute inset-0 bg-hospital-primary/20 backdrop-blur-sm z-10 flex items-center justify-center opacity-0 transition-opacity">
                                    <Sparkles size={20} className="text-white" />
                                </div>
                                <img src={doctor?.img} className="w-full h-full object-cover" alt="Doctor" />
                                <div className="absolute bottom-1 right-1 w-3 h-3 bg-hospital-mint rounded-full border-2 border-hospital-dark"></div>
                            </div>

                            <h3 className="text-xl font-black text-white text-center tracking-tight font-['Noto_Sans_Telugu']">{doctor?.name}</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-hospital-secondary text-center mt-1">{doctor?.specialty} Dept</p>
                            <div className="flex gap-2 mt-4">
                                <a href="/#booking" onClick={() => { onClose(); window.scrollTo(0, document.body.scrollHeight) }} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 transition-colors rounded-full text-[9px] font-black tracking-widest text-white uppercase flex items-center gap-2"><CalendarCheck size={12} /> Book Next OP</a>
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-6 bg-[#f8fafc] flex flex-col gap-4 relative">
                            {messages.map((msg, i) => (
                                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className="flex max-w-[85%] gap-2 items-end">
                                        {msg.sender === 'ai' && (
                                            <div className="w-6 h-6 rounded-full bg-hospital-primary text-white flex items-center justify-center flex-shrink-0 mb-1">
                                                <Bot size={12} />
                                            </div>
                                        )}
                                        <div className={`p-4 rounded-2xl relative shadow-sm ${msg.sender === 'user' ? 'bg-hospital-dark text-white rounded-br-sm' : 'bg-white border border-gray-100 text-hospital-dark rounded-bl-sm'}`}>
                                            {msg.text.includes('|||') ? (
                                                <>
                                                    <p className="text-sm font-medium leading-relaxed font-['Noto_Sans_Telugu']">{msg.text.split('|||')[0].trim()}</p>
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-hospital-primary opacity-60 mt-3 pt-3 border-t border-gray-100">{msg.text.split('|||')[1].trim()}</p>
                                                </>
                                            ) : (
                                                <p className="text-sm font-medium leading-relaxed font-['Noto_Sans_Telugu']">{msg.text}</p>
                                            )}
                                            <p className={`text-[8px] font-black mt-2 uppercase tracking-widest flex items-center gap-1 ${msg.sender === 'user' ? 'text-white/40 justify-end' : 'text-gray-400'}`}>
                                                {msg.time} {msg.sender === 'ai' && <Sparkles size={8} />}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex w-full justify-start mt-2">
                                    <div className="bg-gray-100 rounded-2xl rounded-bl-sm p-4 flex gap-1 items-center">
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={endOfMessagesRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-100 flex-shrink-0">
                            <div className="relative flex items-center bg-[#f8fafc] border border-gray-200 rounded-2xl p-1 shadow-inner focus-within:border-hospital-primary/30 transition-colors">
                                <input value={input} onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={`Message ${doctor?.name || 'Doctor'}...`}
                                    className="w-full bg-transparent border-none px-4 py-3 outline-none text-sm text-hospital-dark font-medium placeholder:text-gray-400" />
                                <button onClick={handleSend} disabled={!input.trim() || isLoading}
                                    className="p-3 bg-hospital-primary text-white rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100">
                                    <Send size={16} />
                                </button>
                            </div>
                            <p className="text-center text-[8px] font-black uppercase tracking-widest text-gray-300 mt-3 pt-3 border-t border-gray-100">This is an AI simulation for pre-consultation aid. Do not substitute for emergency care.</p>
                        </div>

                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default DoctorConsultationModal;
