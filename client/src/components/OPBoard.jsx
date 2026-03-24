import React from 'react';
import { Clock, Calendar, CheckCircle, Info, Phone, ArrowRight, ShieldCheck, Scissors, Syringe, Droplets, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const OPBoard = () => {
    return (
        <section className="py-24 px-6 bg-white relative overflow-hidden">
            
            {/* Background Medical Matrix */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-hospital-primary/5 rounded-full blur-[140px] pointer-events-none animate-pulse-soft"></div>
            <div className="absolute -bottom-40 -left-20 w-[400px] h-[400px] bg-hospital-secondary/5 rounded-full blur-[120px] pointer-events-none animate-pulse-soft" style={{ animationDelay: '3s' }}></div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="flex items-center gap-6 mb-16">
                   <div className="w-16 h-px bg-hospital-secondary/30"></div>
                   <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-hospital-secondary">Digital Clinical Registry Bulletin // క్లినికల్ బోర్డు</h4>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
                    
                    {/* OP TIMINGS SECTION - High Tech light Glass */}
                    <div className="p-12 lg:p-16 bg-white border border-black/5 rounded-[60px] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-hospital-primary opacity-5 rounded-bl-[200px] -mr-12 -mt-12 group-hover:scale-125 transition-transform duration-1000"></div>
                        
                        <div className="flex items-center gap-8 mb-14 text-left">
                            <div className="w-20 h-20 rounded-[30px] bg-slate-50 border border-black/5 flex items-center justify-center text-hospital-primary shadow-xl group-hover:rotate-12 transition-all duration-700 shadow-hospital-primary/5"><Clock size={32} /></div>
                            <div className="text-left">
                                <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-2 font-['Noto_Sans_Telugu'] text-left">ఓపిడి సమయాలు</h3>
                                <p className="text-[9px] font-black uppercase text-hospital-secondary tracking-[0.4em] font-sans opacity-60 text-left">Precision Clinical Daily Schedule</p>
                            </div>
                        </div>

                        <div className="space-y-6 lg:space-y-8">
                            {[
                                { label: 'ఉదయం (Morning)', time: '08:00 - 13:00', type: 'AM', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                                { label: 'సాయంత్రం (Evening)', time: '16:00 - 20:00', type: 'PM', color: 'text-blue-500', bg: 'bg-blue-50' }
                            ].map((slot, i) => (
                                <motion.div key={i} whileHover={{ x: 10, backgroundColor: 'rgba(0,0,0,0.02)' }} className="flex items-center justify-between p-8 bg-slate-50/50 border border-black/5 rounded-[40px] shadow-lg transition-all cursor-default">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-12 h-12 ${slot.bg} ${slot.color} rounded-2xl flex items-center justify-center font-black text-[12px] border border-current/10 shadow-inner`}>{slot.type}</div>
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Clinical Peak Phase</span>
                                            <span className="text-lg font-black text-slate-900 font-['Noto_Sans_Telugu']">{slot.label}</span>
                                        </div>
                                    </div>
                                    <span className="text-2xl lg:text-3xl font-black text-hospital-primary tabular-nums tracking-tighter group-hover:scale-110 transition-transform">{slot.time}</span>
                                </motion.div>
                            ))}

                            <div className="flex items-center gap-6 p-8 bg-[#0f172a] text-white rounded-[40px] mt-12 shadow-4xl relative overflow-hidden group/alert hover:bg-hospital-secondary transition-all cursor-pointer">
                                <div className="absolute inset-0 bg-white translate-y-full group-hover/alert:translate-y-0 transition-transform duration-1000 opacity-10"></div>
                                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20"><ShieldCheck size={26} className="text-hospital-primary animate-pulse" /></div>
                                <div className="leading-tight text-left">
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-hospital-primary mb-2 opacity-60 text-left">Level-1 Critical Priority</p>
                                    <h4 className="text-xl font-black tracking-tight font-['Noto_Sans_Telugu'] text-left">అత్యవసర విభాగం 24/7 తెరిచి ఉంటుంది</h4>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1 italic text-left">Continuous ER Surveillance Active</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* HOLIDAY BOARD SECTION - light High Contrast */}
                    <div className="p-12 lg:p-16 bg-white rounded-[60px] border border-black/5 shadow-2xl relative overflow-hidden group">
                         <div className="absolute top-1/2 right-0 p-12 text-hospital-primary opacity-5 group-hover:rotate-[20deg] group-hover:scale-150 transition-all duration-1000 pointer-events-none"><Calendar size={200}/></div>
                         
                         <div className="flex items-center gap-8 mb-14 relative z-10 text-left">
                            <div className="w-20 h-20 rounded-[30px] bg-slate-50 flex items-center justify-center text-hospital-primary shadow-xl border border-black/5 transition-transform duration-700 hover:rotate-6"><Calendar size={32} /></div>
                            <div>
                                <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-2 font-['Noto_Sans_Telugu'] text-left">సెలవు దినాలు</h3>
                                <p className="text-[9px] font-black uppercase text-hospital-primary tracking-[0.4em] font-sans opacity-60 text-left">OPD Notifications Protocol</p>
                            </div>
                        </div>

                        <div className="mt-14 relative z-10">
                             <div className="p-10 bg-slate-50 border-2 border-dashed border-black/5 rounded-[50px] text-center relative overflow-hidden mb-12 group-hover:border-hospital-primary/30 transition-all duration-700 text-left">
                                <p className="text-[11px] font-black uppercase tracking-[0.6em] text-hospital-primary mb-6 font-['Noto_Sans_Telugu']">రాబోయే సెలవు</p>
                                <h4 className="text-3xl lg:text-5xl font-['Playfair_Display'] italic mb-4 text-slate-900 font-black">మార్చి 25, 2026</h4>
                                <p className="text-[9px] font-medium text-slate-500 tracking-[0.4em] leading-relaxed uppercase italic max-w-xs mx-auto">Limited Outpatient Cycle - Regular Emergency Response Status Active</p>
                                
                                <div className="flex items-center gap-4 justify-center py-5 bg-white border border-black/5 rounded-[32px] mt-10 shadow-lg">
                                    <div className="p-2 bg-green-500 rounded-full animate-ping absolute opacity-20"></div>
                                    <div className="p-2 bg-green-500 rounded-full shadow-lg shadow-green-500/30 relative z-10"></div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-800">Critical Care Active</p>
                                </div>
                             </div>

                             <a href="tel:+919154404051" className="animated-button w-full flex items-center justify-between p-8 bg-[#0f172a] text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-[35px] hover:bg-hospital-secondary transition-all shadow-xl group/call">
                                 <span className="font-['Noto_Sans_Telugu'] text-lg tracking-normal">ఫోన్ చేయండి</span>
                                 <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover/call:rotate-12 group-hover/call:bg-white group-hover/call:text-hospital-secondary transition-all"><Phone size={22}/></div>
                             </a>
                        </div>
                    </div>

                </div>
            </div>

            {/* Background Spatials */}
            <div className="absolute top-1/4 right-[5%] opacity-[0.03] text-slate-900 rotate-12"><Scissors size={140} /></div>
            <div className="absolute bottom-1/4 left-[5%] opacity-[0.03] text-hospital-secondary -rotate-12"><Droplets size={120} /></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.01] text-slate-900"><Plus size={300} strokeWidth={0.5} /></div>

        </section>
    );
};

export default OPBoard;
