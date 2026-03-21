import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, Activity, Calendar, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section className="relative min-h-[90vh] lg:min-h-[80vh] flex items-center justify-center overflow-hidden bg-[#ffffff] pt-24 pb-12 px-6">
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.05, scale: 1 }} transition={{ duration: 3 }}
                    className="absolute -top-[10%] -right-[5%] w-[400px] h-[400px] bg-hospital-secondary rounded-full blur-[80px]" />
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.05, scale: 1 }} transition={{ duration: 4 }}
                    className="absolute bottom-0 -left-[5%] w-[300px] h-[300px] bg-hospital-primary rounded-full blur-[60px]" />
            </div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                    
                    <div className="lg:w-3/5 text-center lg:text-left">
                        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-white/60 backdrop-blur-md rounded-full border border-white/40 shadow-sm mb-6">
                            <div className="p-0.5 bg-green-500 rounded-full animate-pulse-slow"><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-hospital-dark">Emergency Line: 99480 76665 | 24 Hours Open</span>
                        </motion.div>

                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="mb-6 space-y-1">
                            <p className="font-['Noto_Sans_Telugu'] text-4xl lg:text-5xl font-black text-hospital-primary leading-tight tracking-tight">ప్రాణాలను రక్షించడం</p>
                            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-black text-hospital-dark tracking-tighter uppercase opacity-40">Healing <span className="italic">Lives</span></h1>
                        </motion.div>

                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="mb-8">
                            <p className="font-['Noto_Sans_Telugu'] text-2xl lg:text-3xl font-black text-hospital-secondary">ఉత్తమ మధుమేహం వైద్యం</p>
                            <p className="text-hospital-dark/20 text-xs font-black tracking-widest uppercase italic">Best Treatment for Diabetes</p>
                        </motion.div>

                        <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}
                            className="text-compact text-sm md:text-base max-w-md mx-auto lg:mx-0 mb-10 text-gray-400 font-medium">
                            Located at MG Road, Suryapet, we specialize in diagnostics and emergency care. Special consultation for diabetes available 24/7.
                        </motion.p>

                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}
                            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                            <Link to="/book" className="premium-button bg-hospital-dark text-white px-8 py-4 text-xs shadow-xl hover:scale-105 group overflow-hidden relative border-none">
                                <div className="absolute inset-0 bg-hospital-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-0"></div>
                                <Calendar className="relative z-10" size={16} /> 
                                <span className="relative z-10 font-['Noto_Sans_Telugu'] text-lg mr-2 leading-none">డాక్టర్‌ని కలవండి</span>
                                <span className="relative z-10 font-black tracking-widest uppercase text-[9px] opacity-40">/ Book</span>
                            </Link>
                            <Link to="/diagnosis" className="premium-button bg-white text-hospital-dark border border-gray-100 px-6 py-4 text-xs hover:bg-gray-50 flex items-center gap-3">
                               <div className="w-8 h-8 bg-hospital-secondary/10 rounded-xl flex items-center justify-center text-hospital-secondary"><Activity size={14} /></div>
                               <div className="flex flex-col items-start leading-none">
                                  <span className="font-['Noto_Sans_Telugu'] text-base font-black">రక్త పరీక్షలు</span>
                                  <span className="font-black uppercase text-[8px] tracking-widest opacity-30 mt-1">Lab Tests</span>
                               </div>
                            </Link>
                        </motion.div>
                    </div>

                    <div className="lg:w-2/5 relative">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}
                            className="relative z-10 flex justify-center">
                            <div className="w-full aspect-square md:w-[350px] md:h-[350px] bg-gradient-to-tr from-hospital-mint via-white to-hospital-primary/10 rounded-[60px] border-2 border-white shadow-2xl flex items-center justify-center relative group">
                                <img src="/logo.png" className="w-[70%] h-[70%] object-contain drop-shadow-2xl animate-float-gentle" alt="Hospital Logo" />

                                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }}
                                    className="absolute -top-6 -right-6 bg-white p-4 rounded-3xl shadow-xl flex items-center gap-3 border border-gray-50 scale-90">
                                    <div className="w-8 h-8 bg-hospital-primary rounded-xl flex items-center justify-center text-white"><ShieldCheck size={16}/></div>
                                    <div><p className="text-[8px] font-black uppercase text-gray-400 leading-none mb-1">REAL CONSULTATION</p><p className="text-[10px] font-black leading-tight text-hospital-dark font-['Noto_Sans_Telugu']">మంచి స్పందన</p></div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
