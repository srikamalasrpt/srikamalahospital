import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Trash2, ArrowUpRight, Plus, Sparkles, Activity, ShieldCheck, Phone, MessageSquarePlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HealthBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Welcome to Sri Kamala Hospital Clinical AI. I am Dr. Kamala. How can I assist you today?", sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    const suggestions = [
        "Check symptoms",
        "Book scanning",
        "Pharmacy help",
        "Hospital location"
    ];

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, isTyping]);

    const handleVisionUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = reader.result;
            const userMsg = {
                id: Date.now(),
                text: "Attached a clinical image for analysis.",
                sender: 'user',
                image: base64,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, userMsg]);
            setIsTyping(true);

            try {
                const { analyzeVisionImage } = await import('../utils/api');
                const resp = await analyzeVisionImage(base64, "Analyzed via Triage Bot");

                if (resp.data.success && resp.data.analysis) {
                    const ai = resp.data.analysis;
                    const triageText = `[AI TRIAGE REPORT]\n\nCondition: ${ai.condition.en}\n\nPrecautions: ${ai.precautions.map(p => p.en).join(', ')}\n\nAction: Please visit the ${ai.lab_tests?.[0]?.en || 'general ward'} for further evaluation.`;
                    setMessages(prev => [...prev, {
                        id: Date.now() + 1,
                        text: triageText,
                        sender: 'bot',
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }]);
                } else {
                    throw new Error("Triage failed");
                }
            } catch (err) {
                setMessages(prev => [...prev, { id: Date.now() + 1, text: "Clinical Image Error: I am unable to analyze this image right now. Please call +91 99480 76665.", sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
            } finally {
                setIsTyping(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSend = async (manualText = null) => {
        const textToSend = manualText || input;
        if (!textToSend.trim()) return;

        const userMsg = { id: Date.now(), text: textToSend, sender: 'user', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const { chatWithAI } = await import('../utils/api');

            const chatHistory = messages.slice(-4).map(m => {
                const text = typeof m.text === 'string' && m.text.includes('|||') ? m.text.split('|||')[1].trim() : m.text;
                return `${m.sender.toUpperCase()}: ${text}`;
            }).join('\n');

            const prompt = `You are Dr. Kamala, a highly empathetic AI assistant at Sri Kamala Hospital.
Tone: Polite, patient, welcoming.
Max 2 sentences.

Context: ${chatHistory}
User message: "${textToSend}"

Format: [Telugu] ||| [English]`;

            const resp = await chatWithAI(prompt);
            const botResponse = resp.data.success ? resp.data.response : "Clinical network delay. Contact +91 99480 76665.";
            setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        } catch (err) {
            setMessages(prev => [...prev, { id: Date.now() + 1, text: "Emergency Override: Unable to process. Call our hotline directly.", sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[150]">
            <AnimatePresence>
                {!isOpen && (
                    <motion.button initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 45 }}
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        onClick={() => setIsOpen(true)}
                        className="w-14 h-14 bg-hospital-dark text-white rounded-[24px] shadow-4xl flex items-center justify-center group border-4 border-white overflow-hidden relative">
                        <div className="absolute inset-0 bg-hospital-primary opacity-20 animate-pulse"></div>
                        <Activity size={20} className="relative z-10 group-hover:scale-110 transition-transform" />
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50, scale: 0.9, x: 20 }} 
                        animate={{ opacity: 1, y: 0, scale: 1, x: 0 }} 
                        exit={{ opacity: 0, y: 30, scale: 0.9, x: 10 }}
                        className="w-full md:w-[350px] h-[80vh] md:h-[550px] bg-white rounded-[40px] shadow-4xl flex flex-col overflow-hidden border-2 border-white">

                        <div className="p-6 bg-hospital-dark text-white relative overflow-hidden flex items-center gap-4">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-hospital-primary opacity-20 rounded-full blur-3xl -mr-12 -mt-12"></div>
                            <div className="w-10 h-10 p-1 bg-white rounded-xl relative z-10">
                                <img src="/logo.png" className="w-full h-full object-contain" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-sm font-black flex items-center gap-2">CLINICAL AI <Sparkles size={12} className="text-hospital-secondary" /></h3>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-[8px] uppercase font-bold tracking-widest text-white/50">Online Triage</span>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="ml-auto w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all z-10">
                                <X size={16} />
                            </button>
                        </div>

                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
                            {messages.map((m, i) => (
                                <motion.div key={m.id} initial={{ x: m.sender === 'user' ? 20 : -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                                    className={`flex items-end gap-2 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 flex-shrink-0 rounded-xl flex items-center justify-center text-white shadow-sm overflow-hidden ${m.sender === 'user' ? 'bg-hospital-secondary' : 'bg-hospital-primary p-2'}`}>
                                        {m.sender === 'user' ? <User size={14} /> : <img src="/logo.png" className="w-full h-full object-contain brightness-0 invert" />}
                                    </div>
                                    <div className={`max-w-[85%] rounded-[24px] px-5 py-3 text-[12px] font-bold shadow-sm leading-relaxed ${m.sender === 'user' ? 'bg-hospital-secondary text-white rounded-br-none' : 'bg-white text-hospital-dark rounded-bl-none border border-gray-100'}`}>
                                        {m.image && <img src={m.image} className="w-full rounded-xl mb-3 border-2 border-white/20" alt="Clinical Upload" />}
                                        {m.text && typeof m.text === 'string' && m.text.includes('|||') ? (
                                            <>
                                                <p className="font-['Noto_Sans_Telugu']">{m.text.split('|||')[0].trim()}</p>
                                                <p className="block text-[8px] uppercase font-black tracking-widest opacity-50 mt-2">{m.text.split('|||')[1].trim()}</p>
                                            </>
                                        ) : (
                                            <p className="font-['Noto_Sans_Telugu']">{m.text}</p>
                                        )}
                                        <p className={`text-[7px] mt-1.5 font-black uppercase opacity-40 tracking-widest`}>{m.time}</p>
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center"><Bot size={14} className="text-gray-300" /></div>
                                    <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                                        {[1, 2, 3].map(d => <motion.div key={d} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: d * 0.2 }} className="w-1 h-1 bg-hospital-primary rounded-full"></motion.div>)}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-white border-t border-gray-100 space-y-4">
                            {messages.length < 3 && !isTyping && (
                                <div className="flex flex-wrap gap-2">
                                    {suggestions.map(s => (
                                        <button key={s} onClick={() => handleSend(s)} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-[8px] font-black uppercase text-hospital-dark hover:bg-hospital-primary/5 transition-all flex items-center gap-1">
                                            <MessageSquarePlus size={10} className="text-hospital-primary" /> {s}
                                        </button>
                                    ))}
                                </div>
                            )}
                            
                            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-3">
                                <label className="w-10 h-10 flex-shrink-0 bg-gray-50 hover:bg-hospital-primary/10 text-gray-400 hover:text-hospital-primary rounded-xl flex items-center justify-center cursor-pointer transition-all border-2 border-transparent">
                                    <Plus size={18} />
                                    <input type="file" accept="image/*" onChange={handleVisionUpload} className="hidden" />
                                </label>
                                <div className="flex-1 relative group">
                                    <input type="text" placeholder="Query..." value={input} onChange={(e) => setInput(e.target.value)}
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-hospital-primary p-4 pr-12 rounded-[20px] outline-none text-[10px] font-black transition-all" />
                                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-hospital-primary hover:scale-110">
                                        <Send size={20} />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HealthBot;
