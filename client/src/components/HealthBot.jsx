import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Trash2, ArrowUpRight, Plus, Sparkles, Activity, ShieldCheck, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HealthBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Welcome to Sri Kamala Hospital Clinical AI. I am Dr. Kamala. Describe your symptoms or ask about our departments.", sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const { chatWithAI } = await import('../utils/api');
            const resp = await chatWithAI(input);
            const botResponse = resp.data.success ? resp.data.response : "I am experiencing clinical network issues. Please contact +91 91544 04051.";
            setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        } catch (err) {
            console.error("Chat Error:", err);
            setMessages(prev => [...prev, { id: Date.now() + 1, text: "Emergency Override: I am currently unable to process queries. Please call our 24/7 hotline directly.", sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-10 right-10 z-[150]">
            <AnimatePresence>
                {!isOpen && (
                    <motion.button initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 45 }}
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        onClick={() => setIsOpen(true)}
                        className="w-16 h-16 bg-hospital-dark text-white rounded-[32px] shadow-4xl flex items-center justify-center group border-4 border-white overflow-hidden relative">
                        <div className="absolute inset-0 bg-hospital-primary opacity-20 animate-pulse"></div>
                        <Activity size={24} className="relative z-10 group-hover:scale-110 transition-transform" />
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="w-[380px] h-[600px] bg-white rounded-[50px] shadow-4xl flex flex-col overflow-hidden border-2 border-white">
                        
                        <div className="p-8 bg-hospital-dark text-white relative overflow-hidden flex items-center gap-4">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-hospital-primary opacity-20 rounded-full blur-3xl -mr-12 -mt-12"></div>
                            <div className="w-14 h-14 p-1 bg-white rounded-2xl relative z-10">
                                <img src="/logo.png" className="w-full h-full object-contain" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-xl font-black flex items-center gap-2">CLINICAL AI <Sparkles size={14} className="text-hospital-secondary" /></h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/50">Online Triage Service</span>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="ml-auto w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all z-10">
                                <X size={20} />
                            </button>
                        </div>

                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50/50 scrollbar-hide">
                            <div className="flex justify-center mb-6">
                                <div className="px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full flex items-center gap-2">
                                    <ShieldCheck size={12} className="text-indigo-600" />
                                    <span className="text-[9px] font-black uppercase text-indigo-600 tracking-widest">End-to-End Encrypted Channel</span>
                                </div>
                            </div>

                            {messages.map((m, i) => (
                                <motion.div key={m.id} initial={{ x: m.sender === 'user' ? 20 : -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                                    className={`flex items-end gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-10 h-10 flex-shrink-0 rounded-2xl flex items-center justify-center text-white shadow-sm overflow-hidden ${m.sender === 'user' ? 'bg-hospital-secondary' : 'bg-hospital-primary p-2'}`}>
                                        {m.sender === 'user' ? <User size={18}/> : <img src="/logo.png" className="w-full h-full object-contain brightness-0 invert" />}
                                    </div>
                                    <div className={`max-w-[80%] rounded-3xl px-6 py-4 text-sm font-bold shadow-sm leading-relaxed ${m.sender === 'user' ? 'bg-hospital-secondary text-white rounded-br-none' : 'bg-white text-hospital-dark rounded-bl-none border border-gray-100'}`}>
                                        {m.text}
                                        <p className={`text-[9px] mt-2 font-black uppercase opacity-40 tracking-widest`}>{m.time}</p>
                                    </div>
                                </motion.div>
                            ))}
                            
                            {isTyping && (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center"><Bot size={18} className="text-gray-300" /></div>
                                    <div className="bg-white border border-gray-100 px-6 py-4 rounded-3xl rounded-bl-none shadow-sm flex gap-1">
                                        {[1, 2, 3].map(d => <motion.div key={d} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: d * 0.2 }} className="w-1.5 h-1.5 bg-hospital-primary rounded-full"></motion.div>)}
                                    </div>
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSend} className="p-6 bg-white border-t border-gray-100 flex items-center gap-4">
                            <div className="flex-1 relative group">
                                <input type="text" placeholder="Type clinical query..." value={input} onChange={(e) => setInput(e.target.value)}
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-hospital-primary p-5 pr-14 rounded-[24px] outline-none text-xs font-black transition-all placeholder:text-gray-300" />
                                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-hospital-primary hover:scale-125 transition-all">
                                    <Send size={24} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HealthBot;
