import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, Activity, Calendar, Play, Sparkles, Cpu, Fingerprint, Plus, Droplets, Scissors, Pill, Syringe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent pt-24 pb-20 px-6 mesh-gradient">
            
            {/* Soft Clinical Ambient Glows */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-hospital-primary/5 rounded-full blur-[160px] pointer-events-none animate-pulse-soft"></div>
            <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-hospital-secondary/5 rounded-full blur-[140px] pointer-events-none animate-pulse-soft" style={{ animationDelay: '2s' }}></div>

            <div className="container mx-auto max-w-7xl relative z-10 text-center">
                
                <motion.div 
                    initial={{ y: 20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    transition={{ duration: 0.8 }}
                    className="inline-flex items-center gap-3 px-6 py-2 bg-white/40 backdrop-blur-3xl rounded-full border border-black/5 shadow-xl mb-10 mx-auto"
                >
                    <div className="relative">
                        <div className="w-2 h-2 bg-hospital-primary rounded-full animate-ping"></div>
                        <div className="absolute inset-0 w-2 h-2 bg-hospital-primary rounded-full"></div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Advanced Clinical Excellence Center</span>
                </motion.div>

                <div className="max-w-5xl mx-auto mb-16 space-y-4">
                    <motion.div 
                        initial={{ y: 30, opacity: 0 }} 
                        animate={{ y: 0, opacity: 1 }} 
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        <h1 className="text-4xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] flex flex-col items-center">
                            <span className="font-['Playfair_Display'] italic text-hospital-primary leading-none">Scientific</span>
                            <span className="bg-gradient-to-r from-slate-900 to-slate-500 bg-clip-text text-transparent">Pioneering.</span>
                        </h1>
                    </motion.div>
 
                    <motion.div 
                        initial={{ y: 30, opacity: 0 }} 
                        animate={{ y: 0, opacity: 1 }} 
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="flex flex-col items-center justify-center gap-1"
                    >
                        <p className="font-['Noto_Sans_Telugu'] text-3xl lg:text-4xl font-black text-hospital-secondary leading-tight italic glow-text">ప్రాణాలను రక్షించడం మా బాధ్యత</p>
                        <p className="text-[9px] font-black uppercase tracking-[0.6em] text-slate-400">Preserving Humanity through Precision Medicine</p>
                    </motion.div>
                </div>
 
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    transition={{ delay: 0.6, duration: 1 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-6"
                >
                    <Link to="/book" className="animated-button group relative px-10 py-5 bg-[#0f172a] text-white rounded-[28px] font-black text-[10px] uppercase tracking-[0.4em] shadow-4xl overflow-hidden active:scale-95 transition-all">
                        <div className="absolute inset-0 bg-gradient-to-r from-hospital-primary to-hospital-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <span className="relative z-10 font-['Noto_Sans_Telugu'] text-lg mr-3 group-hover:text-white transition-colors">బుకింగ్ చేయండి</span>
                        <span className="relative z-10 opacity-40 group-hover:opacity-100 group-hover:text-white transition-colors">/ RESERVE</span>
                    </Link>
 
                    <Link to="/ai-health" className="animated-button group relative px-8 py-5 bg-white border border-black/5 text-[#0f172a] rounded-[28px] font-black text-[10px] uppercase tracking-[0.4em] shadow-xl overflow-hidden active:scale-95 transition-all">
                        <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-700"><Sparkles size={50} /></div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-9 h-9 bg-hospital-primary/10 rounded-xl flex items-center justify-center text-hospital-primary shadow-inner"><Cpu size={16} /></div>
                            <div className="text-left leading-none">
                                <span className="font-['Noto_Sans_Telugu'] text-base block text-slate-900">AI హెల్త్ స్క్రీన్</span>
                                <span className="text-[7px] text-slate-400 uppercase tracking-widest">DIAGNOSTIC CORE</span>
                            </div>
                        </div>
                    </Link>
                </motion.div>

                {/* Floating Tech Badges - Redesigned for Light Theme */}
                <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    {[
                        { icon: <ShieldCheck size={16}/>, label: 'HIPAA Secure', text: 'Data Privacy', te: 'సురక్షిత డేటా' },
                        { icon: <Activity size={16}/>, label: '24/7 Monitoring', text: 'Live Vitals', te: 'నిరంతర పర్యవేక్షణ' },
                        { icon: <Fingerprint size={16}/>, label: 'Personalized', text: 'Genomic AI', te: 'వ్యక్తిగత వైద్యం' },
                        { icon: <Play size={16}/>, label: 'Telehealth', text: 'Virtual Core', te: 'ఆన్‌లైన్ కన్సల్టేషన్' }
                    ].map((badge, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 30 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ delay: 0.8 + (i * 0.1) }}
                            className="p-6 bg-white/60 backdrop-blur-2xl border border-black/5 rounded-[28px] flex flex-col items-center hover:bg-white/80 hover:border-hospital-primary/30 transition-all group cursor-default shadow-xl"
                        >
                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-black/5 flex items-center justify-center text-hospital-primary mb-3 group-hover:scale-110 transition-transform">{badge.icon}</div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#0f172a] mb-0.5">{badge.label}</h4>
                            <p className="font-['Noto_Sans_Telugu'] text-[10px] font-black text-hospital-secondary mb-1">{badge.te}</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">{badge.text}</p>
                        </motion.div>
                    ))}
                </div>

            </div>

            {/* Static Clinical Decor - Complements Global Background System */}
            <div className="absolute top-1/4 left-[5%] opacity-[0.03] animate-spin-slow pointer-events-none text-slate-900"><Scissors size={120} strokeWidth={1} /></div>
            <div className="absolute bottom-1/4 right-[5%] opacity-[0.03] animate-spin-slow pointer-events-none text-hospital-primary"><Syringe size={100} strokeWidth={1} /></div>
            <div className="absolute top-1/2 right-[10%] opacity-[0.02] animate-pulse pointer-events-none text-hospital-secondary"><Droplets size={150} strokeWidth={1} /></div>

        </section>
    );
};

export default Hero;
