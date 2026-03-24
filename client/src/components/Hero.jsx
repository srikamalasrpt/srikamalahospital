import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, Activity, Calendar, Play, Sparkles, Cpu, Fingerprint, Plus, Droplets, Scissors, Pill, Syringe, Orbit } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-white pt-10 pb-20 px-6 sm:px-12">
            
            {/* Advanced Ambient Matrix */}
            <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-hospital-primary/10 rounded-full blur-[160px] animate-pulse-soft opacity-30"></div>
                <div className="absolute bottom-[5%] left-[-5%] w-[600px] h-[600px] bg-hospital-secondary/5 rounded-full blur-[140px] animate-pulse-soft opacity-20" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="grid lg:grid-cols-12 gap-16 items-center">
                    
                    {/* Content Architecture: Col 1-7 */}
                    <div className="lg:col-span-7 space-y-12">
                        <motion.div 
                            initial={{ x: -30, opacity: 0 }} 
                            animate={{ x: 0, opacity: 1 }} 
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="inline-flex items-center gap-4 px-5 py-2.5 bg-slate-50 border border-black/5 rounded-2xl shadow-sm mb-4"
                        >
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hospital-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-hospital-primary"></span>
                            </span>
                            <span className="text-[11px] font-extrabold uppercase tracking-[0.4em] text-slate-500">Global Clinical Excellence Node</span>
                        </motion.div>

                        <div className="space-y-6">
                            <motion.h1 
                                initial={{ y: 40, opacity: 0 }} 
                                animate={{ y: 0, opacity: 1 }} 
                                transition={{ delay: 0.2, duration: 1.2 }}
                                className="text-5xl md:text-8xl font-black text-slate-900 leading-[0.85] tracking-tight"
                            >
                                <span className="block italic text-hospital-primary font-['Playfair_Display']">Scientific</span>
                                <span className="block">Precision.</span>
                            </motion.h1>

                            <motion.div 
                                initial={{ y: 30, opacity: 0 }} 
                                animate={{ y: 0, opacity: 1 }} 
                                transition={{ delay: 0.4, duration: 1 }}
                                className="max-w-2xl"
                            >
                                <p className="font-['Noto_Sans_Telugu'] text-3xl md:text-5xl font-black text-hospital-secondary leading-tight italic mb-4">
                                    ప్రాణాలను రక్షించడం మా బాధ్యత
                                </p>
                                <p className="text-lg md:text-xl font-medium text-slate-500 max-w-xl leading-relaxed font-['Plus_Jakarta_Sans']">
                                    Redefining humanity through advanced clinical telemetry and world-class medical innovation.
                                </p>
                            </motion.div>
                        </div>

                        <motion.div 
                            initial={{ y: 30, opacity: 0 }} 
                            animate={{ y: 0, opacity: 1 }} 
                            transition={{ delay: 0.6, duration: 1 }}
                            className="flex flex-col sm:flex-row items-center gap-6"
                        >
                            <Link to="/book" className="group relative px-12 py-6 bg-slate-900 text-white rounded-[32px] font-bold text-sm uppercase tracking-[0.2em] shadow-2xl overflow-hidden hover:scale-105 active:scale-95 transition-all w-full sm:w-auto text-center">
                                <div className="absolute inset-0 bg-gradient-to-r from-hospital-primary to-hospital-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                <span className="relative z-10 font-['Noto_Sans_Telugu'] text-xl mr-4">బుకింగ్ చేయండి</span>
                                <span className="relative z-10 opacity-60">/ RESERVE</span>
                            </Link>

                            <Link to="/ai-health" className="group flex items-center gap-5 p-2 pr-10 bg-white border border-black/5 rounded-[32px] shadow-xl hover:shadow-2xl transition-all w-full sm:w-auto">
                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-hospital-primary shadow-inner group-hover:rotate-12 transition-transform">
                                    <Cpu size={24} />
                                </div>
                                <div className="text-left">
                                    <span className="font-['Noto_Sans_Telugu'] text-lg block text-slate-900 font-bold leading-none mb-1">AI హెల్త్</span>
                                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">Scout Core</span>
                                </div>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Tech Matrix: Col 8-12 */}
                    <div className="lg:col-span-5 relative hidden lg:block">
                        <div className="grid grid-cols-2 gap-6 scale-110 translate-x-12">
                            {[
                                { icon: <ShieldCheck />, title: 'HIPAA', sub: 'SECURE', te: 'సురక్షితం' },
                                { icon: <Activity />, title: 'LIVE', sub: 'VITALS', te: 'పర్యవేక్షణ' },
                                { icon: <Fingerprint />, title: 'BIOMETRIC', sub: 'IDENTITY', te: 'గుర్తింపు' },
                                { icon: <Droplets />, title: 'PLASMA', sub: 'CORE', te: 'ప్లాస్మా' }
                            ].map((item, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.8 + (i * 0.1), duration: 0.8 }}
                                    className="p-10 bg-white shadow-4xl rounded-[40px] border border-black/5 flex flex-col items-center group cursor-crosshair"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-black/5 flex items-center justify-center text-hospital-primary mb-6 group-hover:bg-hospital-primary group-hover:text-white transition-all duration-500 shadow-md">
                                        {item.icon}
                                    </div>
                                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 mb-1">{item.title}</h4>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 opacity-60">{item.sub}</p>
                                    <span className="font-['Noto_Sans_Telugu'] text-sm font-bold text-hospital-secondary opacity-0 group-hover:opacity-100 transition-opacity">{item.te}</span>
                                </motion.div>
                            ))}
                        </div>
                        
                        {/* Center Decorative Node */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/40 backdrop-blur-3xl rounded-full border border-black/5 flex items-center justify-center shadow-2xl animate-spin-slow">
                            <Orbit size={40} className="text-hospital-primary opacity-20" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Decor Elements */}
            <div className="absolute top-1/4 left-[-10%] opacity-[0.03] animate-spin-slow pointer-events-none text-slate-900 scale-150"><Scissors size={150} /></div>
            <div className="absolute bottom-1/4 right-[-10%] opacity-[0.03] animate-spin-slow pointer-events-none text-hospital-primary scale-150"><Syringe size={150} /></div>
        </section>
    );
};

export default Hero;
