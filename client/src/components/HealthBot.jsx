import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Trash2, ArrowUpRight, Plus, Sparkles, Activity, ShieldCheck, Phone, MessageSquarePlus, Scissors, Syringe, Droplets, Pill } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HealthBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Welcome to Sri Kamala Hospital Clinical AI Core. I am Dr. Kamala. How can I assist your diagnostic path today?", sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    const suggestions = [
        "Symptom Check",
        "Clinical Scanning",
        "Apothecary Help",
        "Institutional Status"
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
                text: "Attached clinical imagery for molecular analysis.",
                sender: 'user',
                image: base64,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, userMsg]);
            setIsTyping(true);

            try {
                const { analyzeVisionImage } = await import('../utils/api');
                const resp = await analyzeVisionImage(base64, "Analyzed via Triage Core v3.0");

                if (resp.data.success && resp.data.analysis) {
                    const ai = resp.data.analysis;
                    const triageText = `[AI CLINICAL TRIAGE REPORT]\n\nDetected Condition: ${ai.condition.en}\n\nClinical Protocols: ${ai.precautions.map(p => p.en).join(', ')}\n\nDeployment: Please initiate immediate visit to the ${ai.lab_tests?.[0]?.en || 'Emergency Response Ward'} for specialized intervention.`;
                    setMessages(prev => [...prev, {
                        id: Date.now() + 1,
                        text: triageText,
                        sender: 'bot',
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }]);
                } else {
                    throw new Error("Triage node failure");
                }
            } catch (err) {
                setMessages(prev => [...prev, { id: Date.now() + 1, text: "NODE ERROR: Imagery interpretation interrupted. Please deploy manual support via +91 99480 76665.", sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
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

            const prompt = `You are Dr. Kamala, a highly empathetic and sophisticated Clinical AI at Sri Kamala Hospital.
Tone: Highly professional, patient, clinical.
Max 2 sentences.

Context: ${chatHistory}
User message: "${textToSend}"

Format: [Telugu Translation] ||| [English Translation]`;

            const resp = await chatWithAI(prompt);
            const botResponse = resp.data.success ? resp.data.response : "Clinical link severed. Access emergency protocol: +91 99480 76665.";
            setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        } catch (err) {
            setMessages(prev => [...prev, { id: Date.now() + 1, text: "PROTOCOL OVERRIDE: Interaction node failed. Deploy direct tactical call to our medical center.", sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-10 right-10 z-[200]">
            <AnimatePresence>
                {!isOpen && (
                  <div className="relative">
                    <motion.button initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }}
                        whileHover={{ scale: 1.15, rotate: 15 }}
                        onClick={() => setIsOpen(true)}
                        className="w-16 h-16 bg-hospital-dark text-white rounded-[24px] shadow-4xl flex items-center justify-center group border border-white/20 overflow-hidden relative backdrop-blur-3xl">
                        <div className="absolute inset-x-0 bottom-0 top-0 bg-white group-hover:opacity-0 transition-opacity"></div>
                        <Activity size={24} className="relative z-10 group-hover:scale-110 transition-transform text-black group-hover:text-hospital-primary" />
                    </motion.button>
                     <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="absolute right-20 top-1/2 -translate-y-1/2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-3xl hidden md:block pointer-events-none">
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] whitespace-nowrap text-white italic">Deploy Clinical AI Core</p>
                    </motion.div>
                  </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 100, scale: 0.8 }} 
                        animate={{ opacity: 1, y: 0, scale: 1 }} 
                        exit={{ opacity: 0, y: 100, scale: 0.8 }}
                        className="w-full md:w-[420px] h-[85vh] md:h-[650px] bg-[#050505] rounded-[50px] shadow-4xl flex flex-col overflow-hidden border border-white/10 backdrop-blur-3xl relative">
                        
                        {/* Background Decor */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] text-white pointer-events-none w-full flex flex-col items-center gap-20">
                            <Scissors size={200} />
                            <Plus size={200} />
                        </div>

                        {/* Clinical Header */}
                        <div className="p-8 bg-[#0a0a0a] text-white border-b border-white/5 relative overflow-hidden flex items-center gap-6">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-hospital-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
                            <div className="w-14 h-14 p-2 bg-white/5 border border-white/10 rounded-2xl relative z-10 shadow-2xl overflow-hidden group">
                                <div className="absolute inset-x-0 bottom-0 top-0 bg-white group-hover:opacity-0 transition-opacity"></div>
                                <img src="/logo.png" className="w-full h-full object-contain relative z-10" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-base font-black flex items-center gap-3 tracking-tighter">KAMALA AI CORE <Sparkles size={16} className="text-hospital-secondary animate-pulse" /></h3>
                                <div className="flex items-center gap-3 mt-1.5">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                                    <div className="absolute w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-[9px] uppercase font-black tracking-[0.4em] text-hospital-primary">Active Surveillance</span>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="ml-auto w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white/10 border border-white/10 transition-all z-20 group">
                                <X size={20} className="group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>

                        {/* Secure Messaging Stream */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 bg-transparent scrollbar-clinical">
                            {messages.map((m, i) => (
                                <motion.div key={m.id} initial={{ x: m.sender === 'user' ? 30 : -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                                    className={`flex items-end gap-4 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-10 h-10 flex-shrink-0 rounded-2xl flex items-center justify-center text-white shadow-2xl border border-white/10 overflow-hidden ${m.sender === 'user' ? 'bg-hospital-secondary' : 'bg-[#111] p-2'}`}>
                                        {m.sender === 'user' ? <User size={18} /> : <img src="/logo.png" className="w-full h-full object-contain brightness-0 invert" />}
                                    </div>
                                    <div className={`max-w-[80%] rounded-[35px] px-8 py-5 text-[14px] font-bold shadow-4xl leading-relaxed relative group ${m.sender === 'user' ? 'bg-white text-black rounded-br-none' : 'bg-white/5 backdrop-blur-3xl text-white rounded-bl-none border border-white/10'}`}>
                                        {m.image && <img src={m.image} className="w-full rounded-2xl mb-4 border border-white/10 grayscale hover:grayscale-0 transition-all cursor-pointer shadow-4xl" alt="Clinical imagery" />}
                                        {m.text && typeof m.text === 'string' && m.text.includes('|||') ? (
                                            <>
                                                <p className="font-['Noto_Sans_Telugu'] text-base mb-3 leading-snug">{m.text.split('|||')[0].trim()}</p>
                                                <div className={`h-px w-1/3 mb-3 ${m.sender === 'user' ? 'bg-black/10' : 'bg-white/10'}`}></div>
                                                <p className={`block text-[10px] uppercase font-black tracking-[0.3em] italic ${m.sender === 'user' ? 'text-black/40' : 'text-hospital-secondary'}`}>{m.text.split('|||')[1].trim()}</p>
                                            </>
                                        ) : (
                                            <p className="font-['Noto_Sans_Telugu'] text-base tracking-tight">{m.text}</p>
                                        )}
                                        <p className={`text-[8px] mt-3 font-black uppercase tracking-[0.3em] opacity-30 italic absolute ${m.sender === 'user' ? '-left-16 bottom-2' : '-right-16 bottom-2'}`}>{m.time}</p>
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center"><Bot size={18} className="text-hospital-primary animate-pulse" /></div>
                                    <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-[30px] rounded-bl-none shadow-4xl flex gap-2">
                                        {[1, 2, 3].map(d => <motion.div key={d} animate={{ opacity: [0.2, 1, 0.2], y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: d * 0.2 }} className="w-1.5 h-1.5 bg-hospital-primary rounded-full"></motion.div>)}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Interaction Module */}
                        <div className="p-8 bg-[#0a0a0a] border-t border-white/5 space-y-6">
                            {messages.length < 3 && !isTyping && (
                                <div className="flex flex-wrap gap-3">
                                    {suggestions.map(s => (
                                        <button key={s} onClick={() => handleSend(s)} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:bg-hospital-primary hover:text-black hover:border-transparent transition-all flex items-center gap-3 active:scale-95">
                                            <MessageSquarePlus size={14} className="text-hospital-primary group-hover:text-black" /> {s}
                                        </button>
                                    ))}
                                </div>
                            )}
                            
                            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-5">
                                <label className="w-14 h-14 flex-shrink-0 bg-white/5 hover:bg-white/10 text-gray-500 hover:text-hospital-primary rounded-2xl flex items-center justify-center cursor-pointer transition-all border border-white/10 shadow-2xl relative group overflow-hidden active:scale-90">
                                    <Plus size={24} className="group-hover:rotate-180 transition-transform duration-500" />
                                    <input type="file" accept="image/*" onChange={handleVisionUpload} className="hidden" />
                                </label>
                                <div className="flex-1 relative group">
                                    <input type="text" placeholder="Access clinical intelligence..." value={input} onChange={(e) => setInput(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 focus:border-hospital-primary/30 p-5 pr-16 rounded-[28px] outline-none text-[13px] font-black transition-all text-white placeholder:text-gray-700 backdrop-blur-3xl" />
                                    <button type="submit" className={`absolute right-4 top-1/2 -translate-y-1/2 text-hospital-primary hover:scale-110 active:scale-90 transition-all ${!input.trim() ? 'opacity-20 grayscale pointer-events-none' : 'opacity-100 shadow-neon-primary'}`}>
                                        <Send size={24} strokeWidth={2.5} />
                                    </button>
                                </div>
                            </form>
                            <p className="text-center text-[8px] font-black uppercase tracking-[0.5em] text-gray-700 italic">Advanced HIPAA Secure Encryption Active</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HealthBot;
