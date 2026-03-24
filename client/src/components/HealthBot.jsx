import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Trash2, ArrowUpRight, Plus, Sparkles, Activity, ShieldCheck, Phone, MessageSquarePlus, Scissors, Syringe, Droplets, Pill, Download, Globe, Languages, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import { bookAppointment, getConfig } from '../utils/api';

const HealthBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [language, setLanguage] = useState('te'); // te or en
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [bookingState, setBookingState] = useState({ active: false, step: 0, data: {} });
    const [isDismissed, setIsDismissed] = useState(false);
    const scrollRef = useRef(null);

    // ... (rest of the logic remains the same, but use isDismissed in the return)
    const handleDismiss = (e) => {
        e.stopPropagation();
        setIsDismissed(true);
    };

    if (isDismissed) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[600]">
            <AnimatePresence>
                {!isOpen && (
                  <div className="relative group">
                    <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        onClick={() => setIsOpen(true)}
                        className="w-12 h-12 bg-white text-hospital-primary rounded-2xl shadow-xl flex items-center justify-center border border-black/5 hover:scale-105 transition-all">
                        <Activity size={20} className="relative z-10" />
                    </motion.button>
                    
                    {/* Tiny Dismiss Button */}
                    <button 
                        onClick={handleDismiss}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-white border border-black/5 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X size={10} />
                    </button>

                    <div className="absolute right-14 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white border border-black/5 rounded-lg shadow-lg hidden md:block pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-[7px] font-black uppercase tracking-[0.4em] whitespace-nowrap text-slate-400 italic">Kamala AI Dispatch</p>
                    </div>
                  </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                        animate={{ opacity: 1, scale: 1, y: 0 }} 
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-[90vw] md:w-[380px] h-[80vh] md:h-[620px] bg-white rounded-[40px] shadow-4xl flex flex-col overflow-hidden border border-black/5 backdrop-blur-3xl relative">
                        
                        {/* Transparent Logo Background Decor */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                            <img src="/logo.png" className="w-[80%] h-auto object-contain" alt="Background Watermark" />
                        </div>

                        {/* High Fidelity Header */}
                        <div className="p-6 bg-slate-50 text-slate-900 border-b border-black/5 relative z-10 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 p-1.5 bg-white border border-black/5 rounded-xl relative shadow-md">
                                     <img src="/logo.png" className="w-full h-full object-contain relative z-10" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-[10px] font-black tracking-widest uppercase italic leading-none whitespace-nowrap">KAMALA CORE <span className="text-hospital-primary font-serif">v5.0</span></h3>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-neon-mint"></div>
                                        <span className="text-[6px] uppercase font-black tracking-[0.3em] text-slate-300">Surveillance: Active</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <button onClick={toggleLanguage} className="px-3 py-1.5 bg-white border border-black/5 rounded-full text-[7px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all text-hospital-secondary group">
                                    <Globe size={10} /> {language === 'te' ? 'TE' : 'EN'}
                                </button>
                                <button onClick={() => setIsOpen(false)} className="w-8 h-8 bg-white rounded-xl flex items-center justify-center hover:bg-slate-50 text-slate-400 border border-black/5 transition-all">
                                    <X size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Messaging Stream */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 relative z-10 scrollbar-hide">
                            {messages.map((m, i) => (
                                <motion.div key={m.id} initial={{ x: m.sender === 'user' ? 20 : -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                                    className={`flex items-end gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-7 h-7 flex-shrink-0 rounded-lg flex items-center justify-center border border-black/5 shadow-md bg-slate-50`}>
                                        {m.sender === 'user' ? <User size={12} className="text-slate-400" /> : <img src="/logo.png" className="w-4 h-4 object-contain" />}
                                    </div>
                                    <div className={`max-w-[85%] text-left rounded-[24px] px-5 py-3.5 text-[11px] shadow-lg relative ${m.sender === 'user' ? 'bg-hospital-primary text-black rounded-br-none' : 'bg-slate-50 text-slate-900 rounded-bl-none border border-black/5'}`}>
                                        <p className={`font-bold italic tracking-tight leading-relaxed ${language === 'te' ? "font-['Noto_Sans_Telugu']" : ""}`}>
                                            {m.text}
                                        </p>
                                        
                                        {m.isReceipt && (
                                            <div className="mt-4 space-y-4 pt-4 border-t border-black/5">
                                                <button onClick={() => generateReceiptPDF(m.receiptData)} className="w-full py-3 bg-[#0f172a] text-white rounded-xl font-black text-[8px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg">
                                                    <Download size={10} /> Download Receipt
                                                </button>
                                            </div>
                                        )}
  
                                        <p className={`text-[6px] mt-1.5 font-black uppercase opacity-20 italic absolute ${m.sender === 'user' ? '-left-12 bottom-1' : '-right-12 bottom-1'}`}>{m.time}</p>
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-slate-50 border border-black/5 flex items-center justify-center animate-pulse"><Bot size={14} className="text-hospital-primary" /></div>
                                    <div className="bg-slate-50 border border-black/5 px-4 py-3 rounded-[24px] rounded-bl-none shadow-sm flex gap-1">
                                        {[1, 2, 3].map(d => <motion.div key={d} animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: d * 0.2 }} className="w-1 h-1 bg-hospital-primary rounded-full"></motion.div>)}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Core */}
                        <div className="p-6 bg-slate-50 border-t border-black/5 space-y-4 relative z-10 text-left">
                            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-4">
                                <div className="flex-1 relative group">
                                    <input type="text" placeholder={bookingState.active ? "Fill indexing..." : "Query Kamala..."} value={input} onChange={(e) => setInput(e.target.value)}
                                        className="w-full bg-white border border-black/10 focus:border-hospital-primary px-5 py-4 rounded-[24px] outline-none text-[12px] font-bold transition-all text-slate-900 placeholder:text-slate-200 shadow-inner italic" />
                                    <button type="submit" className={`absolute right-4 top-1/2 -translate-y-1/2 text-hospital-primary hover:scale-110 active:scale-90 transition-all ${!input.trim() ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                                        <Send size={20} strokeWidth={2.5} />
                                    </button>
                                </div>
                                {bookingState.active && (
                                    <button onClick={() => setBookingState({ active: false, step: 0, data: {} })} className="w-10 h-10 bg-red-50 border border-red-100 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-md">
                                        <LogOut size={16} />
                                    </button>
                                )}
                            </form>
                            <div className="flex items-center justify-between text-[7px] font-black uppercase tracking-[0.4em] text-slate-300 italic">
                                <span>HIPAA Secured Node</span>
                                <span className={bookingState.active ? "text-hospital-secondary animate-pulse" : ""}>{bookingState.active ? `Step ${bookingState.step + 1}/${steps.length}` : 'AI Tracking active'}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HealthBot;
