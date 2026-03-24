import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, Activity, Calendar, Play, Sparkles, Cpu, Fingerprint, Plus, Droplets, Scissors, Pill, Syringe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-24 pb-20 px-6 mesh-gradient">
            
            {/* Holographic Background Orbs */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-hospital-primary/10 rounded-full blur-[160px] pointer-events-none animate-pulse-soft"></div>
            <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-hospital-secondary/10 rounded-full blur-[140px] pointer-events-none animate-pulse-soft" style={{ animationDelay: '2s' }}></div>

            <div className="container mx-auto max-w-7xl relative z-10 text-center">
                
                <motion.div 
                    initial={{ y: 20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    transition={{ duration: 0.8 }}
                    className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10 shadow-2xl mb-10 mx-auto"
                >
                    <div className="relative">
                        <div className="w-2 h-2 bg-hospital-primary rounded-full animate-ping"></div>
                        <div className="absolute inset-0 w-2 h-2 bg-hospital-primary rounded-full"></div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">Advanced Clinical Excellence Center</span>
                </motion.div>

                <div className="max-w-5xl mx-auto mb-16 space-y-6">
                    <motion.div 
                        initial={{ y: 30, opacity: 0 }} 
                        animate={{ y: 0, opacity: 1 }} 
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        <h1 className="text-6xl lg:text-9xl font-black text-white tracking-tighter leading-[0.9] flex flex-col items-center">
                            <span className="font-['Playfair_Display'] italic text-hospital-primary">Scientific</span>
                            <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">Pioneering.</span>
                        </h1>
                    </motion.div>

                    <motion.div 
                        initial={{ y: 30, opacity: 0 }} 
                        animate={{ y: 0, opacity: 1 }} 
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="flex flex-col items-center justify-center gap-2"
                    >
                        <p className="font-['Noto_Sans_Telugu'] text-4xl lg:text-5xl font-black text-hospital-secondary leading-tight italic glow-text">ప్రాణాలను రక్షించడం మా బాధ్యత</p>
                        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-gray-500">Preserving Humanity through Precision Medicine</p>
                    </motion.div>
                </div>

                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    transition={{ delay: 0.6, duration: 1 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-8"
                >
                    <Link to="/book" className="group relative px-12 py-6 bg-white text-black rounded-[32px] font-black text-xs uppercase tracking-[0.4em] shadow-2xl overflow-hidden hover:scale-105 transition-all">
                        <div className="absolute inset-0 bg-gradient-to-r from-hospital-primary to-hospital-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <span className="relative z-10 font-['Noto_Sans_Telugu'] text-xl mr-3 group-hover:text-white transition-colors">బుకింగ్ చేయండి</span>
                        <span className="relative z-10 opacity-40 group-hover:opacity-100 group-hover:text-white transition-colors">/ RESERVE</span>
                    </Link>

                    <Link to="/ai-health" className="group relative px-10 py-6 bg-white/5 backdrop-blur-3xl text-white rounded-[32px] font-black text-xs uppercase tracking-[0.4em] border border-white/10 shadow-xl overflow-hidden hover:scale-105 transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-700"><Sparkles size={60} /></div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-10 h-10 bg-hospital-primary/20 rounded-2xl flex items-center justify-center text-hospital-primary shadow-inner"><Cpu size={18} /></div>
                            <div className="text-left leading-none">
                                <span className="font-['Noto_Sans_Telugu'] text-lg block">AI హెల్త్ స్క్రీన్</span>
                                <span className="text-[8px] opacity-40 uppercase tracking-widest">DIAGNOSTIC CORE</span>
                            </div>
                        </div>
                    </Link>
                </motion.div>

                {/* Floating Tech Badges - Redesigned for Dark Theme */}
                <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    {[
                        { icon: <ShieldCheck size={16}/>, label: 'HIPAA Secure', text: 'Data Privacy' },
                        { icon: <Activity size={16}/>, label: '24/7 Monitoring', text: 'Live Vitals' },
                        { icon: <Fingerprint size={16}/>, label: 'Personalized', text: 'Genomic AI' },
                        { icon: <Play size={16}/>, label: 'Telehealth', text: 'Virtual Core' }
                    ].map((badge, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 30 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ delay: 0.8 + (i * 0.1) }}
                            className="p-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[28px] flex flex-col items-center hover:bg-white/10 hover:border-hospital-primary/30 transition-all group cursor-default shadow-2xl"
                        >
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-hospital-primary mb-3 group-hover:scale-110 transition-transform">{badge.icon}</div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-white mb-1">{badge.label}</h4>
                            <p className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.2em]">{badge.text}</p>
                        </motion.div>
                    ))}
                </div>

            </div>

            {/* Static Clinical Decor - Complements Global Background System */}
            <div className="absolute top-1/4 left-[5%] opacity-[0.03] animate-spin-slow pointer-events-none text-white"><Scissors size={120} strokeWidth={1} /></div>
            <div className="absolute bottom-1/4 right-[5%] opacity-[0.03] animate-spin-slow pointer-events-none text-hospital-primary"><Syringe size={100} strokeWidth={1} /></div>
            <div className="absolute top-1/2 right-[10%] opacity-[0.02] animate-pulse pointer-events-none text-hospital-secondary"><Droplets size={150} strokeWidth={1} /></div>

        </section>
    );
};

export default Hero;
