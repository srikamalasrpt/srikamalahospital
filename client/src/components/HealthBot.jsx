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
    const [allowOnlinePayment, setAllowOnlinePayment] = useState(true);
    const scrollRef = useRef(null);

    const steps = [
        { key: 'name', q: { te: "దయచేసి మీ పూర్తి పేరు తెలియజేయండి?", en: "Please provide your full name?" } },
        { key: 'phone', q: { te: "మీ ఫోన్ నంబర్ ఎంత?", en: "What is your phone number?" } },
        { key: 'age', q: { te: "మీ వయస్సు ఎంత?", en: "How old are you?" } },
        { key: 'gender', q: { te: "మీ లింగం? (పురుషుడు/స్త్రీ/ఇతరము)", en: "Your gender? (Male/Female/Other)" } },
        { key: 'department', q: { te: "ఏ విభాగంలో పరీక్ష చేయించుకోవాలి? (General, Cardiology, etc.)", en: "Which department would you like to visit? (General, Cardiology, etc.)" } },
        { key: 'paymentMethod', q: { te: "చెల్లింపు విధానం? (Online/ఆసుపత్రిలో)", en: "Payment Method? (Online/Pay at Hospital)" } }
    ].filter(s => s.key !== 'paymentMethod' || allowOnlinePayment);

    useEffect(() => {
        getConfig().then(resp => {
            if (resp.data.success) {
                setAllowOnlinePayment(resp.data.config.allowOnlinePayment ?? true);
            }
        });
    }, []);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const welcome = {
                id: 'welcome',
                text: language === 'te' 
                    ? "శ్రీ కమల హాస్పిటల్ క్లినికల్ AI కోర్ కు స్వాగతం. నేను డాక్టర్ కమల. మీకు ఎలా సహాయపడగలను?" 
                    : "Welcome to Sri Kamala Hospital Clinical AI Core. I am Dr. Kamala. How can I assist you today?",
                sender: 'bot',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages([welcome]);
        }
    }, [language, isOpen]);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, isTyping]);

    const toggleLanguage = () => setLanguage(prev => prev === 'te' ? 'en' : 'te');

    const generateReceiptPDF = (data) => {
        const doc = new jsPDF();
        
        // Add styling and content to PDF - Clinical White Theme
        doc.setFillColor(248, 250, 252); // bg-slate-50
        doc.rect(0, 0, 210, 297, 'F');
        
        doc.setTextColor(0, 204, 204);
        doc.setFontSize(24);
        doc.text("SRI KAMALA HOSPITAL", 105, 40, { align: 'center' });
        
        doc.setTextColor(15, 23, 42); // slate-900
        doc.setFontSize(10);
        doc.text("CLINICAL APPOINTMENT RECEIPT", 105, 50, { align: 'center' });
        
        doc.setDrawColor(15, 23, 42, 0.1);
        doc.line(20, 60, 190, 60);
        
        const details = [
            ["Token Index", data.token || "PENDING"],
            ["Patient Identity", data.name],
            ["Primary Contact", data.phone],
            ["Age Protocol", data.age],
            ["Gender", data.gender],
            ["Clinical Node", data.department],
            ["Payment Protocol", data.paymentMethod || "Institutional Credit"],
            ["Verification Status", "VERIFIED BY AI CORE"]
        ];
        
        let y = 80;
        details.forEach(([label, val]) => {
            doc.setTextColor(100, 116, 139); // slate-500
            doc.text(label.toUpperCase(), 30, y);
            doc.setTextColor(15, 23, 42); // slate-900
            doc.text(String(val), 120, y);
            y += 15;
        });
        
        doc.setTextColor(0, 204, 204, 0.5);
        doc.setFontSize(8);
        doc.text("This is an electronically generated document powered by Kamala AI Core v5.0", 105, 250, { align: 'center' });
        
        doc.save(`Receipt_${data.name}.pdf`);
    };

    const handleSend = async (manualText = null) => {
        const text = manualText || input;
        if (!text.trim()) return;

        const userMsg = { id: Date.now(), text, sender: 'user', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        if (bookingState.active) {
            const currentStep = steps[bookingState.step];
            const updatedData = { ...bookingState.data, [currentStep.key]: text };
            
            if (bookingState.step < steps.length - 1) {
                setBookingState({ ...bookingState, step: bookingState.step + 1, data: updatedData });
                const nextQ = steps[bookingState.step + 1].q[language];
                setTimeout(() => {
                    setMessages(prev => [...prev, { id: Date.now() + 1, text: nextQ, sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
                }, 500);
            } else {
                try {
                    const bookingPayload = { ...updatedData };
                    if (!allowOnlinePayment) bookingPayload.paymentMethod = 'ఆసుపత్రిలో';
                    const resp = await bookAppointment(bookingPayload);
                    const finalData = resp.data.success ? resp.data.appointment : { ...bookingPayload, token: 'ERR-NODE' };
                    
                    const successMsg = language === 'te'
                        ? `నియామకం విజయవంతంగా బుక్ చేయబడింది! మీ టోకెన్: ${finalData.token}. మీ రసీదును ఇక్కడ డౌన్‌లోడ్ చేసుకోవచ్చు.`
                        : `Appointment booked successfully! Your Token: ${finalData.token}. Access your digital receipt below.`;
                    
                    setMessages(prev => [...prev, { 
                        id: Date.now() + 2, 
                        text: successMsg, 
                        sender: 'bot', 
                        isReceipt: true, 
                        receiptData: finalData,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                    }]);
                    setBookingState({ active: false, step: 0, data: {} });
                } catch (err) {
                    setMessages(prev => [...prev, { id: Date.now() + 2, text: "Clinical link error. Please try again.", sender: 'bot' }]);
                } finally {
                    setIsTyping(false);
                }
            }
            return;
        }

        // Generic Chat Logic
        setIsTyping(true);
        try {
            const { chatWithAI } = await import('../utils/api');
            
            // Check if user wants to book
            const lText = text.toLowerCase();
            if (lText.includes('book') || lText.includes('appointment') || lText.includes('బుకింగ్') || lText.includes('అపాయింట్‌మెంట్')) {
                setBookingState({ active: true, step: 0, data: {} });
                setTimeout(() => {
                    setMessages(prev => [...prev, { 
                        id: Date.now() + 1, 
                        text: language === 'te' ? "అపాయింట్‌మెంట్ బుకింగ్ ప్రక్రియను ప్రారంభిస్తున్నాను. మొదట, మీ పేరు చెప్పండి?" : "Initiating booking protocol. First, what is your name?", 
                        sender: 'bot', 
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                    }]);
                    setIsTyping(false);
                }, 600);
                return;
            }

            const prompt = `You are Dr. Kamala, the advanced AI representative of Sri Kamala Hospital. 
                Respond in ${language === 'te' ? 'Telugu' : 'English'}. 
                Be highly empathetic, professional, and helpful. 
                Handle all types of general communication and hospital queries.
                Keep it concise (1-2 sentences). 
                User says: "${text}"`;
            
            const resp = await chatWithAI(prompt);
            const botResponse = resp.data.success ? resp.data.response : "NODE ERROR: Communication link severed.";
            setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        } catch (err) {
            setMessages(prev => [...prev, { id: Date.now() + 1, text: "SURVEILLANCE ERROR: Link failure.", sender: 'bot' }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-10 right-10 z-[600]">
            <AnimatePresence>
                {!isOpen && (
                  <div className="relative">
                    <motion.button initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }}
                        whileHover={{ scale: 1.15, rotate: 15 }}
                        onClick={() => setIsOpen(true)}
                        className="animated-button w-14 h-14 bg-white text-hospital-primary rounded-[20px] shadow-4xl flex items-center justify-center group border border-black/5 overflow-hidden relative backdrop-blur-3xl">
                        <Activity size={22} className="relative z-10 group-hover:scale-110 transition-transform shadow-neon-primary" />
                        <div className="absolute inset-0 bg-hospital-primary opacity-0 group-hover:opacity-5 transition-opacity"></div>
                    </motion.button>
                     <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="absolute right-16 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-white border border-black/5 rounded-xl shadow-lg hidden md:block pointer-events-none">
                        <p className="text-[7px] font-black uppercase tracking-[0.4em] whitespace-nowrap text-slate-400 italic">Kamala AI Dispatch</p>
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
                        className="w-[95vw] md:w-[450px] h-[85vh] md:h-[700px] bg-white rounded-[50px] shadow-4xl flex flex-col overflow-hidden border border-black/5 backdrop-blur-3xl relative">
                        
                        {/* Transparent Logo Background Decor */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none select-none">
                            <img src="/logo.png" className="w-[80%] h-auto object-contain" alt="Background Watermark" />
                        </div>

                        {/* High Fidelity Header */}
                        <div className="p-8 bg-slate-50 text-slate-900 border-b border-black/5 relative z-10 flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 p-2 bg-white border border-black/5 rounded-2xl relative shadow-xl group overflow-hidden">
                                     <img src="/logo.png" className="w-full h-full object-contain relative z-10" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-sm font-black tracking-widest uppercase italic leading-none whitespace-nowrap">KAMALA CORE <span className="text-hospital-primary font-serif">v5.0</span></h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-neon-mint"></div>
                                        <span className="text-[8px] uppercase font-black tracking-[0.3em] text-slate-300">Node Sync: 14ms</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <button onClick={toggleLanguage} className="px-4 py-2 bg-white border border-black/5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all text-hospital-secondary group">
                                    <Languages size={14} className="group-hover:rotate-180 transition-transform" /> {language === 'te' ? 'TELUGU' : 'ENGLISH'}
                                </button>
                                <button onClick={() => setIsOpen(false)} className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center hover:bg-red-50 text-red-500 border border-black/5 transition-all group">
                                    <X size={18} className="group-hover:rotate-90 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* Messaging Stream */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 relative z-10 scrollbar-hide">
                            {messages.map((m, i) => (
                                <motion.div key={m.id} initial={{ x: m.sender === 'user' ? 20 : -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                                    className={`flex items-end gap-4 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center border border-black/5 shadow-xl bg-slate-50`}>
                                        {m.sender === 'user' ? <User size={14} className="text-slate-400" /> : <img src="/logo.png" className="w-5 h-5 object-contain" />}
                                    </div>
                                    <div className={`max-w-[85%] text-left rounded-[28px] px-6 py-4 text-[12px] shadow-lg relative ${m.sender === 'user' ? 'bg-hospital-primary text-black rounded-br-none shadow-neon-primary/20' : 'bg-slate-50 text-slate-900 rounded-bl-none border border-black/5'}`}>
                                        <p className={`font-black italic tracking-tight leading-relaxed ${language === 'te' ? "font-['Noto_Sans_Telugu']" : ""}`}>
                                            {m.text}
                                        </p>
                                        
                                        {m.isReceipt && (
                                            <div className="mt-6 space-y-5 pt-5 border-t border-black/5">
                                                <div className="grid grid-cols-2 gap-3 text-[9px] font-black uppercase tracking-widest text-slate-400 italic">
                                                    <div>Subject: {m.receiptData.name}</div>
                                                    <div>Token: {m.receiptData.token}</div>
                                                </div>
                                                <button onClick={() => generateReceiptPDF(m.receiptData)} className="animated-button w-full py-3.5 bg-[#0f172a] text-white rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl">
                                                    <Download size={12} /> Download PDF Triage Pass
                                                </button>
                                            </div>
                                        )}
  
                                        <p className={`text-[7px] mt-2 font-black uppercase opacity-20 italic absolute ${m.sender === 'user' ? '-left-14 bottom-1.5' : '-right-14 bottom-1.5'}`}>{m.time}</p>
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-black/5 flex items-center justify-center animate-pulse shadow-md"><Bot size={16} className="text-hospital-primary" /></div>
                                    <div className="bg-slate-50 border border-black/5 px-6 py-4 rounded-[30px] rounded-bl-none shadow-md flex gap-1.5">
                                        {[1, 2, 3].map(d => <motion.div key={d} animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: d * 0.2 }} className="w-1 h-1 bg-hospital-primary rounded-full"></motion.div>)}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Core */}
                        <div className="p-8 bg-slate-50 border-t border-black/5 space-y-6 relative z-10 text-left">
                            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-5">
                                <div className="flex-1 relative group">
                                    <input type="text" placeholder={bookingState.active ? "Fill clinical index..." : "Handshake with Kamala..."} value={input} onChange={(e) => setInput(e.target.value)}
                                        className="w-full bg-white border border-black/10 focus:border-hospital-primary p-5 rounded-[28px] outline-none text-[13px] font-black transition-all text-slate-900 placeholder:text-slate-200 shadow-inner italic" />
                                    <button type="submit" className={`absolute right-4 top-1/2 -translate-y-1/2 text-hospital-primary hover:scale-110 active:scale-90 transition-all ${!input.trim() ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                                        <Send size={24} strokeWidth={2.5} />
                                    </button>
                                </div>
                                {bookingState.active && (
                                    <button onClick={() => setBookingState({ active: false, step: 0, data: {} })} className="w-12 h-12 bg-red-50 border border-red-100 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-md">
                                        <LogOut size={20} />
                                    </button>
                                )}
                            </form>
                            <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-[0.5em] text-slate-300 italic">
                                <span>HIPAA Encrypted Node</span>
                                <span className={bookingState.active ? "text-hospital-secondary animate-pulse" : ""}>{bookingState.active ? `Booking Step ${bookingState.step + 1}/${steps.length}` : 'Surveillance Active'}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HealthBot;
