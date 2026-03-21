import React from 'react';
import { Clock, Calendar, CheckCircle, Info, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const OPBoard = () => {
    return (
        <section className="py-20 px-6 bg-white relative overflow-hidden">
            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="flex items-center gap-4 mb-12">
                   <div className="w-[80px] h-0.5 bg-hospital-secondary/20"></div>
                   <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-hospital-secondary">Hospital Bulletin</h4>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    
                    {/* OP TIMINGS SECTION */}
                    <div className="p-10 lg:p-14 bg-emerald-50/70 backdrop-blur-3xl rounded-[60px] border-2 border-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-hospital-primary opacity-5 rounded-bl-[200px] -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-1000"></div>
                        
                        <div className="flex items-center gap-6 mb-10">
                            <div className="w-16 h-16 rounded-[24px] bg-hospital-primary flex items-center justify-center text-white shadow-xl group-hover:rotate-12 transition-all duration-700 shadow-hospital-primary/20"><Clock size={28} /></div>
                            <div>
                                <h3 className="text-3xl font-black text-hospital-dark tracking-tighter leading-none mb-1 font-['Noto_Sans_Telugu']">ఓపిడి సమయాలు</h3>
                                <p className="text-[8px] font-black uppercase text-hospital-secondary tracking-[0.3em] font-sans">Effective Clinical Daily Schedule</p>
                            </div>
                        </div>

                        <div className="space-y-4 lg:space-y-6">
                            <motion.div whileHover={{ x: 6 }} className="flex items-center justify-between p-6 bg-white/60 backdrop-blur-xl border border-white/40 rounded-[32px] shadow-sm transition-all hover:shadow-lg">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-black text-[10px]">AM</div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-hospital-dark/40 font-['Noto_Sans_Telugu'] text-base">ఉదయం (Morning)</span>
                                </div>
                                <span className="text-xl font-black text-hospital-dark tabular-nums tracking-tighter">08:00 - 13:00</span>
                            </motion.div>
                            <motion.div whileHover={{ x: 6 }} className="flex items-center justify-between p-6 bg-white/60 backdrop-blur-xl border border-white/40 rounded-[32px] shadow-sm transition-all hover:shadow-lg">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black text-[10px]">PM</div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-hospital-dark/40 font-['Noto_Sans_Telugu'] text-base">సాయంత్రం (Evening)</span>
                                </div>
                                <span className="text-xl font-black text-hospital-dark tabular-nums tracking-tighter">16:00 - 20:00</span>
                            </motion.div>

                            <div className="flex items-center gap-4 p-6 bg-hospital-dark text-white rounded-[32px] mt-10 shadow-xl relative overflow-hidden group/alert">
                                <div className="absolute inset-0 bg-hospital-primary translate-y-full group-hover/alert:translate-y-0 transition-transform duration-700 opacity-20"></div>
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><ShieldCheck size={18} className="text-hospital-primary" /></div>
                                <div className="leading-none">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Critical Response</p>
                                    <h4 className="text-base font-black tracking-widest uppercase font-['Noto_Sans_Telugu']">అత్యవసర విభాగం 24/7 తెరిచి ఉంటుంది</h4>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* HOLIDAY BOARD SECTION */}
                    <div className="p-10 lg:p-14 bg-hospital-dark text-white rounded-[60px] shadow-3xl relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-8 text-hospital-primary opacity-5 group-hover:rotate-45 group-hover:scale-125 transition-all duration-1000"><Calendar size={150}/></div>
                         
                         <div className="flex items-center gap-6 mb-10">
                            <div className="w-16 h-16 rounded-[24px] bg-white/10 flex items-center justify-center text-hospital-primary shadow-xl border border-white/10 transition-transform duration-500"><Calendar size={28} /></div>
                            <div>
                                <h3 className="text-3xl font-black text-white tracking-tighter leading-none mb-1 font-['Noto_Sans_Telugu']">సెలవు దినాలు</h3>
                                <p className="text-[8px] font-black uppercase text-hospital-primary tracking-[0.3em] font-sans">Opd Holiday Notifications</p>
                            </div>
                        </div>

                        <div className="mt-12 scale-95 group-hover:scale-100 transition-transform duration-1000">
                             <div className="p-8 bg-white/5 border-2 border-dashed border-white/10 rounded-[48px] text-center relative overflow-hidden mb-10">
                                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-hospital-primary mb-4 font-['Noto_Sans_Telugu'] text-xs">రాబోయే సెలవు</p>
                                <h4 className="text-4xl font-serif italic mb-2 text-white font-black italic">మార్చి 25, 2026</h4>
                                <p className="text-[8px] font-medium text-white/30 tracking-widest leading-relaxed uppercase italic">Limited OPD Services - Regular Emergency Ward Status</p>
                                
                                <div className="flex items-center gap-3 justify-center py-4 bg-white/10 rounded-[28px] border border-white/5 mt-8">
                                    <div className="p-1.5 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/20"></div>
                                    <p className="text-[8px] font-black tracking-[0.2em] uppercase">Emergency Ward Active</p>
                                </div>
                             </div>

                             <a href="tel:+919154404051" className="w-full flex items-center justify-between p-6 bg-hospital-primary text-white font-black text-[10px] uppercase tracking-[0.1em] rounded-[32px] hover:bg-white hover:text-hospital-dark transition-all shadow-xl group/call">
                                 <span className="font-['Noto_Sans_Telugu'] text-lg tracking-normal">ఫోన్ చేయండి (Call Support)</span>
                                 <div className="p-2 bg-white/20 rounded-xl group-hover/call:rotate-12 group-hover/call:bg-hospital-dark group-hover/call:text-white transition-all"><Phone size={18}/></div>
                             </a>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default OPBoard;
